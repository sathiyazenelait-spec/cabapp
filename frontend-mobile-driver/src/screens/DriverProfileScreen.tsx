import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, Avatar, Switch, List, Divider, Chip } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveShift, setSelectedSchool } from '../store/slices/tripSlice';
import { parentApi } from '../services/api';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export const DriverProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeShift, selectedSchool } = useAppSelector(state => state.trip);

  const [driverInfo, setDriverInfo] = useState({
    driverName: 'Ravi Chandran',
    driverRole: 'Verified Driver',
    driverRating: 4.8,
    reviewCount: 32,
    vehicleNumber: 'Van TN-XX-1234',
    vehicleType: '7 SEATER • AC',
    phone: '+91 98401 23456',
    documents: [
      { id: 'dl', title: 'Driving Licence', status: 'VERIFIED', verified: true },
      { id: 'rc', title: 'Vehicle RC', status: 'VERIFIED', verified: true },
      { id: 'ins', title: 'Insurance', status: 'VERIFIED', verified: true },
      { id: 'fc', title: 'Fitness Certificate', status: 'VERIFIED', verified: true },
    ],
  });

  useEffect(() => {
    parentApi.getDriverDetails('d1').then(data => {
      if (data && data.driverName) {
        setDriverInfo(prev => ({ ...prev, ...data }));
      }
    }).catch(() => {});
  }, []);

  const toggleShift = () => {
    dispatch(setActiveShift(activeShift === 'morning' ? 'evening' : 'morning'));
  };

  const handleSchoolSelect = (schoolName: string) => {
    dispatch(setSelectedSchool(schoolName));
  };

  const schools = [
    'ABC Matriculation School',
    'Kasturba Public School',
    'Loyola College Campus'
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Driver Card */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text size={48} label={driverInfo.driverName.substring(0, 2).toUpperCase()} style={styles.avatar} color="#fff" />
          <View style={styles.profileMeta}>
            <Text style={styles.driverName}>{driverInfo.driverName}</Text>
            <Text style={styles.driverSub}>
              {driverInfo.driverRole} • Rating {driverInfo.driverRating}★ ({driverInfo.reviewCount} reviews)
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Covered Area 10km Radius Map */}
      <Card style={styles.radiusCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>ROUTE COVERAGE ZONE</Text>
          <Text style={styles.cardDesc}>
            Your registered base is Tambaram. You cover a rounded 10 km service radius.
          </Text>

          {/* SVG coverage map */}
          <View style={styles.mapFrame}>
            <Svg height="160" width="100%">
              {/* Dark base terrain */}
              <Rect width="100%" height="160" fill="#1e293b" />
              
              {/* Tambaram center marker */}
              <Circle cx="50%" cy="50%" r="6" fill="#ef4444" />
              
              {/* 10km radius coverage shaded circle */}
              <Circle 
                cx="50%" 
                cy="50%" 
                r="60" 
                fill="rgba(56, 189, 248, 0.1)" 
                stroke="#38bdf8" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
              />
              
              {/* Map annotations representing streets */}
              <Path d="M 0,80 L 320,80 M 160,0 L 160,160" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <Path d="M 40,0 L 280,160" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
              
              {/* Nearby zone markers */}
              <Circle cx="45%" cy="30%" r="3" fill="#9ca3af" />
              <Circle cx="60%" cy="75%" r="3" fill="#9ca3af" />
            </Svg>

            <View style={styles.coverageTextOverlay}>
              <Text style={styles.baseLabel}>Base: Tambaram</Text>
              <Text style={styles.radiusLabel}>10 km Coverage Circle</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* School Shift Selector (driver chooses shift and school) */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>ACTIVE SERVICE TIMING / SHIFT</Text>
          
          <List.Item
            title="Morning Commute Shift"
            description="07:00 AM - 09:30 AM"
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
            right={() => (
              <Switch
                value={activeShift === 'morning'}
                onValueChange={toggleShift}
                color="#38bdf8"
              />
            )}
            style={styles.listItem}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Evening Commute Shift"
            description="03:00 PM - 05:30 PM"
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
            right={() => (
              <Switch
                value={activeShift === 'evening'}
                onValueChange={toggleShift}
                color="#38bdf8"
              />
            )}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>CHOOSE SCHOOL TO SERVICE</Text>
          <Text style={styles.cardDesc}>Select which school destination you are picking up for on this shift:</Text>
          
          <View style={styles.schoolList}>
            {schools.map(school => {
              const isSelected = selectedSchool === school;
              return (
                <List.Item
                  key={school}
                  title={school}
                  titleStyle={[styles.schoolTitle, isSelected && styles.selectedSchoolTitle]}
                  left={(props) => (
                    <List.Icon 
                      {...props} 
                      icon={isSelected ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                      color={isSelected ? "#10b981" : "#4b5563"} 
                    />
                  )}
                  onPress={() => handleSchoolSelect(school)}
                  style={[styles.schoolItem, isSelected && styles.selectedSchoolItem]}
                />
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* Vehicle details */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>VEHICLE SPECIFICATIONS</Text>
          <List.Item
            title="Suzuki Cab (Silver)"
            description="Plate: 06 MH 456"
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
            left={(props) => <List.Icon {...props} icon="car" color="#9ca3af" />}
            style={styles.listItem}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Seating Capacity"
            description="6 Seats Total (2 Available)"
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDesc}
            left={(props) => <List.Icon {...props} icon="seatbelt" color="#9ca3af" />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
  },
  avatar: {
    backgroundColor: '#38bdf8',
  },
  profileMeta: {
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverSub: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  radiusCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#38bdf8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 9,
    color: '#9ca3af',
    lineHeight: 12,
    marginBottom: 12,
  },
  mapFrame: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  coverageTextOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(7, 11, 19, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  baseLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  radiusLabel: {
    fontSize: 7.5,
    color: '#38bdf8',
    marginTop: 1,
  },
  settingsCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
  },
  listItem: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  listDesc: {
    fontSize: 8.5,
    color: '#9ca3af',
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  schoolList: {
    gap: 8,
    marginTop: 4,
  },
  schoolItem: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    paddingVertical: 0,
  },
  selectedSchoolItem: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  schoolTitle: {
    fontSize: 11,
    color: '#9ca3af',
  },
  selectedSchoolTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
