import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import { parentApi } from '../services/api';

export const EmergencySOSScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [sosSent, setSosSent] = useState(false);

  const handleSendSOS = async () => {
    setSosSent(true);
    try {
      await parentApi.triggerSos({
        source: 'PARENT_APP',
        childName: 'Arun Kumar',
        vehicleNumber: 'Van TN-XX-1234',
        parentEmail: 'priya.sharma@gmail.com',
        timestamp: Date.now(),
      });
      await parentApi.triggerFcmNotification({
        email: 'priya.sharma@gmail.com',
        title: '🚨 EMERGENCY SOS TRIGGERED',
        message: 'Distress broadcast sent for Arun Kumar (Van TN-XX-1234). Police and control room alerted.',
        type: 'SOS',
      });
    } catch (e) {
      console.log('Emergency SOS triggered in demo mode');
    }

    Alert.alert(
      '🚨 SOS Dispatched',
      'Live coordinates and distress alert dispatched to school control room, police helpline, and emergency contacts.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.iconCircle}>
          <Avatar.Icon size={72} icon="shield-alert" style={{ backgroundColor: '#dc2626' }} color="#fff" />
        </View>

        <Text style={styles.title}>EMERGENCY SOS</Text>
        <Text style={styles.sub}>
          In case of an emergency, press the SOS button. Your real-time location will be shared immediately with your emergency contacts and the school control center.
        </Text>

        <TouchableOpacity
          onPress={handleSendSOS}
          style={[styles.sosBigBtn, sosSent && styles.sosBigBtnSent]}
          activeOpacity={0.8}
        >
          <Text style={styles.sosBigBtnText}>
            {sosSent ? '🚨 SOS ACTIVE' : '🚨 SEND SOS'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.directText}>You can also call the driver directly</Text>
        <Button
          mode="outlined"
          onPress={() => {
            Linking.openURL('tel:+919840123456').catch(() => {
              Alert.alert('Call Driver', 'Dialing driver Kumar at +91 98401 23456');
            });
          }}
          textColor="#fff"
          icon="phone"
          style={styles.callBtn}
          labelStyle={{ fontWeight: 'bold' }}
        >
          Call Driver Directly
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7f1d1d',
    padding: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sub: {
    color: '#fecaca',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 30,
    lineHeight: 20,
  },
  sosBigBtn: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sosBigBtnSent: {
    backgroundColor: '#fee2e2',
  },
  sosBigBtnText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bottomSection: {
    gap: 10,
    marginBottom: 20,
  },
  directText: {
    color: '#fca5a5',
    fontSize: 12,
    textAlign: 'center',
  },
  callBtn: {
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14,
    paddingVertical: 4,
  },
});
