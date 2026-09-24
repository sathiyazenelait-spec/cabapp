import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Text } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

import { LoginScreen } from '../screens/LoginScreen';
import { ConductorScreen } from '../screens/ConductorScreen';
import { RouteMapScreen } from '../screens/RouteMapScreen';
import { DriverProfileScreen } from '../screens/DriverProfileScreen';
import { CabOwnerScreen } from '../screens/CabOwnerScreen';
import { DriverTripScreen } from '../screens/DriverTripScreen';
import { StudentChecklistScreen } from '../screens/StudentChecklistScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DriverTopBar = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  if (!currentUser) return null;

  return (
    <View style={styles.topBar}>
      <View style={styles.userInfo}>
        <Avatar.Text
          size={28}
          label={currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'D'}
          style={{ backgroundColor: '#10b981' }}
          color="#070b13"
        />
        <View style={styles.nameContainer}>
          <Text variant="labelMedium" style={styles.userName} numberOfLines={1}>
            {currentUser.name}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
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
        <Text style={styles.logoutText}>Lock App</Text>
      </TouchableOpacity>
    </View>
  );
};

const DriverTabNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#070b13' }}>
      <DriverTopBar />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#070b13',
            borderTopColor: 'rgba(255,255,255,0.06)',
            paddingBottom: 4,
            height: 54,
          },
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: { fontSize: 8, fontWeight: 'bold' },
        }}
      >
        <Tab.Screen 
          name="SingleTripSection" 
          component={DriverTripScreen} 
          options={{
            tabBarLabel: 'Single Trip',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="car-clock" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="StudentRosterSection" 
          component={StudentChecklistScreen} 
          options={{
            tabBarLabel: 'Student Roster',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="account-multiple-check" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="DriverSection" 
          component={ConductorScreen} 
          options={{
            tabBarLabel: 'Checklist',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="checkbox-marked-outline" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="RouteMapSection" 
          component={RouteMapScreen} 
          options={{
            tabBarLabel: 'Route Map',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="map-search-outline" color={color} style={{ backgroundColor: 'transparent' }} />
            )
          }}
        />
        <Tab.Screen 
          name="ProfileSection" 
          component={DriverProfileScreen} 
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <Avatar.Icon size={20} icon="account-circle-outline" color={color} style={{ backgroundColor: 'transparent' }} />
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
        <Stack.Screen name="MainApp" component={DriverTabNavigator} />
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
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#10b981',
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
