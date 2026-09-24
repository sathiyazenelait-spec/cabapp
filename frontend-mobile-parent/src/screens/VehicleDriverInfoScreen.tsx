import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native';
import { Text, Card, Avatar, Button } from 'react-native-paper';
import { parentApi } from '../services/api';

export const VehicleDriverInfoScreen: React.FC<{ navigation: any }> = () => {
  const [driverData, setDriverData] = useState({
    driverName: 'Kumar',
    driverRole: 'Senior School Fleet Driver',
    driverRating: 4.8,
    reviewCount: 32,
    vehicleNumber: 'Van TN-XX-1234',
    vehicleType: '7 SEATER • AC',
    phone: '+91 98401 23456',
    documents: [
      { title: 'Driving Licence', icon: 'card-account-details' },
      { title: 'Vehicle RC', icon: 'file-document-check' },
      { title: 'Insurance', icon: 'shield-check' },
      { title: 'Fitness Certificate', icon: 'certificate' },
    ],
  });

  useEffect(() => {
    parentApi.getDriverDetails('d1').then(data => {
      if (data && data.driverName) {
        setDriverData(prev => ({
          ...prev,
          driverName: data.driverName,
          driverRating: data.driverRating || 4.8,
          reviewCount: data.reviewCount || 32,
          vehicleNumber: data.vehicleNumber || 'Van TN-XX-1234',
          vehicleType: data.vehicleType || '7 SEATER • AC',
          phone: data.phone || '+91 98401 23456',
        }));
      }
    }).catch(() => {});
  }, []);

  const documents = driverData.documents;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Vehicle Info Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.row}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>VAN</Text>
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{driverData.vehicleNumber}</Text>
            <Text style={styles.sub}>{driverData.vehicleType}</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified ✅</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Driver Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.row}>
          <Avatar.Text size={44} label={driverData.driverName.substring(0, 1)} style={{ backgroundColor: '#1f2937' }} color="#38bdf8" />
          <View style={styles.mainInfo}>
            <Text style={styles.title}>{driverData.driverName}</Text>
            <Text style={styles.sub}>⭐ {driverData.driverRating} ({driverData.reviewCount} Reviews)</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Documents Grid */}
      <Text style={styles.sectionTitle}>Verified Documents</Text>
      <View style={styles.grid}>
        {documents.map(d => (
          <View key={d.title} style={styles.docCard}>
            <Avatar.Icon size={32} icon={d.icon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} color="#10b981" />
            <Text style={styles.docTitle}>{d.title}</Text>
          </View>
        ))}
      </View>

      {/* Contact Driver Button */}
      <Button
        mode="contained"
        onPress={() => {
          Linking.openURL('tel:+919840123456').catch(() => {
            Alert.alert('Contact Driver', 'Dialing driver Kumar at +91 98401 23456');
          });
        }}
        buttonColor="#3B49DF"
        textColor="#fff"
        icon="phone"
        style={styles.contactBtn}
        labelStyle={{ fontWeight: 'bold' }}
      >
        Contact Driver
      </Button>
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
  card: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 73, 223, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#93c5fd',
    fontWeight: 'bold',
    fontSize: 11,
  },
  mainInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  sub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 2,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  docCard: {
    width: '48%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docTitle: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: 'bold',
    flex: 1,
  },
  contactBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
