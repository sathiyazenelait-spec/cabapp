import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Linking, Modal } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSOS, setSOSState } from '../store/slices/tripSlice';
import { adminApi, parentApi } from '../services/api';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

export const RouteMapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sosTriggered, sosCallConnected, sosVoiceSmsSent } = useAppSelector(state => state.trip);
  const { activeStopIndex, tripStarted } = useAppSelector(state => state.students);

  // SOS Countdown states
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timerId, setTimerId] = useState<any | null>(null);

  // Stop coordinates on the SVG map (Tambaram area simulation)
  const [stops, setStops] = useState([
    { name: 'Tambaram Junction (Start)', x: 60, y: 320 },
    { name: 'Selaiyur (Stop 2)', x: 140, y: 220 },
    { name: 'Camp Road (Stop 3)', x: 220, y: 150 },
    { name: 'ABC Matriculation School (End)', x: 300, y: 70 },
  ]);

  useEffect(() => {
    adminApi.getRouteStops(1).then(stopsData => {
      if (Array.isArray(stopsData) && stopsData.length > 0) {
        const coords = [
          { x: 60, y: 320 },
          { x: 140, y: 220 },
          { x: 220, y: 150 },
          { x: 300, y: 70 },
        ];
        const mapped = stopsData.map((s: any, idx: number) => ({
          name: s.name || `Stop ${s.sequence || idx + 1}`,
          x: coords[idx % coords.length].x,
          y: coords[idx % coords.length].y,
        }));
        setStops(mapped);
      }
    }).catch(() => {});
  }, []);

  // Interpolate vehicle position between stops based on activeStopIndex
  const activeStop = stops[Math.min(activeStopIndex - 1, stops.length - 1)];

  // SOS Countdown trigger
  const handleSOSPress = () => {
    if (sosTriggered) {
      // Disarm SOS
      dispatch(toggleSOS());
      return;
    }

    setCountdown(5);
    setCountdownActive(true);

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          triggerSOSEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerId(interval);
  };

  const cancelSOS = () => {
    if (timerId) {
      clearInterval(timerId);
    }
    setCountdownActive(false);
  };

  const triggerSOSEmergency = async () => {
    setCountdownActive(false);
    dispatch(setSOSState({ triggered: true, callConnected: false, voiceSmsSent: false }));

    try {
      await parentApi.triggerSos({
        route: 'Tambaram - School Corridor',
        stopIndex: activeStopIndex,
        timestamp: Date.now(),
      });
    } catch (e) {
      console.log('SOS backend dispatch in demo mode');
    }

    // Simulate sending Voice SMS
    setTimeout(() => {
      dispatch(setSOSState({ triggered: true, callConnected: false, voiceSmsSent: true }));
    }, 2000);

    // Call hospital/police
    setTimeout(() => {
      dispatch(setSOSState({ triggered: true, callConnected: true, voiceSmsSent: true }));
      Linking.openURL('tel:108').catch(err => {
        Alert.alert('Emergency Call', 'Simulating call to 108...');
      });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  return (
    <View style={styles.container}>
      
      {/* Satellite Map canvas mock */}
      <View style={styles.mapContainer}>
        <Svg height="100%" width="100%" style={styles.svg}>
          {/* Base Satellite dark green terrain */}
          <Rect width="100%" height="100%" fill="#143422" />
          
          {/* Urban gray area overlays (Tambaram and surrounding blocks) */}
          <Rect x="20" y="280" width="100" height="80" rx="10" fill="#2d3748" opacity="0.6" />
          <Rect x="120" y="180" width="80" height="80" rx="10" fill="#2d3748" opacity="0.6" />
          <Rect x="220" y="80" width="90" height="90" rx="10" fill="#2d3748" opacity="0.6" />

          {/* Forest/Reserve zones */}
          <Path d="M 0,0 L 150,0 Q 80,80 0,120 Z" fill="#064e3b" opacity="0.8" />
          <Path d="M 280,240 Q 340,300 400,380 L 400,240 Z" fill="#064e3b" opacity="0.8" />

          {/* Grid lines (simulated satellite radar coordinate lines) */}
          <Path d="M 0,100 L 400,100 M 0,200 L 400,200 M 0,300 L 400,300" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <Path d="M 100,0 L 100,450 M 200,0 L 200,450 M 300,0 L 300,450" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* Map routes (streets/highways) */}
          <Path
            d="M 60,400 L 60,320 L 140,220 L 220,150 L 300,70 L 300,0"
            fill="none"
            stroke="#4b5563"
            strokeWidth="8"
          />
          {/* Highlighted active route path line */}
          <Path
            d="M 60,320 L 140,220 L 220,150 L 300,70"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeDasharray="4,4"
          />

          {/* Route stops markers */}
          {stops.map((stop, index) => {
            const isActive = index === activeStopIndex - 1;
            return (
              <G key={index}>
                {/* Outer shadow/glow ring */}
                <Circle
                  cx={stop.x}
                  cy={stop.y}
                  r={isActive ? 12 : 8}
                  fill={isActive ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255,255,255,0.1)'}
                  stroke={isActive ? '#0ea5e9' : '#9ca3af'}
                  strokeWidth="1.5"
                />
                {/* Core dot */}
                <Circle
                  cx={stop.x}
                  cy={stop.y}
                  r="4.5"
                  fill={isActive ? '#38bdf8' : '#ffffff'}
                />
              </G>
            );
          })}

          {/* Active vehicle location pointer */}
          {tripStarted && (
            <G>
              <Circle
                cx={activeStop.x}
                cy={activeStop.y}
                r="18"
                fill="rgba(239, 68, 68, 0.15)"
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </G>
          )}
        </Svg>

        {/* Live HUD Header */}
        <View style={styles.hudHeader}>
          <View style={styles.hudStatus}>
            <View style={[styles.pulseDot, { backgroundColor: tripStarted ? '#10b981' : '#f59e0b' }]} />
            <Text style={styles.hudStatusText}>
              {tripStarted ? 'LIVE GPS BROADCASTING' : 'TRIP NOT YET STARTED'}
            </Text>
          </View>
          <Text style={styles.satelliteText}>SATELLITE VIEW (TAMBARAM AREA)</Text>
        </View>

        {/* Live vehicle marker container */}
        {tripStarted && (
          <View style={[styles.vehicleMarker, { top: activeStop.y - 30, left: activeStop.x - 30 }]}>
            <Avatar.Icon size={24} icon="car-sports" style={styles.carIcon} color="#fff" />
            <Text style={styles.carPlate}>RJ14-4656</Text>
          </View>
        )}

        {/* Map markers annotations */}
        <View style={[styles.annotation, { top: 330, left: 75 }]}>
          <Text style={styles.annText}>Tambaram Junc.</Text>
        </View>
        <View style={[styles.annotation, { top: 60, left: 190 }]}>
          <Text style={styles.annText}>ABC School</Text>
        </View>

        {/* Floating SOS Trigger Button */}
        <TouchableOpacity
          style={[styles.floatingSos, sosTriggered && styles.sosTriggeredBtn]}
          onPress={handleSOSPress}
        >
          <Avatar.Icon
            size={36}
            icon="alarm-light"
            style={{ backgroundColor: 'transparent' }}
            color="#fff"
          />
          <Text style={styles.sosBtnText}>{sosTriggered ? 'DISARM SOS' : 'TRIGGER SOS'}</Text>
        </TouchableOpacity>
      </View>

      {/* active stop info widget */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoLabel}>CURRENT DESTINATION</Text>
              <Text style={styles.infoVal}>{stops[Math.min(activeStopIndex - 1, stops.length - 1)].name}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Stop {activeStopIndex} of 4</Text>
            </View>
          </View>

          {/* SOS Safety warning dashboard */}
          {sosTriggered && (
            <View style={styles.sosAlertPanel}>
              <Text style={styles.sosAlertTitle}>🚨 SAFETY SOS EMERGENY SYSTEM ACTIVED</Text>
              <Text style={styles.sosAlertDesc}>
                We detected an accident trigger or manual SOS alert.
              </Text>
              
              <View style={styles.sosStatusRow}>
                <View style={styles.statusItem}>
                  <IconButton
                    icon={sosVoiceSmsSent ? 'check-circle' : 'progress-clock'}
                    iconColor={sosVoiceSmsSent ? '#10b981' : '#f59e0b'}
                    size={16}
                  />
                  <Text style={styles.statusItemText}>Voice SMS sent to Tambaram Hospital & Police</Text>
                </View>
                <View style={styles.statusItem}>
                  <IconButton
                    icon={sosCallConnected ? 'phone-in-talk' : 'progress-clock'}
                    iconColor={sosCallConnected ? '#10b981' : '#f59e0b'}
                    size={16}
                  />
                  <Text style={styles.statusItemText}>Emergency call line 108 dialed</Text>
                </View>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* SOS countdown dialog */}
      <Modal visible={countdownActive} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card style={styles.modalCard}>
            <Card.Content style={styles.modalContent}>
              <Avatar.Icon size={64} icon="alert-octagon" style={styles.warningIcon} color="#fff" />
              <Text style={styles.modalTitle}>CRITICAL EMERGENCY SOS</Text>
              <Text style={styles.modalDesc}>
                Triggering safety dispatch to nearest Hospital and Police Station automatically in:
              </Text>
              
              <Text style={styles.timerNum}>{countdown}</Text>

              <Button
                mode="contained"
                onPress={cancelSOS}
                buttonColor="#ef4444"
                textColor="#fff"
                style={styles.cancelBtn}
              >
                CANCEL ALERT
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#143422',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  hudHeader: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(7, 11, 19, 0.85)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  hudStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hudStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  satelliteText: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2,
  },
  vehicleMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 30,
  },
  carIcon: {
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  carPlate: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    marginTop: 1,
  },
  annotation: {
    position: 'absolute',
    zIndex: 25,
  },
  annText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9ca3af',
    backgroundColor: 'rgba(7, 11, 19, 0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  floatingSos: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 40,
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sosTriggeredBtn: {
    backgroundColor: '#070b13',
    borderColor: '#ef4444',
  },
  sosBtnText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  infoCard: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 8,
    color: '#9ca3af',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  sosAlertPanel: {
    marginTop: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  sosAlertTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  sosAlertDesc: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2,
  },
  sosStatusRow: {
    marginTop: 6,
    gap: -4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  statusItemText: {
    fontSize: 8.5,
    color: '#fff',
    marginLeft: -4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 16,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  warningIcon: {
    backgroundColor: '#ef4444',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  modalDesc: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 14,
  },
  timerNum: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
  },
  cancelBtn: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 2,
  },
});
