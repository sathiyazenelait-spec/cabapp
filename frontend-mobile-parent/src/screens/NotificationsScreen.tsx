import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Avatar, Chip, Button } from 'react-native-paper';

export interface NotificationItem {
  id: string;
  category: 'transport' | 'payments' | 'system' | 'sos';
  title: string;
  sub: string;
  time: string;
  icon: string;
  color: string;
  read: boolean;
  actionRoute?: string;
  actionText?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    category: 'transport',
    title: 'Boarding Successful • Arun Kumar',
    sub: 'Arun Kumar boarded vehicle TN 01 AB 1234 at Mehta Nagar Arch. Dynamic OTP verified.',
    time: '07:32 AM',
    icon: 'check-circle-outline',
    color: '#10b981',
    read: false,
    actionRoute: 'LiveTrack',
    actionText: 'Live Track',
  },
  {
    id: '2',
    category: 'transport',
    title: 'Geofence Radar Entry Alert',
    sub: 'Cab TN 01 AB 1234 is within 0.5 miles corridor. Estimated arrival at school in 6 mins.',
    time: '07:44 AM',
    icon: 'crosshairs-gps',
    color: '#38bdf8',
    read: false,
    actionRoute: 'LiveTrack',
    actionText: 'Open Radar',
  },
  {
    id: '3',
    category: 'payments',
    title: 'Monthly Subscription Receipt',
    sub: 'Invoice #INV-2026-904 for ₹3,000 paid successfully for Green Valley School route.',
    time: 'Yesterday',
    icon: 'receipt-text-outline',
    color: '#a855f7',
    read: true,
    actionRoute: 'Payments',
    actionText: 'View Invoice',
  },
  {
    id: '4',
    category: 'sos',
    title: 'Fleet Safety Sweep Completed',
    sub: 'Driver Kumar completed end-of-trip safety check. Zero students remaining in vehicle confirmed.',
    time: 'Yesterday',
    icon: 'shield-check-outline',
    color: '#10b981',
    read: true,
  },
  {
    id: '5',
    category: 'system',
    title: 'Special Route Match Discount',
    sub: 'College and Corporate morning passes are eligible for 10% cash rebate this term.',
    time: '2 days ago',
    icon: 'tag-outline',
    color: '#f59e0b',
    read: true,
  },
];

export const NotificationsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'transport' | 'payments' | 'sos'>('all');

  const filtered = notifications.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleAction = (item: NotificationItem) => {
    if (item.actionRoute && navigation) {
      navigation.navigate(item.actionRoute);
    } else {
      Alert.alert(item.title, item.sub);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Live Activity & Alerts</Text>
          <Text style={styles.headerSub}>Real-time transit and security events</Text>
        </View>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markReadBtn}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'transport', 'payments', 'sos'] as const).map(tab => {
          const labels: Record<string, string> = {
            all: 'All Events',
            transport: 'Transit & Radar',
            payments: 'Billing',
            sos: 'Safety & SOS'
          };
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {labels[tab]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Avatar.Icon size={48} icon="bell-off-outline" style={{ backgroundColor: 'transparent' }} color="#475569" />
            <Text style={styles.emptyText}>No notifications in this category</Text>
          </View>
        ) : (
          filtered.map(item => (
            <Card key={item.id} style={[styles.card, !item.read && styles.unreadCard]}>
              <Card.Content style={styles.cardContent}>
                <Avatar.Icon
                  size={36}
                  icon={item.icon}
                  style={{ backgroundColor: `${item.color}20` }}
                  color={item.color}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.cardSub}>{item.sub}</Text>

                  {item.actionText && (
                    <TouchableOpacity
                      onPress={() => handleAction(item)}
                      style={styles.actionBtn}
                    >
                      <Text style={styles.actionBtnText}>{item.actionText} →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
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
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  markReadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  markReadText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: '#3B49DF',
    borderColor: '#60a5fa',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  unreadCard: {
    borderColor: 'rgba(56, 189, 248, 0.4)',
    backgroundColor: '#0b1329',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  cardTime: {
    color: '#64748b',
    fontSize: 9,
  },
  cardSub: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 73, 223, 0.2)',
  },
  actionBtnText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
});
