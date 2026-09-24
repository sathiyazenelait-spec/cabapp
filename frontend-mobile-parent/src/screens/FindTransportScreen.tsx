import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, TextInput, Button, Card, Avatar } from 'react-native-paper';

export const FindTransportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [category, setCategory] = useState<'School' | 'College' | 'Work'>('School');
  const [pickup, setPickup] = useState('Kattur, Puducherry');
  const [drop, setDrop] = useState('Green Valley School');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Segment Tabs */}
      <View style={styles.segmentContainer}>
        {(['School', 'College', 'Work'] as const).map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.segmentBtn, category === cat && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, category === cat && styles.segmentTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Form Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <TextInput
            label="Pickup Location"
            value={pickup}
            onChangeText={setPickup}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
            left={<TextInput.Icon icon="map-marker" color="#38bdf8" />}
          />

          <TextInput
            label="Drop Location"
            value={drop}
            onChangeText={setDrop}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
            left={<TextInput.Icon icon="school" color="#10b981" />}
          />

          <View style={styles.timeRow}>
            <Avatar.Icon size={24} icon="clock-outline" style={{ backgroundColor: 'transparent' }} color="#f59e0b" />
            <Text style={styles.timeText}>Time: 8:00 AM - 9:00 AM</Text>
          </View>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('AvailableTransport', { category, pickup, drop })}
            buttonColor="#3B49DF"
            textColor="#fff"
            style={styles.searchBtn}
            labelStyle={{ fontWeight: 'bold', fontSize: 13 }}
          >
            Search Transport
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Searches */}
      <Text style={styles.sectionTitle}>Featured & Recent Searches</Text>
      <View style={styles.recentList}>
        {[
          { title: 'Thoraipakkam Tollgate → Oakridge School Thoraipakkam', sub: 'School • 10:10 PM Night Pick-up Case • Weekly Plan', pickup: 'Thoraipakkam Tollgate', drop: 'Oakridge School, Thoraipakkam' },
          { title: 'Mehta Nagar → ABC Matriculation School', sub: 'School • 8:00 AM Morning Shift', pickup: 'Mehta Nagar', drop: 'ABC Matriculation School' },
          { title: 'Lawspet → ABC College', sub: 'College • 9:00 AM', pickup: 'Lawspet', drop: 'ABC College' },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate('AvailableTransport', { category, pickup: item.pickup, drop: item.drop })}
            style={styles.recentCard}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentSub}>{item.sub}</Text>
            </View>
            <Avatar.Icon size={24} icon="chevron-right" style={{ backgroundColor: 'transparent' }} color="#38bdf8" />
          </TouchableOpacity>
        ))}
      </View>
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#3B49DF',
  },
  segmentText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
  },
  segmentTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardContent: {
    padding: 16,
  },
  input: {
    backgroundColor: '#070b13',
    marginBottom: 12,
    fontSize: 13,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#070b13',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },
  searchBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  recentList: {
    gap: 10,
  },
  recentCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  recentSub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
});
