import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import { LoginScreen } from '../screens/LoginScreen';
import { AdminHomeScreen } from '../screens/AdminHomeScreen';
import { DemandAnalyticsScreen } from '../screens/DemandAnalyticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminTopBar = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!currentUser) return null;

  return (
    <View style={styles.topBar}>
      <View style={styles.userInfo}>
        <Avatar.Text
          size={28}
          label={currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'A'}
          style={{ backgroundColor: '#ef4444' }}
          color="#ffffff"
        />
        <View style={styles.nameContainer}>
          <Text variant="labelMedium" style={styles.userName} numberOfLines={1}>
            {currentUser.name}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              SUPER ADMIN
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
        <Text style={styles.logoutText}>Lock Terminal</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminTabNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#070b13' }}>
      <AdminTopBar />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#070b13',
            borderTopColor: 'rgba(255,255,255,0.06)',
            paddingBottom: 4,
            height: 54,
          },
          tabBarActiveTintColor: '#ef4444',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: { fontSize: 8, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen 
          name="DemandAnalyticsSection" 
          component={DemandAnalyticsScreen} 
          options={{
            tabBarLabel: 'Demand & Heatmap',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="chart-donut-variant" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="AdminSection" 
          component={AdminHomeScreen} 
          options={{
            tabBarLabel: 'Fleet Operations',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="shield-crown" color={color} style={{ backgroundColor: 'transparent' }} />
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
        <Stack.Screen name="MainApp" component={AdminTabNavigator} />
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
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#ef4444',
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
