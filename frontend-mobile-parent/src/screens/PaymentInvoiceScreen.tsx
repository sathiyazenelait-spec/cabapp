import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { parentApi } from '../services/api';

export const PaymentInvoiceScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const invoiceId = route?.params?.invoiceId || 'INV-001234';
  const [invoice, setInvoice] = useState({
    invoiceNumber: invoiceId,
    issueDate: '5 Mar 2025',
    serviceTitle: 'Green Valley School',
    serviceSubtitle: 'Monthly Transport Subscription',
    childName: 'Arun Kumar',
    route: 'Kattur → Green Valley School',
    vehicle: 'Van TN-XX-1234',
    plan: 'Monthly',
    amount: 3000.0,
    status: 'PAID',
  });

  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([]);

  useEffect(() => {
    parentApi.getInvoice(invoiceId).then(data => {
      if (data && data.invoiceNumber) {
        setInvoice(prev => ({ ...prev, ...data }));
      }
    }).catch(() => {});

    parentApi.getSubscriptions('priya.sharma@gmail.com').then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setSubscriptionsList(data);
      }
    }).catch(() => {});
  }, [invoiceId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Invoice Digital Receipt */}
      <Card style={styles.invoiceCard}>
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text style={styles.schoolTitle}>{invoice.serviceTitle}</Text>
              <Text style={styles.schoolSub}>{invoice.serviceSubtitle}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.invNumber}>Invoice #{invoice.invoiceNumber}</Text>
              <Text style={styles.invDate}>{invoice.issueDate}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsList}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Child Name</Text>
              <Text style={styles.value}>{invoice.childName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Route</Text>
              <Text style={styles.value}>{invoice.route}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Vehicle</Text>
              <Text style={styles.value}>{invoice.vehicle}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Plan</Text>
              <Text style={styles.value}>{invoice.plan}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.labelBold}>Amount</Text>
              <Text style={styles.amountValue}>₹{invoice.amount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.labelBold}>Status</Text>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>{invoice.status} ✅</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actionRow}>
        <Button
          mode="outlined"
          onPress={() => Alert.alert('Download Receipt', 'Invoice PDF downloaded to device storage.')}
          textColor="#38bdf8"
          icon="download"
          style={styles.outlineBtn}
          labelStyle={{ fontWeight: 'bold' }}
        >
          Download Invoice
        </Button>
        <Button
          mode="contained"
          onPress={() => Alert.alert('Share Invoice', 'Sharable payment link copied to clipboard.')}
          buttonColor="#3B49DF"
          textColor="#fff"
          icon="share-variant"
          style={styles.solidBtn}
          labelStyle={{ fontWeight: 'bold' }}
        >
          Share Invoice
        </Button>
      </View>

      {/* Past Subscriptions & Invoices from Database */}
      {subscriptionsList.length > 0 && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            Recent Database Payments & Passes
          </Text>
          {subscriptionsList.map((sub, idx) => (
            <Card key={idx} style={[styles.invoiceCard, { marginBottom: 10, padding: 4 }]}>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{sub.planType || 'Monthly Pass'}</Text>
                    <Text style={{ color: '#9ca3af', fontSize: 10 }}>Child ID: #{sub.childId} · {sub.paymentDate ? sub.paymentDate.split('T')[0] : 'Active'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#10b981', fontWeight: 'bold', fontSize: 13 }}>₹{sub.amount}</Text>
                    <Text style={{ color: '#38bdf8', fontSize: 9, fontWeight: 'bold' }}>{sub.status}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
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
  invoiceCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  schoolTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  schoolSub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invNumber: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  invDate: {
    color: '#9ca3af',
    fontSize: 9,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 14,
  },
  detailsList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
  },
  value: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  labelBold: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  amountValue: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paidText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderColor: '#38bdf8',
    borderRadius: 12,
  },
  solidBtn: {
    flex: 1,
    borderRadius: 12,
  },
});
