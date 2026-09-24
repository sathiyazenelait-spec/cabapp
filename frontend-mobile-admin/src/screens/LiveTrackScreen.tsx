import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateAlertDistance } from '../store/slices/tripSlice';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom lightweight React Native Slider mock for compiling cleanly
const Slider: React.FC<{
  value: number;
  onValueChange: (val: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
}> = ({ value, onValueChange, minimumValue, maximumValue, step }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 }}>
      <TouchableOpacity 
        onPress={() => onValueChange(Math.max(minimumValue, parseFloat((value - step).toFixed(2))))}
        style={{ backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#374151' }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>-</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, height: 6, backgroundColor: '#374151', borderRadius: 3, position: 'relative' }}>
        <View style={{ width: `${((value - minimumValue) / (maximumValue - minimumValue)) * 100}%`, height: '100%', backgroundColor: '#38bdf8', borderRadius: 3 }} />
        <View style={{ left: `${Math.max(0, Math.min(92, ((value - minimumValue) / (maximumValue - minimumValue)) * 92))}%`, top: -5, position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: '#38bdf8' }} />
      </View>
      <TouchableOpacity 
        onPress={() => onValueChange(Math.min(maximumValue, parseFloat((value + step).toFixed(2))))}
        style={{ backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#374151' }}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export const LiveTrackScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { alertDistance, drivers, selectedDriverId } = useAppSelector(state => state.trip);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const handleSOSTrigger = () => {
    Alert.alert(
      '⚠️ EMERGENCY SOS TRIGGER',
      'Are you sure you want to broadcast an emergency alert? Real-time coordinates will be sent to parents, driver dispatch, Super Admin, and local safety desks (Specially configured for child safety and female commuters).',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'TRIGGER SOS', style: 'destructive', onPress: () => Alert.alert('SOS Active', 'SOS broadcast initiated. Keep app open.') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      {/* simulated canvas map background using SVG (Template 2 Map styling) */}
      <View style={styles.mapContainer}>
        
        {/* Fake streets grid overlay */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 16 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>

        <Svg height="100%" width="100%" style={styles.svg}>
          {/* Route path line */}
          <Path
            d="M 50 350 Q 150 200 180 180 T 320 80"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="5,5"
          />
          {/* Radius trigger circle (Template 2) */}
          <Circle
            cx="180"
            cy="180"
            r={alertDistance * 80}
            fill="rgba(56, 189, 248, 0.08)"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          {/* Pickup zone radius mark */}
          <Circle
            cx="180"
            cy="180"
            r="4"
            fill="#38bdf8"
          />
        </Svg>

        {/* Map Markers */}
        <View style={[styles.marker, { top: 162, left: 162 }]}>
          <Avatar.Icon size={24} icon="car" style={styles.carMarker} color="#fff" />
          <Text style={styles.markerText}>Kumar's Van</Text>
        </View>

        <View style={[styles.marker, { bottom: 60, left: 30 }]}>
          <View style={[styles.markerDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.markerText}>Home (Mehta Nagar)</Text>
        </View>

        <View style={[styles.marker, { top: 60, right: 30 }]}>
          <View style={[styles.markerDot, { backgroundColor: '#ef4444' }]} />
          <Text style={styles.markerText}>ABC School</Text>
        </View>

      </View>

      {/* Map Control overlay (Template 2 alert boundary control) */}
      <Card style={styles.controlCard}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>JAMES'S TRIP TO SCHOOL</Text>
            <Button 
              compact 
              mode="text" 
              textColor="#38bdf8"
              onPress={() => navigation.navigate('ParentHome')}
            >
              Back
            </Button>
          </View>

          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Notify when the bus is within:</Text>
            <Text style={styles.sliderVal}>{alertDistance} miles</Text>
          </View>
          
          {/* Slider input */}
          <View style={styles.sliderContainer}>
            <Slider
              value={alertDistance}
              onValueChange={(val) => dispatch(updateAlertDistance(val))}
              minimumValue={0.1}
              maximumValue={1.5}
              step={0.1}
              minimumTrackTintColor="#38bdf8"
              maximumTrackTintColor="#374151"
            />
          </View>

          <View style={styles.etaRow}>
            <View>
              <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
              <Text style={styles.etaTime}>07:52 AM</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>On Time</Text>
            </View>
          </View>

          {/* Visual Route Progression Milestones */}
          <View style={styles.routeMilestones}>
            <Text style={styles.milestoneLabel}>LIVE ROUTE PROGRESSION</Text>
            <View style={styles.milestoneRow}>
              <View style={styles.milestoneCol}>
                <Text style={[styles.milestoneText, styles.milestonePassed]}>Nungambakkam</Text>
                <Text style={styles.milestoneTime}>07:30 AM</Text>
              </View>
              <Text style={styles.milestoneArrow}>➔</Text>
              <View style={styles.milestoneCol}>
                <Text style={[styles.milestoneText, styles.milestoneActive]}>Mehta Nagar</Text>
                <Text style={styles.milestoneTime}>Near Stop</Text>
              </View>
              <Text style={styles.milestoneArrow}>➔</Text>
              <View style={styles.milestoneCol}>
                <Text style={[styles.milestoneText, styles.milestoneUpcoming]}>Anna Arch</Text>
                <Text style={styles.milestoneTime}>08:05 AM</Text>
              </View>
            </View>
          </View>

          <View style={styles.routePoints}>
            <Text style={styles.pointText}>● Start: Nungambakkam East Route</Text>
            <Text style={styles.pointText}>● Dest: Anna Arch Integrated Hub</Text>
          </View>

          {/* Emergency SOS Button for Children and Ladies */}
          <Button
            mode="contained"
            onPress={handleSOSTrigger}
            style={styles.sosButton}
            buttonColor="#ef4444"
            textColor="#fff"
            icon="shield-alert"
          >
            Emergency SOS Trigger
          </Button>

        </Card.Content>
      </Card>

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
    backgroundColor: '#0d1424',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  gridLine: {
    width: '25%',
    height: '25%',
    borderWidth: 0.25,
    borderColor: '#1e293b',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  carMarker: {
    backgroundColor: '#38bdf8',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markerText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  controlCard: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  sliderVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    marginVertical: 4,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  etaLabel: {
    fontSize: 8,
    color: '#9ca3af',
  },
  etaTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  routePoints: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    gap: 4,
  },
  pointText: {
    fontSize: 9,
    color: '#9ca3af',
  },
  routeMilestones: {
    marginTop: 14,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  milestoneLabel: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milestoneCol: {
    alignItems: 'center',
  },
  milestoneText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  milestonePassed: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  milestoneActive: {
    color: '#10b981',
  },
  milestoneUpcoming: {
    color: '#e5e7eb',
  },
  milestoneTime: {
    fontSize: 7,
    color: '#6b7280',
    marginTop: 2,
  },
  milestoneArrow: {
    color: '#4b5563',
    fontSize: 10,
  },
  sosButton: {
    marginTop: 14,
    borderRadius: 8,
  }
});
