import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';

export const ParentProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const menuItems = [
    { title: 'Child Information', icon: 'account-child', action: () => navigation.navigate('Passport') },
    { title: 'Emergency Contacts', icon: 'phone-alert', action: () => Alert.alert('Emergency Contacts', 'Primary: +91 98401 23456\nSecondary: +91 98401 99887') },
    { title: 'Transport Details', icon: 'van-utility', action: () => navigation.navigate('RouteDetails') },
    { title: 'Notification Settings', icon: 'bell-ring-outline', action: () => Alert.alert('Notifications', 'Push notifications and SMS alerts are enabled.') },
    { title: 'Help & Support', icon: 'help-circle-outline', action: () => navigation.navigate('ComplaintsSupport') },
    { title: 'About App', icon: 'information-outline', action: () => Alert.alert('SafePassage AI', 'Version 2.4 (Enterprise Edition)\nSecure Multi-Route Cab Management System') },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Child Profile Top Card */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text size={48} label="AK" style={{ backgroundColor: '#f59e0b' }} color="#000" />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Arun Kumar</Text>
            <Text style={styles.sub}>Class 3 • Green Valley School</Text>
          </View>
          <Button
            mode="text"
            textColor="#38bdf8"
            onPress={() => navigation.navigate('Passport')}
            labelStyle={{ fontWeight: 'bold', fontSize: 11 }}
          >
            Edit
          </Button>
        </Card.Content>
      </Card>

      {/* Menu Options */}
      <View style={styles.menuList}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={item.action}
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <Avatar.Icon
                size={36}
                icon={item.icon}
                style={{ backgroundColor: 'rgba(59, 73, 223, 0.15)' }}
                color="#38bdf8"
              />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Avatar.Icon size={24} icon="chevron-right" style={{ backgroundColor: 'transparent' }} color="#6b7280" />
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
  profileCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sub: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  menuList: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '600',
  },
});
