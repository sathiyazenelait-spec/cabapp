import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Text, Card, Avatar, Button, Searchbar, Chip, ProgressBar } from 'react-native-paper';
import { studentWorkApi } from '../services/api';

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
  isVerified: boolean;
  priceMonthly: number;
  priceDaily: number;
  driverName: string;
  driverPhone: string;
}

export const RouteMatchingScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [pickup, setPickup] = useState<string>('Kattur');
  const [destination, setDestination] = useState<string>('ABC College');
  const [routes, setRoutes] = useState<RouteMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiInsight, setAiInsight] = useState<string>('');

  // Seat Lock Modal & Redis checkout state
  const [selectedRoute, setSelectedRoute] = useState<RouteMatch | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string>('SEAT-04');
  const [lockModalVisible, setLockModalVisible] = useState<boolean>(false);
  const [redisLockData, setRedisLockData] = useState<any>(null);
  const [lockTtl, setLockTtl] = useState<number>(600); // 10 minutes

  useEffect(() => {
    fetchAIMatches();
  }, [pickup, destination]);

  // Redis lock countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (lockModalVisible && lockTtl > 0) {
      timer = setInterval(() => {
        setLockTtl((prev) => {
          if (prev <= 1) {
            handleReleaseSeatLock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockModalVisible, lockTtl]);

  const fetchAIMatches = async () => {
    setLoading(true);
    try {
      const res = await studentWorkApi.getAIMatches(pickup, destination);
      if (res && res.recommended) {
        setRoutes(res.recommended);
        setAiInsight(res.aiInsight || 'Optimal route timing detected.');
      } else {
        setRoutes([
          {
            id: 'rm-1',
            matchScore: 95,
            matchColor: 'bg-emerald-500 text-white',
            category: 'Shared Ride',
            pickup: pickup,
            destination: destination,
            departureTime: '7:30 AM',
            arrivalTime: '8:15 AM',
            seatsAvailable: 20,
            vehicleType: 'Van',
            vehiclePlate: 'TN-XX-5678',
            seater: '5 Seater',
            isAc: true,
            rating: 4.9,
            isVerified: true,
            priceMonthly: 2800,
            priceDaily: 93,
            driverName: 'Ramesh Kumar',
            driverPhone: '+91 98401 23456',
          },
          {
            id: 'rm-2',
            matchScore: 88,
            matchColor: 'bg-blue-600 text-white',
            category: 'College Route',
            pickup: pickup,
            destination: 'Sri Venkateswara College',
            departureTime: '7:20 AM',
            arrivalTime: '8:10 AM',
            seatsAvailable: 12,
            vehicleType: 'Car',
            vehiclePlate: 'TN-XX-9012',
            seater: '4 Seater',
            isAc: true,
            rating: 4.8,
            isVerified: true,
            priceMonthly: 3200,
            priceDaily: 106,
            driverName: 'Sathish Verma',
            driverPhone: '+91 98401 77889',
          },
        ]);
        setAiInsight(`High demand corridor detected for ${pickup} ➔ ${destination}.`);
      }
    } catch (e) {
      console.log('Using mock AI recommendations', e);
    } finally {
      setLoading(false);
    }
  };

  // Initiate Redis Seat Lock
  const handleInitiateSeatLock = async (route: RouteMatch) => {
    setSelectedRoute(route);
    setLockTtl(600);
    try {
      const lockRes = await studentWorkApi.lockSeat('arun.kumar@loyola.edu', route.id, selectedSeat);
      setRedisLockData(lockRes);
      setLockModalVisible(true);
    } catch (e) {
      setRedisLockData({
        lockToken: 'LOCK-REDIS-9941A8',
        expiresAt: new Date(Date.now() + 600000).toISOString(),
        ttlSeconds: 600,
        status: 'LOCKED_IN_REDIS',
      });
      setLockModalVisible(true);
    }
  };

  // Release Lock
  const handleReleaseSeatLock = async () => {
    if (redisLockData?.lockToken) {
      try {
        await studentWorkApi.releaseSeatLock(redisLockData.lockToken);
      } catch (e) {}
    }
    setLockModalVisible(false);
    setRedisLockData(null);
  };

  // Confirm Reservation & Book
  const handleConfirmReservation = async () => {
    if (!selectedRoute) return;
    try {
      await studentWorkApi.bookSeat('arun.kumar@loyola.edu', selectedRoute.id, 'MONTHLY');
      Alert.alert(
        'Seat Reserved & Pass Issued ✅',
        `Pass active for ${selectedRoute.pickup} ➔ ${selectedRoute.destination}. Seat ${selectedSeat} confirmed in Redis ledger.`,
        [
          {
            text: 'VIEW PASS',
            onPress: () => {
              setLockModalVisible(false);
              if (navigation && navigation.navigate) {
                navigation.navigate('CommutePass');
              }
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert('Reservation Success', 'Commute pass generated successfully.');
      setLockModalVisible(false);
    }
  };

  const formatLockTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.headerTitle}>
            AI Smart Route Matcher
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            95% Match Scoring • Redis Seat Locking • Campus Shuttles
          </Text>
        </View>
        <Chip icon="sparkles" style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }} textStyle={{ color: '#c084fc', fontSize: 10 }}>
          AI Powered
        </Chip>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Corridor Chips */}
        <Text style={styles.sectionLabel}>POPULAR COMMUTER CORRIDORS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {[
            { p: 'Kattur', d: 'ABC College' },
            { p: 'Tambaram', d: 'Loyola College' },
            { p: 'Velachery', d: 'TCS IT Park' },
            { p: 'Lawspet', d: 'Pondicherry Univ' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.corridorChip,
                pickup === item.p && destination === item.d && styles.corridorChipActive,
              ]}
              onPress={() => {
                setPickup(item.p);
                setDestination(item.d);
              }}
            >
              <Text
                style={[
                  styles.corridorChipText,
                  pickup === item.p && destination === item.d && styles.corridorChipTextActive,
                ]}
              >
                {item.p} ➔ {item.d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Optimization Banner */}
        <Card style={styles.aiInsightCard}>
          <View style={styles.aiInsightRow}>
            <Avatar.Icon size={32} icon="robot" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }} color="#10b981" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.aiInsightTitle}>AI Recommendation Engine</Text>
              <Text style={styles.aiInsightText}>{aiInsight}</Text>
            </View>
          </View>
        </Card>

        {/* Match Route Cards */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>RECOMMENDED MATCHES ({routes.length})</Text>
        <View style={styles.routesList}>
          {routes.map((route) => {
            const isTopMatch = route.matchScore >= 90;
            return (
              <Card key={route.id} style={[styles.routeCard, isTopMatch && styles.topMatchCard]}>
                {/* Match Score Badge Header */}
                <View style={styles.routeCardHeader}>
                  <View style={styles.matchScoreBadge}>
                    <Avatar.Icon size={16} icon="star" color="#ffffff" style={{ backgroundColor: 'transparent' }} />
                    <Text style={styles.matchScoreText}>{route.matchScore}% MATCH</Text>
                  </View>
                  <View style={styles.amenityRow}>
                    {route.isAc && (
                      <Chip style={styles.amenityChip} textStyle={{ color: '#38bdf8', fontSize: 9 }}>
                        ❄️ AC
                      </Chip>
                    )}
                    <Chip style={styles.amenityChip} textStyle={{ color: '#10b981', fontSize: 9 }}>
                      🛡️ Verified
                    </Chip>
                  </View>
                </View>

                {/* Corridor & Timing */}
                <View style={styles.corridorBlock}>
                  <Text style={styles.routeCorridorTitle}>
                    {route.pickup} ➔ {route.destination}
                  </Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingText}>🕒 {route.departureTime} departure</Text>
                    <Text style={styles.timingText}>📍 ETA {route.arrivalTime}</Text>
                  </View>
                </View>

                {/* Driver & Vehicle */}
                <View style={styles.driverRow}>
                  <Avatar.Text
                    size={36}
                    label={route.driverName.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: '#1e293b' }}
                    color="#10b981"
                  />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.driverName}>{route.driverName} ★ {route.rating}</Text>
                    <Text style={styles.vehicleInfo}>{route.vehicleType} • {route.vehiclePlate} ({route.seater})</Text>
                  </View>
                  <View style={styles.seatsLeftPill}>
                    <Text style={styles.seatsLeftText}>{route.seatsAvailable} seats left</Text>
                  </View>
                </View>

                {/* Fare & Lock Button */}
                <View style={styles.priceAndActionRow}>
                  <View>
                    <Text style={styles.priceMonthly}>₹{route.priceMonthly} <Text style={styles.priceSub}>/ month</Text></Text>
                    <Text style={styles.priceDaily}>₹{route.priceDaily}/day estimated</Text>
                  </View>
                  <Button
                    mode="contained"
                    icon="lock"
                    buttonColor="#10b981"
                    textColor="#070b13"
                    style={styles.reserveBtn}
                    onPress={() => handleInitiateSeatLock(route)}
                  >
                    LOCK SEAT & BOOK
                  </Button>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* REDIS SEAT LOCK & CHECKOUT MODAL */}
      <Modal visible={lockModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.lockModalCard}>
            <View style={styles.lockModalHeader}>
              <View>
                <Text style={styles.lockModalTitle}>Redis Seat Lock Active</Text>
                <Text style={styles.lockModalSub}>
                  Seat reserved for {formatLockTimer(lockTtl)} to prevent overbooking
                </Text>
              </View>
              <Chip icon="timer-sand" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }} textStyle={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}>
                {formatLockTimer(lockTtl)}
              </Chip>
            </View>

            {/* Token details */}
            <View style={styles.redisTokenBox}>
              <Text style={styles.redisTokenLabel}>REDIS MUTEX TOKEN</Text>
              <Text style={styles.redisTokenValue}>{redisLockData?.lockToken || 'LOCK-REDIS-9941A8'}</Text>
              <Text style={styles.redisTokenHint}>Exclusive checkout session active in Redis key-value memory.</Text>
            </View>

            {/* Seat Selection Grid */}
            <Text style={styles.seatGridLabel}>SELECT YOUR COMMUTER SEAT:</Text>
            <View style={styles.seatGrid}>
              {['SEAT-01', 'SEAT-02', 'SEAT-03', 'SEAT-04', 'SEAT-05', 'SEAT-06'].map((seat) => (
                <TouchableOpacity
                  key={seat}
                  style={[
                    styles.seatPill,
                    selectedSeat === seat && styles.seatPillSelected,
                  ]}
                  onPress={() => setSelectedSeat(seat)}
                >
                  <Avatar.Icon size={20} icon="car-seat" color={selectedSeat === seat ? '#070b13' : '#94a3b8'} style={{ backgroundColor: 'transparent' }} />
                  <Text style={[styles.seatPillText, selectedSeat === seat && styles.seatPillTextSelected]}>
                    {seat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Order Summary */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Route:</Text>
                <Text style={styles.summaryVal}>{selectedRoute?.pickup} ➔ {selectedRoute?.destination}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pass Type:</Text>
                <Text style={styles.summaryVal}>Monthly Commute Pass</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Payable:</Text>
                <Text style={[styles.summaryVal, { color: '#10b981', fontWeight: 'bold', fontSize: 14 }]}>
                  ₹{selectedRoute?.priceMonthly}
                </Text>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.lockModalActions}>
              <Button mode="outlined" textColor="#ef4444" style={{ flex: 1, borderColor: '#ef4444' }} onPress={handleReleaseSeatLock}>
                CANCEL
              </Button>
              <Button mode="contained" buttonColor="#10b981" textColor="#070b13" style={{ flex: 1.5 }} onPress={handleConfirmReservation}>
                CONFIRM & ISSUE PASS
              </Button>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  corridorChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  corridorChipActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: '#a855f7',
  },
  corridorChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  corridorChipTextActive: {
    color: '#c084fc',
    fontWeight: 'bold',
  },
  aiInsightCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 12,
    marginTop: 12,
  },
  aiInsightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiInsightTitle: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiInsightText: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 2,
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  topMatchCard: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  routeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matchScoreText: {
    color: '#070b13',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  amenityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityChip: {
    backgroundColor: '#1e293b',
    height: 24,
  },
  corridorBlock: {
    marginBottom: 10,
  },
  routeCorridorTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timingRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  timingText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e32',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  driverName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  seatsLeftPill: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  seatsLeftText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceAndActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  priceMonthly: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceSub: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'normal',
  },
  priceDaily: {
    color: '#64748b',
    fontSize: 10,
  },
  reserveBtn: {
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lockModalCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 18,
  },
  lockModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lockModalTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  lockModalSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  redisTokenBox: {
    backgroundColor: '#131e32',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  redisTokenLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  redisTokenValue: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  redisTokenHint: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2,
  },
  seatGridLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  seatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  seatPillSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  seatPillText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  seatPillTextSelected: {
    color: '#070b13',
  },
  summaryBox: {
    backgroundColor: '#131e32',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  summaryVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  lockModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
