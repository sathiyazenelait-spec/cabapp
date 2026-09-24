import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { Text, Card, Button, Avatar, Switch } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateSubscriptionPlan } from '../store/slices/tripSlice';

import { API_BASE } from '../services/api';

export const SelectPlanScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { driverId, childId } = route.params || { driverId: 'd1', childId: 1 };
  const dispatch = useAppDispatch();
  
  const { drivers, subscriptionPlan } = useAppSelector(state => state.trip);
  const driver = drivers.find(d => d.id === driverId) || drivers[0];

  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [payUsingWallet, setPayUsingWallet] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE.PARENT}/api/parent/wallet?email=priya.sharma@gmail.com`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== undefined) {
          setWalletBalance(data.balance);
        }
      })
      .catch(err => console.log('Wallet service offline.', err));
  }, []);

  // Map subscription selection to plan rates
  const getPlanAmount = () => {
    switch (subscriptionPlan) {
      case 'weekly': return 700;
      case 'quarterly': return 7000;
      case 'annual': return 22500;
      case 'monthly':
      default:
        return 2500;
    }
  };

  const handleSubscribe = async () => {
    if (!childId) {
      Alert.alert('Error', 'Please register or select a child profile first.');
      return;
    }

    const amount = getPlanAmount();

    if (payUsingWallet) {
      if (walletBalance < amount) {
        Alert.alert('Insufficient Balance', 'Your wallet balance is insufficient to process this checkout.');
        return;
      }
      handleWalletPayment(amount);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order on Spring Boot backend (which calls Razorpay API)
      const orderRes = await fetch(`${API_BASE.PARENT}/api/parent/payment/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR'
        })
      });
      const orderData = await orderRes.json();

      // Step 2: Open Razorpay checkout (Using SDK options format)
      const options = {
        description: 'SafePassage Commute Subscription',
        image: 'https://i.imgur.com/3g7URjK.png',
        currency: orderData.currency || 'INR',
        key: orderData.keyId,
        amount: amount * 100, // in paise
        name: 'SafePassage AI',
        order_id: orderData.orderId,
        prefill: {
          email: 'priya.sharma@gmail.com',
          contact: '9999999999',
          name: 'Priya Sharma'
        },
        theme: { color: '#38bdf8' }
      };

      RazorpayCheckout.open(options)
        .then((data: any) => {
          verifyPayment(orderData.orderId, data.razorpay_payment_id, data.razorpay_signature, amount);
        })
        .catch((error: any) => {
          setLoading(false);
          Alert.alert(
            'Payment SDK Checkout Closed',
            `Razorpay sheet cancelled or unlinked: ${error.description || error.message || 'CLOSED'}\n\nDo you want to verify a mock payment success to proceed in Sandbox?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'SIMULATE SUCCESS', 
                onPress: () => {
                  setLoading(true);
                  const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 10);
                  const mockSignature = 'sig_' + Math.random().toString(36).substring(2, 12);
                  verifyPayment(orderData.orderId, mockPaymentId, mockSignature, amount);
                } 
              }
            ]
          );
        });
    } catch (err) {
      setLoading(false);
      Alert.alert('Payment Error', 'Failed to initialize payment transaction.');
    }
  };

  const verifyPayment = async (orderId: string, paymentId: string, signature: string, amount: number) => {
    try {
      // Step 3: Verify signature and update MySQL db state
      const verifyRes = await fetch(`${API_BASE.PARENT}/api/parent/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          child_id: childId,
          plan_type: subscriptionPlan,
          parent_email: 'priya.sharma@gmail.com',
          cab_id: driverId,
          amount: amount
        })
      });

      const result = await verifyRes.json();
      setLoading(false);

      if (result.status === 'SUCCESS') {
        Alert.alert(
          '🎉 Payment Successful',
          `Invoice: ${result.invoiceNumber}\n\n${result.message}`,
          [
            { 
              text: 'Track Child Location', 
              onPress: () => navigation.navigate('LiveTrack') 
            }
          ]
        );
      } else {
        Alert.alert('Verification Failed', result.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Verification Error', 'Failed to log transaction. Proceeding to live track.');
      navigation.navigate('LiveTrack');
    }
  };

  const handleWalletPayment = async (amount: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE.PARENT}/api/parent/wallet/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parent_email: 'priya.sharma@gmail.com',
          child_id: childId,
          amount: amount,
          plan_type: subscriptionPlan,
          cab_id: driverId
        })
      });
      const result = await res.json();
      setLoading(false);

      if (result.status === 'SUCCESS') {
        Alert.alert(
          '🎉 Payment Successful',
          `Invoice: ${result.invoiceNumber}\n\n${result.message}`,
          [
            { 
              text: 'Track Child Location', 
              onPress: () => navigation.navigate('LiveTrack') 
            }
          ]
        );
      } else {
        Alert.alert('Payment Failed', result.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Wallet Error', 'Failed to process checkout using SafePassage Wallet balance.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Subscription Plan</Text>
      
      <Card style={styles.driverInfoCard}>
        <Card.Content style={styles.driverContent}>
          <Avatar.Text size={36} label={driver.name.charAt(0)} style={styles.avatar} />
          <View>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
          </View>
        </Card.Content>
      </Card>
      
      {loading && (
        <View style={{ marginVertical: 10, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#38bdf8" />
          <Text style={{ color: '#9ca3af', fontSize: 10, marginTop: 4 }}>Accessing Razorpay API Gateway...</Text>
        </View>
      )}

      <View style={styles.plansContainer}>
        
        {/* Weekly Plan */}
        <TouchableOpacityPlan
          title="Weekly Subscription"
          price="₹700 / wk"
          desc="Flexible short term travel option. Auto-renews."
          active={subscriptionPlan === 'weekly'}
          onPress={() => dispatch(updateSubscriptionPlan('weekly'))}
        />

        {/* Monthly Plan */}
        <TouchableOpacityPlan
          title="Monthly Subscription"
          price="₹2,500 / mo"
          desc="Best seller. Auto-renewing subscription with predictable income for host."
          active={subscriptionPlan === 'monthly'}
          onPress={() => dispatch(updateSubscriptionPlan('monthly'))}
        />

        {/* Quarterly Plan */}
        <TouchableOpacityPlan
          title="Quarterly Subscription"
          price="₹7,000 / qtr"
          desc="Includes 15-day trial option. 15% discount. Sibling priorities and priority matching enabled."
          active={subscriptionPlan === 'quarterly'}
          onPress={() => dispatch(updateSubscriptionPlan('quarterly'))}
          badgeText="SAVE 15%"
        />

        {/* Annual Plan */}
        <TouchableOpacityPlan
          title="Annual Subscription Offer"
          price="₹22,500 / yr"
          desc="Save 25%. Special annual discount offer for loyal customers commuting 6+ months."
          active={subscriptionPlan === 'annual'}
          onPress={() => dispatch(updateSubscriptionPlan('annual'))}
          badgeText="SAVE 25%"
        />

      </View>

      {/* Wallet Payment Checkbox Toggle */}
      <Card style={{ backgroundColor: '#111827', marginVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) }}>Pay from SafePassage Wallet</Text>
            <Text style={{ color: '#9ca3af', fontSize: 10, marginTop: 2, fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) }}>
              Available Balance: ₹{walletBalance.toFixed(2)}
            </Text>
          </View>
          <Switch
            value={payUsingWallet}
            onValueChange={(val) => {
              if (val && walletBalance < getPlanAmount()) {
                Alert.alert(
                  'Insufficient Balance',
                  'Your wallet balance is insufficient to process this checkout. Please load funds first or pay directly.',
                  [
                    { text: 'Top Up Wallet', onPress: () => navigation.navigate('ParentHome') },
                    { text: 'Cancel', style: 'cancel' }
                  ]
                );
                return;
              }
              setPayUsingWallet(val);
            }}
            color="#38bdf8"
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSubscribe}
        style={styles.subscribeBtn}
        buttonColor="#38bdf8"
        textColor="#000"
        labelStyle={styles.btnLabel}
      >
        Subscribe & Pay Securely
      </Button>
    </View>
  );
};

interface TouchPlanProps {
  title: string;
  price: string;
  desc: string;
  active: boolean;
  onPress: () => void;
  badgeText?: string;
}

const TouchableOpacityPlan: React.FC<TouchPlanProps> = ({
  title,
  price,
  desc,
  active,
  onPress,
  badgeText
}) => {
  return (
    <Card 
      style={[styles.planCard, active && styles.planCardActive]} 
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.planHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.planTitle}>{title}</Text>
            {badgeText && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeText}</Text>
              </View>
            )}
          </View>
          <Text style={styles.planPrice}>{price}</Text>
        </View>
        <Text style={styles.planDesc}>{desc}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  driverInfoCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    marginBottom: 20,
  },
  driverContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#38bdf8',
  },
  driverName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverVehicle: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  plansContainer: {
    gap: 10,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  planCardActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56,189,248,0.04)',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 7,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#38bdf8',
  },
  planDesc: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 6,
    lineHeight: 12,
  },
  subscribeBtn: {
    borderRadius: 10,
    paddingVertical: 4,
  },
  btnLabel: {
    fontWeight: 'bold',
    fontSize: 12,
  }
});
