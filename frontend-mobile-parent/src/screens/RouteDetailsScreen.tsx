import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { API_BASE } from '../services/api';

export const RouteDetailsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stops, setStops] = useState<any[]>([
    { time: '7:30 AM', name: 'Kattur (Pickup)', done: true },
    { time: '7:45 AM', name: 'Lawspet (Pickup)', done: true },
    { time: '8:05 AM', name: 'Manaveli (Pickup)', done: false },
    { time: '8:10 AM', name: 'Green Valley School (Drop)', done: false },
  ]);

  useEffect(() => {
    fetch(`${API_BASE.SUPER_ADMIN}/api/admin/routes/1/stops`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((s: any, idx: number) => ({
            time: s.expectedPickupTime || s.time || `${7 + Math.floor(idx * 15 / 60)}:${(30 + idx * 15) % 60 === 0 ? '00' : (30 + idx * 15) % 60} AM`,
            name: s.stopName || s.name || `Stop #${idx + 1}`,
            done: s.completed !== undefined ? s.completed : idx < 2
          }));
          setStops(mapped);
        }
      })
      .catch(() => console.log('Using default route stops schedule.'));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Route Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text style={styles.routeHeading}>Kattur → Green Valley School</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Distance</Text>
              <Text style={styles.statValue}>12 km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Estimated Time</Text>
              <Text style={[styles.statValue, { color: '#38bdf8' }]}>45 min</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Stops Schedule */}
      <Card style={styles.scheduleCard}>
        <Card.Content>
          <Text style={styles.scheduleTitle}>Stops Schedule</Text>

          <View style={styles.stopsList}>
            {stops.map((stop, idx) => (
              <View key={idx} style={styles.stopItem}>
                <View style={[styles.stopDot, { backgroundColor: stop.done ? '#10b981' : '#374151' }]}>
                  <Text style={styles.stopDotText}>{stop.done ? '✓' : '●'}</Text>
                </View>
                <View style={styles.stopInfo}>
                  <Text style={[styles.stopName, stop.done && styles.stopNameDone]}>
                    {stop.name}
                  </Text>
                  <Text style={styles.stopTime}>{stop.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('LiveTrack')}
        buttonColor="#3B49DF"
        textColor="#fff"
        icon="map-marker-path"
        style={styles.mapBtn}
        labelStyle={{ fontWeight: 'bold' }}
      >
        View on Map
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 16,
  },
  routeHeading: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#070b13',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  scheduleCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginBottom: 20,
  },
  scheduleTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  stopsList: {
    gap: 14,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stopDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stopInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopName: {
    color: '#9ca3af',
    fontSize: 12,
  },
  stopNameDone: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stopTime: {
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  mapBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
