import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text, IconButton, Chip } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import { LoginScreen } from '../screens/LoginScreen';
import { ParentHomeScreen } from '../screens/ParentHomeScreen';
import { LiveTrackScreen } from '../screens/LiveTrackScreen';
import { PassportScreen } from '../screens/PassportScreen';
import { SelectPlanScreen } from '../screens/SelectPlanScreen';
import { ConductorScreen } from '../screens/ConductorScreen';
import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { CabOwnerScreen } from '../screens/CabOwnerScreen';
import { StudentProfessionalScreen } from '../screens/StudentProfessionalScreen';
import { AIRouteMatchingScreen } from '../screens/AIRouteMatchingScreen';
import { DemandAnalyticsScreen } from '../screens/DemandAnalyticsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { RouteMatchingScreen } from '../screens/RouteMatchingScreen';
import { CommutePassScreen } from '../screens/CommutePassScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Parent persona including search, plans, and maps
const ParentStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: { backgroundColor: '#111827' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 13 },
      }}
    >
      <Stack.Screen 
        name="ParentHome" 
        component={ParentHomeScreen} 
        options={{ title: 'SafePassage AI Explore' }} 
      />
      <Stack.Screen 
        name="RouteMatching" 
        component={RouteMatchingScreen} 
        options={{ title: 'AI Route Matching' }} 
      />
      <Stack.Screen 
        name="CommutePass" 
        component={CommutePassScreen} 
        options={{ title: 'Digital Commute Pass' }} 
      />
      <Stack.Screen 
        name="AIMatch" 
        component={AIRouteMatchingScreen} 
        options={{ title: 'AI Route Matching' }} 
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ title: 'Notification Center' }} 
      />
      <Stack.Screen 
        name="SelectPlan" 
        component={SelectPlanScreen} 
        options={{ title: 'Compare Subscription Plans' }} 
      />
      <Stack.Screen 
        name="LiveTrack" 
        component={LiveTrackScreen} 
        options={{ title: 'Live Trip Tracking' }} 
      />
      <Stack.Screen 
        name="Passport" 
        component={PassportScreen} 
        options={{ title: 'Child Journey Passport' }} 
      />
    </Stack.Navigator>
  );
};

// Global App Top Navigation Bar with Current User info & Logout button
const AppTopBar = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!currentUser) return null;

  const roleColors: Record<string, string> = {
    parent: '#38bdf8',
    driver: '#10b981',
    cab_owner: '#f59e0b',
    student: '#a855f7',
    admin: '#ef4444',
    professional: '#06b6d4',
  };

  const badgeColor = roleColors[currentUser.role] || '#38bdf8';

  return (
    <View style={styles.topBar}>
      <View style={styles.userInfo}>
        <Avatar.Text
          size={28}
          label={currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}
          style={{ backgroundColor: badgeColor }}
          color="#070b13"
        />
        <View style={styles.nameContainer}>
          <Text variant="labelMedium" style={styles.userName} numberOfLines={1}>
            {currentUser.name}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: badgeColor + '20', borderColor: badgeColor }]}>
            <Text style={[styles.roleBadgeText, { color: badgeColor }]}>
              {currentUser.role.toUpperCase()}
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
        <Text style={styles.logoutText}>Lock / Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main App tab navigator routing dynamically between personas
const MainTabNavigator = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const role = currentUser?.role || 'parent';

  return (
    <View style={{ flex: 1, backgroundColor: '#070b13' }}>
      <AppTopBar />
      <Tab.Navigator
        initialRouteName={
          role === 'driver' ? 'DriverSection' :
          role === 'cab_owner' ? 'OwnerSection' :
          role === 'student' || role === 'professional' ? 'AIMatchTab' :
          role === 'admin' ? 'AnalyticsTab' : 'ParentSection'
        }
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#070b13',
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
          name="ParentSection" 
          component={ParentStackNavigator} 
          options={{
            tabBarLabel: 'Parent',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="account-child" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="AIMatchTab" 
          component={RouteMatchingScreen} 
          options={{
            tabBarLabel: 'AI Match',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="sparkles" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="CommutePassTab" 
          component={CommutePassScreen} 
          options={{
            tabBarLabel: 'Commute Pass',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="qrcode" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="AnalyticsTab" 
          component={DemandAnalyticsScreen} 
          options={{
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="chart-bar" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="NotificationsTab" 
          component={NotificationsScreen} 
          options={{
            tabBarLabel: 'Alerts',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="bell" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="DriverSection" 
          component={ConductorScreen} 
          options={{
            tabBarLabel: 'Driver',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="steering" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="OwnerSection" 
          component={CabOwnerScreen} 
          options={{
            tabBarLabel: 'Cab Owner',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="car-multiple" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="CommuterSection" 
          component={StudentProfessionalScreen} 
          options={{
            tabBarLabel: 'Student/Pro',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="school" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="AdminSection" 
          component={AdminHomeScreen} 
          options={{
            tabBarLabel: 'Super Admin',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="shield-crown" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

// Root Navigator handling Auth Gate (Password Screen on open)
export const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
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
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '900',
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
