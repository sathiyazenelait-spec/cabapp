import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Avatar, Button, Chip } from 'react-native-paper';

interface RouteMatch {
  id: string;
  matchScore: number;
  matchColor: string;
  category: string;
  pickup: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seatsAvailable: number;
  vehicleType: string;
  vehiclePlate: string;
  seater: string;
  isAc: boolean;
  rating: number;
  priceMonthly: number;
  priceDaily: number;
}

const mockMatches: RouteMatch[] = [
  {
    id: '1',
    matchScore: 95,
    matchColor: '#10b981',
    category: 'Shared Ride',
    pickup: 'Kattur',
    destination: 'ABC College',
    departureTime: '7:30 AM',
    arrivalTime: '8:15 AM',
    seatsAvailable: 20,
    vehicleType: 'Van',
    vehiclePlate: 'TN-XX-5678',
    seater: '5 Seater',
    isAc: true,
    rating: 4.9,
    priceMonthly: 2800,
    priceDaily: 93,
  },
  {
    id: '2',
    matchScore: 88,
    matchColor: '#3b82f6',
    category: 'College Route',
    pickup: 'Kattur',
    destination: 'Sri Venkateswara College',
    departureTime: '7:20 AM',
    arrivalTime: '8:10 AM',
    seatsAvailable: 12,
    vehicleType: 'Car',
    vehiclePlate: 'TN-XX-9012',
    seater: '4 Seater',
    isAc: true,
    rating: 4.8,
    priceMonthly: 3200,
    priceDaily: 106,
  },
  {
    id: '3',
    matchScore: 82,
    matchColor: '#f59e0b',
    category: 'Work Route',
    pickup: 'Lawspet',
    destination: 'IT Park (Chennai)',
    departureTime: '8:00 AM',
    arrivalTime: '9:00 AM',
    seatsAvailable: 8,
    vehicleType: 'Van',
    vehiclePlate: 'TN-XX-3456',
    seater: '7 Seater',
    isAc: true,
    rating: 4.9,
    priceMonthly: 3500,
    priceDaily: 116,
  },
];

export const AIRouteMatchingScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'nearby'>('recommended');

  const handleBook = (item: RouteMatch) => {
    Alert.alert(
      'Smart Match Reserved',
      `You selected ${item.vehicleType} (${item.vehiclePlate}) for ${item.pickup} ➔ ${item.destination}. Monthly fare: ₹${item.priceMonthly}.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Smart Match AI Card */}
      <Card style={styles.bannerCard}>
        <Card.Content style={styles.bannerContent}>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bannerTitle}>Smart Match for You</Text>
            <Text style={styles.bannerSub}>
              Based on your location, destination, time, budget and travel preference.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'recommended' && styles.activeTabBtn]}
          onPress={() => setActiveTab('recommended')}
        >
          <Text style={[styles.tabText, activeTab === 'recommended' && styles.activeTabText]}>
            Recommended Routes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'nearby' && styles.activeTabBtn]}
          onPress={() => setActiveTab('nearby')}
        >
          <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
            Nearby Options
          </Text>
        </TouchableOpacity>
      </View>

      {/* Route Cards */}
      <View style={styles.list}>
        {mockMatches.map((m) => (
          <Card key={m.id} style={styles.routeCard} onPress={() => handleBook(m)}>
            <Card.Content>
              {/* Header Badges */}
              <View style={styles.badgeRow}>
                <View style={[styles.matchPill, { backgroundColor: m.matchColor }]}>
                  <Text style={styles.matchPillText}>{m.matchScore}% Match</Text>
                </View>
                <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                  {m.category}
                </Chip>
              </View>

              {/* Route line */}
              <View style={styles.routeRow}>
                <Avatar.Icon size={20} icon="map-marker-distance" color="#38bdf8" style={{ backgroundColor: 'transparent' }} />
                <Text style={styles.routeTitle}>
                  {m.pickup} <Text style={{ color: '#9ca3af' }}>➔</Text> {m.destination}
                </Text>
              </View>

              {/* Time & Seats */}
              <View style={styles.infoRow}>
                <View style={styles.iconText}>
                  <Avatar.Icon size={16} icon="clock-outline" color="#38bdf8" style={{ backgroundColor: 'transparent' }} />
                  <Text style={styles.infoText}>{m.departureTime} - {m.arrivalTime}</Text>
                </View>
                <View style={styles.iconText}>
                  <Avatar.Icon size={16} icon="account-group" color="#10b981" style={{ backgroundColor: 'transparent' }} />
                  <Text style={styles.infoText}>{m.seatsAvailable} seats available</Text>
                </View>
              </View>

              {/* Vehicle & Price */}
              <View style={styles.footerRow}>
                <View style={styles.vehicleInfo}>
                  <Avatar.Icon size={32} icon="van-utility" color="#38bdf8" style={styles.vehicleIcon} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.vehicleName}>{m.vehicleType} {m.vehiclePlate}</Text>
                    <Text style={styles.vehicleSub}>{m.seater} · {m.isAc ? 'AC' : 'Non-AC'}</Text>
                    <Text style={styles.ratingText}>⭐ {m.rating} <Text style={{ color: '#38bdf8' }}>Verified Driver</Text></Text>
                  </View>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceMonthly}>₹{m.priceMonthly} <Text style={styles.priceUnit}>/month</Text></Text>
                  <Text style={styles.priceDaily}>₹{m.priceDaily}/day</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* AI Insights Card */}
      <Card style={styles.insightCard}>
        <Card.Content style={styles.insightContent}>
          <Avatar.Icon size={28} icon="lightbulb-on" color="#38bdf8" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)' }} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.insightTitle}>AI Insights</Text>
            <Text style={styles.insightSub}>
              High demand for Kattur ➔ ABC College route. Consider adding 2 more vehicles to increase availability.
            </Text>
          </View>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#111e38',
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bannerSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  list: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  matchPillText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 10,
  },
  categoryChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    height: 24,
  },
  categoryChipText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  routeTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: 4,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 10,
    marginLeft: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: 4,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  vehicleName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  vehicleSub: {
    color: '#94a3b8',
    fontSize: 9,
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 9,
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceMonthly: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
  },
  priceUnit: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: 'normal',
  },
  priceDaily: {
    color: '#94a3b8',
    fontSize: 9,
  },
  insightCard: {
    backgroundColor: '#0c1d3b',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 14,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  insightTitle: {
    color: '#38bdf8',
    fontWeight: 'bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  insightSub: {
    color: '#e2e8f0',
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
});
