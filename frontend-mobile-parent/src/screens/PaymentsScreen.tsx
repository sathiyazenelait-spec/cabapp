import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { parentApi, API_BASE } from '../services/api';

export const PaymentsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([
    { date: '5 Mar 2025', id: 'INV-001234', amt: '₹3,000', status: 'PAID' },
    { date: '5 Feb 2025', id: 'INV-001092', amt: '₹3,000', status: 'PAID' },
    { date: '5 Jan 2025', id: 'INV-000841', amt: '₹3,000', status: 'PAID' },
    { date: '5 Dec 2024', id: 'INV-000620', amt: '₹3,000', status: 'PAID' },
  ]);

  useEffect(() => {
    fetch(`${API_BASE.SUPER_ADMIN}/api/admin/payments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            date: item.paymentDate || '5 Mar 2025',
            id: item.invoiceNumber || item.id || 'INV-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            amt: `₹${item.amount || item.netPayable || '3,000'}`,
            status: item.status || 'PAID',
          }));
          setTransactions(mapped);
        }
      })
      .catch(() => console.log('Using default transactions history.'));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Total Due Card */}
      <Card style={styles.dueCard}>
        <Card.Content>
          <Text style={styles.dueLabel}>Total Due</Text>
          <Text style={styles.dueAmount}>₹3,000</Text>
          <Text style={styles.dueDate}>Due on 5 Apr 2025</Text>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('SelectPlan')}
            buttonColor="#fff"
            textColor="#3B49DF"
            style={styles.payBtn}
            labelStyle={{ fontWeight: 'bold', fontSize: 13 }}
          >
            Pay Now
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Transactions */}
      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SubscriptionManagement')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {transactions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => navigation.navigate('PaymentInvoice', { invoiceId: item.id })}
            style={styles.txCard}
          >
            <View style={styles.txLeft}>
              <Avatar.Icon size={36} icon="receipt" style={{ backgroundColor: 'rgba(59, 73, 223, 0.15)' }} color="#38bdf8" />
              <View>
                <Text style={styles.txDate}>{item.date}</Text>
                <Text style={styles.txSub}>{item.id} • Subscription</Text>
              </View>
            </View>

            <View style={styles.txRight}>
              <Text style={styles.txAmt}>{item.amt}</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>{item.status}</Text>
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
  dueCard: {
    backgroundColor: '#3B49DF',
    borderRadius: 18,
    marginBottom: 20,
    elevation: 4,
  },
  dueLabel: {
    color: '#e0e7ff',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dueAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  dueDate: {
    color: '#c7d2fe',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 16,
  },
  payBtn: {
    borderRadius: 12,
    paddingVertical: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  list: {
    gap: 10,
  },
  txCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txDate: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  txSub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmt: {
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
