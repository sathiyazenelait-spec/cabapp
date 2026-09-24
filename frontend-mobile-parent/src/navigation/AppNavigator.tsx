import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import { LoginScreen } from '../screens/LoginScreen';
import { ParentHomeScreen } from '../screens/ParentHomeScreen';
import { FindTransportScreen } from '../screens/FindTransportScreen';
import { AvailableTransportScreen } from '../screens/AvailableTransportScreen';
import { SelectPlanScreen } from '../screens/SelectPlanScreen';
import { LiveTrackScreen } from '../screens/LiveTrackScreen';
import { SubscriptionManagementScreen } from '../screens/SubscriptionManagementScreen';
import { JourneyTimelineScreen } from '../screens/JourneyTimelineScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { ComplaintsSupportScreen } from '../screens/ComplaintsSupportScreen';
import { ParentProfileScreen } from '../screens/ParentProfileScreen';
import { EmergencySOSScreen } from '../screens/EmergencySOSScreen';
import { RouteDetailsScreen } from '../screens/RouteDetailsScreen';
import { VehicleDriverInfoScreen } from '../screens/VehicleDriverInfoScreen';
import { PaymentInvoiceScreen } from '../screens/PaymentInvoiceScreen';
import { PassportScreen } from '../screens/PassportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 13 },
      }}
    >
      <Stack.Screen name="ParentHome" component={ParentHomeScreen} options={{ title: 'Home Dashboard' }} />
      <Stack.Screen name="FindTransport" component={FindTransportScreen} options={{ title: 'Find Transport' }} />
      <Stack.Screen name="AvailableTransport" component={AvailableTransportScreen} options={{ title: 'Available Transport' }} />
      <Stack.Screen name="SelectPlan" component={SelectPlanScreen} options={{ title: 'Subscription Plan' }} />
      <Stack.Screen name="LiveTrack" component={LiveTrackScreen} options={{ title: 'Live Tracking' }} />
      <Stack.Screen name="SubscriptionManagement" component={SubscriptionManagementScreen} options={{ title: 'My Subscriptions' }} />
      <Stack.Screen name="JourneyTimeline" component={JourneyTimelineScreen} options={{ title: 'Journey Timeline' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Payments" component={PaymentsScreen} options={{ title: 'Payments' }} />
      <Stack.Screen name="ComplaintsSupport" component={ComplaintsSupportScreen} options={{ title: 'Complaints & Support' }} />
      <Stack.Screen name="ParentProfile" component={ParentProfileScreen} options={{ title: 'My Profile' }} />
      <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} options={{ title: 'Emergency SOS', headerStyle: { backgroundColor: '#7f1d1d' } }} />
      <Stack.Screen name="RouteDetails" component={RouteDetailsScreen} options={{ title: 'Route Details' }} />
      <Stack.Screen name="VehicleDriverInfo" component={VehicleDriverInfoScreen} options={{ title: 'Vehicle & Driver Info' }} />
      <Stack.Screen name="PaymentInvoice" component={PaymentInvoiceScreen} options={{ title: 'Payment Invoice' }} />
      <Stack.Screen name="Passport" component={PassportScreen} options={{ title: 'Child Journey Passport' }} />
    </Stack.Navigator>
  );
};

const ParentTopBar = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!currentUser) return null;

  return (
    <View style={styles.topBar}>
      <View style={styles.userInfo}>
        <Avatar.Text
          size={28}
          label={currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'PS'}
          style={{ backgroundColor: '#3B49DF' }}
          color="#fff"
        />
        <View style={styles.nameContainer}>
          <Text variant="labelMedium" style={styles.userName} numberOfLines={1}>
            {currentUser.name || 'Priya Sharma'}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {(currentUser.role || 'PARENT').toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => dispatch(logout())}
        activeOpacity={0.7}
      >
        <Avatar.Icon size={24} icon="lock-outline" style={{ backgroundColor: 'transparent' }} color="#ef4444" />
        <Text style={styles.logoutText}>Lock App</Text>
      </TouchableOpacity>
    </View>
  );
};

const ParentTabNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#070b13' }}>
      <ParentTopBar />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0c1222',
            borderTopColor: 'rgba(255,255,255,0.06)',
            paddingBottom: 4,
            height: 54,
          },
          tabBarActiveTintColor: '#38bdf8',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: { fontSize: 9, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={22} icon="home-variant" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />

        <Tab.Screen
          name="TrackingTab"
          component={LiveTrackScreen}
          options={{
            tabBarLabel: 'Tracking',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={22} icon="navigation-variant" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />

        <Tab.Screen
          name="PaymentsTab"
          component={PaymentsScreen}
          options={{
            tabBarLabel: 'Payments',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={22} icon="credit-card-outline" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />

        <Tab.Screen
          name="ProfileTab"
          component={ParentProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={22} icon="account-circle-outline" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={ParentTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 10,
  },
  userName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  roleBadge: {
    borderWidth: 1,
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});
