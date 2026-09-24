import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, Chip, Divider, List } from 'react-native-paper';

interface RouteMatch {
  id: string;
  providerName: string;
  vehicleNo: string;
  vehicleType: string;
  departureTime: string;
  availableSeats: number;
  pricePerMonth: number;
  matchScore: number;
}

export const StudentProfessionalScreen: React.FC = () => {
  const [pickup, setPickup] = useState<string>('Tambaram East');
  const [dropoff, setDropoff] = useState<string>('Chennai IT Park, Taramani');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<RouteMatch[]>([]);

  // Weekly commute schedule mock
  const [schedule] = useState([
    { day: 'Mon - Fri', time: '08:15 AM', type: 'Pickup', location: 'Tambaram East' },
    { day: 'Mon - Fri', time: '05:30 PM', type: 'Dropoff', location: 'Chennai IT Park' },
  ]);

  const handleSearch = () => {
    setSearching(true);
    // Simulate API delay
    setTimeout(() => {
      setSearchResults([
        { id: 'm1', providerName: 'Kumar Cabs', vehicleNo: 'TN 01 AB 1234', vehicleType: 'VAN', departureTime: '08:00 AM', availableSeats: 2, pricePerMonth: 2200, matchScore: 98 },
        { id: 'm2', providerName: 'SRS Travels', vehicleNo: 'TN 02 CD 5678', vehicleType: 'SUV', departureTime: '08:10 AM', availableSeats: 4, pricePerMonth: 3500, matchScore: 92 },
      ]);
      setSearching(false);
    }, 800);
  };

  const handleBook = (match: RouteMatch) => {
    Alert.alert(
      'Confirm Subscription',
      `Would you like to book a seat with ${match.providerName} for ₹${match.pricePerMonth}/month?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => Alert.alert('Success', 'Subscription request submitted! Waiting for driver verification.') }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Profile Bar */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Avatar.Image 
            size={48} 
            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileText}>
            <Text style={styles.welcomeText}>Active Commuter</Text>
            <Text style={styles.commuterName}>Vikram Malhotra</Text>
          </View>
          <IconButton icon="qrcode-scan" iconColor="#38bdf8" size={24} onPress={() => {}} />
        </View>
      </View>

      {/* Digital Boarding Pass */}
      <Card style={styles.passCard}>
        <Card.Content>
          <View style={styles.passHeader}>
            <Text style={styles.passTitle}>Digital Boarding Pass</Text>
            <Chip style={styles.passChip} textStyle={styles.passChipText}>Active Pass</Chip>
          </View>
          
          <View style={styles.passContent}>
            <View style={styles.passDetails}>
              <Text style={styles.passLabel}>ROUTE ID</Text>
              <Text style={styles.passValue}>CH-IT-09</Text>
              
              <Text style={[styles.passLabel, { marginTop: 12 }]}>VALID UNTIL</Text>
              <Text style={styles.passValue}>30 Sep 2026</Text>

              <Text style={[styles.passLabel, { marginTop: 12 }]}>VEHICLE NO</Text>
              <Text style={styles.passValue}>TN 01 AB 1234 (RJ14)</Text>
            </View>
            
            {/* Mock QR Code Display */}
            <View style={styles.qrContainer}>
              <View style={styles.qrCodeBox}>
                {/* Visual Representation of QR blocks */}
                <View style={styles.qrRow}>
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={styles.qrPixel} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                </View>
                <View style={styles.qrRow}>
                  <View style={styles.qrPixel} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={styles.qrPixel} />
                  <View style={styles.qrPixel} />
                </View>
                <View style={styles.qrRow}>
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={styles.qrPixel} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                </View>
                <View style={styles.qrRow}>
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                  <View style={styles.qrPixel} />
                  <View style={[styles.qrPixel, { backgroundColor: '#fff' }]} />
                </View>
              </View>
              <Text style={styles.qrDesc}>Scan on Boarding</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Routine Commute Schedule */}
      <Text style={styles.sectionTitle}>Commute Schedule</Text>
      <Card style={styles.scheduleCard}>
        <Card.Content>
          {schedule.map((item, idx) => (
            <View key={idx}>
              <View style={styles.scheduleRow}>
                <View>
                  <Text style={styles.scheduleDay}>{item.day} • {item.time}</Text>
                  <Text style={styles.scheduleLocation}>{item.location}</Text>
                </View>
                <Chip style={styles.typeChip} textStyle={styles.typeChipText}>
                  {item.type}
                </Chip>
              </View>
              {idx < schedule.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Route Finder Widget */}
      <Text style={styles.sectionTitle}>Find Matching Commutes</Text>
      <Card style={styles.finderCard}>
        <Card.Content>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Point</Text>
            <TextInput
              style={styles.textInput}
              value={pickup}
              onChangeText={setPickup}
              placeholder="Enter pickup address"
              placeholderTextColor="#6b7280"
            />
          </View>
          
          <View style={[styles.inputContainer, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Dropoff Point</Text>
            <TextInput
              style={styles.textInput}
              value={dropoff}
              onChangeText={setDropoff}
              placeholder="Enter dropoff address"
              placeholderTextColor="#6b7280"
            />
          </View>

          <Button 
            mode="contained" 
            onPress={handleSearch} 
            loading={searching}
            style={styles.searchBtn}
            buttonColor="#38bdf8"
            textColor="#0f172a"
          >
            Find Matches
          </Button>

          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Optimal Matches Found</Text>
              {searchResults.map(match => (
                <View key={match.id} style={styles.matchRow}>
                  <View style={styles.matchHeader}>
                    <View>
                      <Text style={styles.matchProvider}>{match.providerName}</Text>
                      <Text style={styles.matchSpecs}>
                        {match.vehicleType} ({match.vehicleNo}) • Departs {match.departureTime}
                      </Text>
                    </View>
                    <Chip style={styles.scoreChip} textStyle={styles.scoreText}>
                      {match.matchScore}% Match
                    </Chip>
                  </View>
                  <View style={styles.matchFooter}>
                    <Text style={styles.matchPrice}>₹{match.pricePerMonth}/mo</Text>
                    <Button 
                      mode="contained-tonal" 
                      onPress={() => handleBook(match)}
                      style={styles.bookBtn}
                      labelStyle={styles.bookBtnLabel}
                    >
                      Book Seat
                    </Button>
                  </View>
                  <Divider style={styles.divider} />
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

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
  },
  header: {
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeText: {
    color: '#6b7280',
    fontSize: 11,
  },
  commuterName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  passCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passTitle: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  passChip: {
    backgroundColor: '#10b98115',
    borderRadius: 4,
    height: 22,
  },
  passChipText: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: 'bold',
  },
  passContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passDetails: {
    flex: 1,
  },
  passLabel: {
    color: '#9ca3af',
    fontSize: 8,
    fontWeight: 'bold',
  },
  passValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  qrContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  qrCodeBox: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 8,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  qrRow: {
    flexDirection: 'row',
    gap: 4,
  },
  qrPixel: {
    width: 12,
    height: 12,
    backgroundColor: '#070b13',
  },
  qrDesc: {
    color: '#9ca3af',
    fontSize: 8,
    marginTop: 6,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scheduleDay: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleLocation: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  typeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 4,
    height: 22,
  },
  typeChipText: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 4,
  },
  finderCard: {
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#070b13',
    padding: 8,
    borderRadius: 6,
  },
  inputLabel: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: 'bold',
  },
  textInput: {
    color: '#fff',
    fontSize: 12,
    padding: 0,
    marginTop: 4,
  },
  searchBtn: {
    marginTop: 16,
    borderRadius: 6,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  matchRow: {
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  matchProvider: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchSpecs: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  scoreChip: {
    backgroundColor: '#10b98115',
    borderRadius: 4,
    height: 20,
  },
  scoreText: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: 'bold',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  matchPrice: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bookBtn: {
    borderRadius: 4,
    height: 28,
    justifyContent: 'center',
  },
  bookBtnLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
});
