import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Switch, Avatar, Card, FAB } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSOS, updateSearchParams } from '../store/slices/tripSlice';
import { ServiceInfo } from '../components/ServiceInfo';

export const ParentHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { drivers, selectedDriverId, sosTriggered, searchParams } = useAppSelector(state => state.trip);
  
  const [school, setSchool] = useState(searchParams.school);
  const [pickup, setPickup] = useState(searchParams.pickup);
  const [girlsSafeMode, setGirlsSafeMode] = useState(false);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const handleSearch = () => {
    dispatch(updateSearchParams({ school, pickup }));
    // Filter logic or navigation to results list
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Good Morning Priya Sharma Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.avatarRow}>
          <Avatar.Text size={36} label="PS" style={styles.welcomeAvatar} />
          <View>
            <Text style={styles.welcomeSub}>Good Morning 👋</Text>
            <Text style={styles.welcomeName}>Priya Sharma</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(toggleSOS())}
          style={[styles.sosBtn, sosTriggered && styles.sosBtnActive]}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Widget counters (Template 5) */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#38bdf8' }]}>1</Text>
            <Text style={styles.statLabel}>Contracts</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#10b981' }]}>1</Text>
            <Text style={styles.statLabel}>Children</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#f59e0b' }]}>1</Text>
            <Text style={styles.statLabel}>Active Trips</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#ec4899' }]}>0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Template 1 Service Info Component */}
      <ServiceInfo
        date="18 Ocak 2019"
        plate={selectedDriver.plate}
        statusText="Öğrenciniz servise bindi."
        onLiveTrackPress={() => navigation.navigate('LiveTrack')}
        onBoardingSpotPress={() => navigation.navigate('Passport')}
      />

      {/* Search Cab Form */}
      <Card style={styles.searchCard}>
        <Card.Content style={styles.searchContent}>
          <Text style={styles.searchTitle}>Find School Transport</Text>
          
          <TextInput
            label="School Name"
            value={school}
            onChangeText={setSchool}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
          />

          <TextInput
            label="Pickup Location"
            value={pickup}
            onChangeText={setPickup}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
          />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Girls-Safe Mode (Female Driver)</Text>
            <Switch
              value={girlsSafeMode}
              onValueChange={setGirlsSafeMode}
              color="#38bdf8"
            />
          </View>

          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.searchBtn}
            buttonColor="#38bdf8"
            textColor="#000"
          >
            Find Available Cabs
          </Button>
        </Card.Content>
      </Card>

      {/* Driver Profiles list compare */}
      <Text style={styles.sectionTitle}>Available Cabs Compare</Text>
      {drivers
        .filter(d => !girlsSafeMode || d.id !== 'd3')
        .map(driver => (
          <Card 
            key={driver.id} 
            style={styles.driverCard}
            onPress={() => {
              navigation.navigate('SelectPlan', { driverId: driver.id });
            }}
          >
            <Card.Content>
              <View style={styles.driverHeader}>
                <View>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                </View>
                <Text style={styles.driverPrice}>₹{driver.priceMonthly}/mo</Text>
              </View>
              <View style={styles.driverMeta}>
                <Text style={styles.driverRating}>⭐ {driver.rating} ({driver.trustScore}% Trust)</Text>
                <Text style={styles.driverSeats}>🟢 {driver.seatsAvailable} seats left</Text>
              </View>
            </Card.Content>
          </Card>
      ))}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeAvatar: {
    backgroundColor: '#38bdf8',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#9ca3af',
  },
  welcomeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sosBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sosBtnActive: {
    backgroundColor: '#b91c1c',
  },
  sosText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statContent: {
    padding: 8,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginVertical: 12,
  },
  searchContent: {
    padding: 14,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#070b13',
    marginBottom: 10,
    fontSize: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 13,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  searchBtn: {
    marginTop: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 12,
  },
  driverCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    marginBottom: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverVehicle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  driverPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  driverMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 8,
  },
  driverRating: {
    fontSize: 12,
    color: '#fbbf24',
  },
  driverSeats: {
    fontSize: 12,
    color: '#10b981',
  }
});
