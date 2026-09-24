import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { parentApi } from '../services/api';

export const SubscriptionManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tab, setTab] = useState<'Active' | 'Upcoming' | 'Past'>('Active');
  const [planDetails, setPlanDetails] = useState({
    title: 'Monthly Plan',
    price: '₹3,000 / month',
    status: 'Active',
    nextPay: '5 Apr 2025'
  });

  useEffect(() => {
    parentApi.getSubscriptions('priya.sharma@gmail.com')
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const sub = data[0];
          setPlanDetails({
            title: `${sub.planType || 'Monthly'} Plan`,
            price: `₹${sub.amount || '3,000'} / ${sub.planType?.toLowerCase() || 'month'}`,
            status: sub.status || 'Active',
            nextPay: sub.expiryDate || '5 Apr 2025'
          });
        }
      })
      .catch(() => console.log('Using default subscription plan info.'));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Child Card Header */}
      <View style={styles.childHeader}>
        <Avatar.Text size={40} label="AK" style={{ backgroundColor: '#f59e0b' }} color="#000" />
        <View>
          <Text style={styles.childName}>Arun Kumar</Text>
          <Text style={styles.childSchool}>Green Valley School • Class 3</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.segmentContainer}>
        {(['Active', 'Upcoming', 'Past'] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.segmentBtn, tab === t && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, tab === t && styles.segmentTextActive]}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Plan Card */}
      <Card style={styles.planCard}>
        <Card.Content>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planTitle}>{planDetails.title}</Text>
              <Text style={styles.planPrice}>{planDetails.price}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>{planDetails.status}</Text>
            </View>
          </View>
          <Text style={styles.nextPayText}>Next payment: {planDetails.nextPay}</Text>

          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('PaymentInvoice')}
              textColor="#38bdf8"
              style={styles.outlineBtn}
            >
              View Invoice
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Payments')}
              buttonColor="#3B49DF"
              textColor="#fff"
              style={styles.solidBtn}
            >
              Renew
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Payment History */}
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyList}>
        {[
          { date: '5 Mar 2025', amt: '₹3,000' },
          { date: '5 Feb 2025', amt: '₹3,000' },
          { date: '5 Jan 2025', amt: '₹3,000' },
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate('PaymentInvoice')}
            style={styles.historyCard}
          >
            <View>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historySub}>Subscription Payment</Text>
            </View>
            <View style={styles.historyRight}>
              <Text style={styles.historyAmt}>{item.amt}</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Paid</Text>
              </View>
            </View>
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
  childHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  childName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  childSchool: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
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
  planCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(59, 73, 223, 0.4)',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  planPrice: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  nextPayText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 8,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderColor: '#38bdf8',
    borderRadius: 10,
  },
  solidBtn: {
    flex: 1,
    borderRadius: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historySub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  paidText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
