import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateAlertDistance, toggleSOS } from '../store/slices/tripSlice';
import Svg, { Circle, Path } from 'react-native-svg';

export const LiveTrackScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { alertDistance, drivers, selectedDriverId } = useAppSelector(state => state.trip);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const [coords, setCoords] = useState({ x: 160, y: 210 });
  const [speed, setSpeed] = useState(38);
  const [tripStatus, setTripStatus] = useState("En Route to Stop 2 (Kasturba Nagar)");
  const [etaMins, setEtaMins] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCoords(prev => {
        const nextX = prev.x < 290 ? prev.x + 3 : 130;
        const nextY = prev.y > 90 ? prev.y - 1.8 : 230;
        const simulatedSpeed = Math.floor(32 + Math.random() * 12);
        setSpeed(simulatedSpeed);
        if (nextX > 250) {
          setTripStatus("Approaching School Gate");
          setEtaMins(2);
        } else {
          setTripStatus("En Route (36 km/h avg)");
          setEtaMins(5);
        }
        return { x: nextX, y: nextY };
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [selectedDriver]);

  const handleSOSTrigger = () => {
    Alert.alert(
      '⚠️ EMERGENCY SOS TRIGGER',
      'Broadcast immediate emergency alert? Real-time coordinates will be transmitted to emergency responders, Super Admin, and parents.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'TRIGGER SOS NOW', 
          style: 'destructive', 
          onPress: () => {
            dispatch(toggleSOS());
            Alert.alert('SOS Active', 'Emergency command center notified.');
          } 
        }
      ]
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${(selectedDriver as any).phone || '+919876543210'}`).catch(() => {
      Alert.alert('Calling Driver', `Calling ${selectedDriver.name} at +919876543210`);
    });
  };

  return (
    <View style={styles.container}>
      {/* Live Map Header Status Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Avatar.Icon size={20} icon="chevron-left" style={{ backgroundColor: 'transparent' }} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>{selectedDriver.name} • {selectedDriver.vehicle || 'Van TN-01-AB-1234'}</Text>
          <Text style={styles.topSub}>{tripStatus}</Text>
        </View>
        <View style={styles.speedBadge}>
          <Text style={styles.speedValue}>{speed}</Text>
          <Text style={styles.speedUnit}>KM/H</Text>
        </View>
      </View>

      {/* Simulated Live Vector Map Canvas */}
      <View style={styles.mapContainer}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>

        <Svg height="100%" width="100%" style={styles.svg}>
          {/* Main Transit Corridor Route Line */}
          <Path
            d="M 50 320 Q 140 230 180 180 T 300 70"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray="6,4"
          />
          {/* Dynamic Geofence Radar Circle */}
          <Circle
            cx="180"
            cy="180"
            r={alertDistance * 65}
            fill="rgba(56, 189, 248, 0.08)"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          {/* Boarding Point */}
          <Circle cx="50" cy="320" r="6" fill="#10b981" />
          {/* Intermediate Waypoint Stop */}
          <Circle cx="180" cy="180" r="5" fill="#f59e0b" />
          {/* Destination School */}
          <Circle cx="300" cy="70" r="7" fill="#ef4444" />
        </Svg>

        {/* Dynamic Vehicle Marker */}
        <View style={[styles.marker, { top: coords.y - 14, left: coords.x - 14 }]}>
          <View style={styles.carMarkerContainer}>
            <Avatar.Icon size={26} icon="van-utility" style={styles.carMarker} color="#fff" />
          </View>
          <View style={styles.markerLabelBox}>
            <Text style={styles.markerLabelText}>{selectedDriver.name} ({speed} km/h)</Text>
          </View>
        </View>

        {/* Fixed Landmarks */}
        <View style={[styles.staticPin, { bottom: 80, left: 30 }]}>
          <Text style={styles.staticPinText}>🏡 Boarding Point</Text>
        </View>
        <View style={[styles.staticPin, { top: 60, right: 30 }]}>
          <Text style={styles.staticPinText}>🏫 ABC Matriculation School</Text>
        </View>
      </View>

      {/* Bottom Telemetry & Controls Drawer */}
      <View style={styles.drawer}>
        {/* Distance & ETA Row */}
        <View style={styles.etaRow}>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>ARRIVAL ESTIMATE</Text>
            <Text style={styles.etaValue}>{etaMins} mins</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>DISTANCE REMAINING</Text>
            <Text style={styles.etaValue}>2.4 km</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>RADAR STATUS</Text>
            <Text style={[styles.etaValue, { color: '#10b981' }]}>Inside Zone</Text>
          </View>
        </View>

        {/* Geofence Radar Distance Selection */}
        <View style={styles.radarControlRow}>
          <View>
            <Text style={styles.radarTitle}>Proximity Radar Corridor</Text>
            <Text style={styles.radarSub}>Triggers push alert when cab enters distance</Text>
          </View>
          <View style={styles.radarPills}>
            {[0.5, 1.0, 2.0].map((dist) => (
              <TouchableOpacity
                key={dist}
                onPress={() => dispatch(updateAlertDistance(dist))}
                style={[styles.radarPill, alertDistance === dist && styles.radarPillActive]}
              >
                <Text style={[styles.radarPillText, alertDistance === dist && styles.radarPillTextActive]}>
                  {dist} mi
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Controls: Call, Conductor WhatsApp, and Emergency SOS */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity onPress={handleCall} style={styles.callDriverBtn}>
            <Avatar.Icon size={20} icon="phone" style={{ backgroundColor: 'transparent' }} color="#fff" />
            <Text style={styles.callDriverText}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Passport')}
            style={styles.passportBtn}
          >
            <Avatar.Icon size={20} icon="qrcode" style={{ backgroundColor: 'transparent' }} color="#38bdf8" />
            <Text style={styles.passportText}>QR Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSOSTrigger} style={styles.sosTriggerBtn}>
            <Avatar.Icon size={20} icon="shield-alert" style={{ backgroundColor: 'transparent' }} color="#fff" />
            <Text style={styles.sosTriggerText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#0b1329',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    padding: 6,
    backgroundColor: '#1e293b',
    borderRadius: 10,
  },
  topInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  topTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  topSub: {
    color: '#38bdf8',
    fontSize: 10,
    marginTop: 1,
  },
  speedBadge: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  speedValue: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  speedUnit: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#070d18',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.15,
  },
  gridLine: {
    width: '25%',
    height: '25%',
    borderWidth: 0.5,
    borderColor: '#38bdf8',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  carMarkerContainer: {
    padding: 3,
    borderRadius: 16,
    backgroundColor: '#3B49DF',
    borderWidth: 2,
    borderColor: '#fff',
  },
  carMarker: {
    backgroundColor: 'transparent',
  },
  markerLabelBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  markerLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  staticPin: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  staticPinText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  drawer: {
    backgroundColor: '#0b1329',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.2)',
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  etaItem: {
    flex: 1,
    alignItems: 'center',
  },
  etaLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  etaValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  etaDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  radarControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  radarTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  radarSub: {
    color: '#94a3b8',
    fontSize: 9,
  },
  radarPills: {
    flexDirection: 'row',
    gap: 6,
  },
  radarPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  radarPillActive: {
    backgroundColor: '#3B49DF',
    borderColor: '#60a5fa',
  },
  radarPillText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  radarPillTextActive: {
    color: '#fff',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callDriverBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 10,
  },
  callDriverText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  passportBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  passportText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sosTriggerBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 10,
  },
  sosTriggerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
