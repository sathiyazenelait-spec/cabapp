import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateSubscriptionPlan } from '../store/slices/tripSlice';

export const SelectPlanScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { driverId } = route.params || { driverId: 'd1' };
  const dispatch = useAppDispatch();
  
  const { drivers, subscriptionPlan } = useAppSelector(state => state.trip);
  const driver = drivers.find(d => d.id === driverId) || drivers[0];

  const handleSubscribe = () => {
    navigation.navigate('LiveTrack');
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
