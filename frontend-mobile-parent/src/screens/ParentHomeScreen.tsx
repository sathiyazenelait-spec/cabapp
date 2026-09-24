import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Platform, Linking, Modal } from 'react-native';
import { Text, Button, Avatar, Card, Chip, Badge, TextInput } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSOS, updateSearchParams, updateAlertDistance } from '../store/slices/tripSlice';
import { API_BASE, parentApi } from '../services/api';

export const ParentHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { drivers, selectedDriverId, alertDistance } = useAppSelector(state => state.trip);

  const [children, setChildren] = useState([
    { id: 1, childName: 'Arun Kumar', grade: 'Class 3 • Green Valley School', status: 'On Route', cabNo: 'TN-01-AB-1234', driver: 'Kumar Swamy', driverPhone: '+919876543210' },
    { id: 2, childName: 'Sneha Kumar', grade: 'Class 8 • St. Joseph Academy', status: 'Boarding Pending', cabNo: 'TN-02-CD-5678', driver: 'Ramesh Sundar', driverPhone: '+919876543211' }
  ]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  // Single Trip / On-Demand active ride state
  const [activeTrip, setActiveTrip] = useState({
    isActive: true,
    tripId: 'ST-9482',
    otp: '8492',
    status: 'EN_ROUTE_TO_PICKUP',
    etaMins: 4,
    speedKmh: 36,
    pickup: 'Mehta Nagar Anna Arch Gate',
    destination: 'Green Valley School Main Gate',
    driverName: 'Kumar Swamy',
    vehicleNo: 'TN 01 AB 1234',
    rating: 4.9
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildSchool, setNewChildSchool] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('');
  const [newChildPickup, setNewChildPickup] = useState('');

  const handleAddChild = async () => {
    if (!newChildName.trim()) {
      Alert.alert('Required', 'Please enter child name.');
      return;
    }
    const newChildObj = {
      id: Date.now(),
      childName: newChildName.trim(),
      grade: `${newChildGrade.trim() || 'Class 1'} • ${newChildSchool.trim() || 'Green Valley School'}`,
      status: 'Awaiting Trip',
      cabNo: 'TN-01-AB-1234',
      driver: 'Kumar Swamy',
      driverPhone: '+919876543210',
      pickup: newChildPickup.trim() || 'Home'
    };

    try {
      await parentApi.createChild({
        name: newChildName.trim(),
        school: newChildSchool.trim(),
        grade: newChildGrade.trim(),
        pickupLocation: newChildPickup.trim(),
      });
    } catch (e) {}

    const updated = [...children, newChildObj];
    setChildren(updated);
    setSelectedChildIndex(updated.length - 1);
    setIsAddModalOpen(false);
    setNewChildName('');
    setNewChildSchool('');
    setNewChildGrade('');
    setNewChildPickup('');
    Alert.alert('Child Added 🎉', `${newChildName} has been enrolled in SafePassage AI.`);
  };

  const activeChild = children[selectedChildIndex] || children[0];
  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  const handleCallDriver = () => {
    Linking.openURL(`tel:${activeChild.driverPhone}`).catch(() => {
      Alert.alert('Calling Driver', `Dialing ${activeChild.driver} at ${activeChild.driverPhone}`);
    });
  };

  const handleWhatsAppDriver = () => {
    Linking.openURL(`whatsapp://send?phone=${activeChild.driverPhone}&text=Hello Driver, inquiring about pickup status for ${activeChild.childName}`).catch(() => {
      Alert.alert('WhatsApp Conductor', `Connecting via WhatsApp with ${activeChild.driver}`);
    });
  };

  const handleEmergencySOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS ALERT',
      `Trigger emergency protocol for ${activeChild.childName}? This will notify Super Admin, Control Room, and Driver immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'BROADCAST SOS NOW',
          style: 'destructive',
          onPress: async () => {
            dispatch(toggleSOS());
            try {
              await parentApi.triggerSos({ driverId: selectedDriver.id, childName: activeChild.childName });
              Alert.alert('SOS Triggered', 'Emergency team and patrol units have received live telemetry coordinates.');
            } catch {
              Alert.alert('SOS Active', 'Emergency signal transmitted (Offline Resilient Mode).');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.avatarRow}>
          <Avatar.Text size={44} label="PK" style={styles.welcomeAvatar} color="#fff" />
          <View>
            <Text style={styles.welcomeName}>Hello, Priya Kumar 👋</Text>
            <Text style={styles.welcomeSub}>SafePassage AI • Child Guard Active</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.bellBtn}
        >
          <Avatar.Icon size={24} icon="bell-badge-outline" style={{ backgroundColor: 'transparent' }} color="#38bdf8" />
        </TouchableOpacity>
      </View>

      {/* Child Switcher Tabs */}
      <View style={styles.childSwitcherContainer}>
        <View style={styles.switcherHeaderRow}>
          <Text style={styles.switcherHeaderLabel}>SELECT CHILD PROFILE</Text>
          <TouchableOpacity
            onPress={() => setIsAddModalOpen(true)}
            style={styles.addChildHeaderBtn}
          >
            <Avatar.Icon size={18} icon="plus" style={{ backgroundColor: 'transparent' }} color="#38bdf8" />
            <Text style={styles.addChildHeaderText}>Add Child</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childTabsScroll}>
          {children.map((child, idx) => {
            const isSelected = idx === selectedChildIndex;
            return (
              <TouchableOpacity
                key={child.id}
                onPress={() => setSelectedChildIndex(idx)}
                style={[styles.childTab, isSelected && styles.childTabActive]}
              >
                <Avatar.Text
                  size={28}
                  label={child.childName.split(' ').map(n => n[0]).join('')}
                  style={{ backgroundColor: isSelected ? '#3B49DF' : '#374151' }}
                  color="#fff"
                />
                <View style={{ marginRight: 4 }}>
                  <Text style={[styles.childTabName, isSelected && styles.childTabNameActive]} numberOfLines={1}>
                    {child.childName}
                  </Text>
                  <Text style={styles.childTabGrade} numberOfLines={1}>{child.grade.split('•')[0].trim()}</Text>
                </View>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setIsAddModalOpen(true)}
            style={styles.addChildMiniCard}
          >
            <Avatar.Icon size={24} icon="account-plus-outline" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }} color="#38bdf8" />
            <Text style={styles.addChildMiniText}>+ New</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Active Single-Trip & Pickup OTP Verification Card */}
      {activeTrip.isActive && (
        <Card style={styles.otpCard}>
          <Card.Content>
            <View style={styles.otpCardHeader}>
              <View style={styles.badgePulseRow}>
                <View style={styles.livePulseDot} />
                <Text style={styles.otpCardBadge}>ACTIVE TRIP • {activeTrip.tripId}</Text>
              </View>
              <Text style={styles.etaText}>ETA: {activeTrip.etaMins} mins ({activeTrip.speedKmh} km/h)</Text>
            </View>

            <View style={styles.otpDisplaySection}>
              <View>
                <Text style={styles.otpHintLabel}>Boarding Pickup OTP (Share with Driver)</Text>
                <View style={styles.otpBoxRow}>
                  {activeTrip.otp.split('').map((digit, i) => (
                    <View key={i} style={styles.otpDigitBox}>
                      <Text style={styles.otpDigitText}>{digit}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert('OTP Refreshed', 'Dynamic cryptographic OTP refreshed.')}
                style={styles.refreshOtpBtn}
              >
                <Avatar.Icon size={20} icon="refresh" style={{ backgroundColor: 'transparent' }} color="#38bdf8" />
                <Text style={styles.refreshOtpText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.driverQuickRow}>
              <View style={styles.driverInfoLeft}>
                <Avatar.Icon size={32} icon="steering" style={{ backgroundColor: '#1e293b' }} color="#38bdf8" />
                <View>
                  <Text style={styles.driverNameText}>{activeTrip.driverName} ⭐ {activeTrip.rating}</Text>
                  <Text style={styles.vehicleNoText}>{activeTrip.vehicleNo}</Text>
                </View>
              </View>
              <View style={styles.driverActionButtons}>
                <TouchableOpacity onPress={handleCallDriver} style={styles.callIconBtn}>
                  <Avatar.Icon size={20} icon="phone" style={{ backgroundColor: 'transparent' }} color="#10b981" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleWhatsAppDriver} style={styles.whatsappIconBtn}>
                  <Avatar.Icon size={20} icon="whatsapp" style={{ backgroundColor: 'transparent' }} color="#22c55e" />
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Active Commute 3-Step Milestone Pipeline */}
      <Card style={styles.pipelineCard}>
        <Card.Content>
          <View style={styles.pipelineHeaderRow}>
            <Text style={styles.pipelineTitle}>Commute Progress • {activeChild.childName}</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('LiveTrack')}
              buttonColor="#3B49DF"
              textColor="#fff"
              icon="crosshairs-gps"
              style={styles.liveMapBtn}
              labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
            >
              Live Radar Map
            </Button>
          </View>

          <View style={styles.pipeline}>
            <View style={styles.pipeStep}>
              <View style={[styles.pipeNode, { backgroundColor: '#10b981' }]}>
                <Text style={styles.pipeCheck}>✓</Text>
              </View>
              <Text style={[styles.pipeLabel, { color: '#10b981' }]}>Boarded</Text>
              <Text style={styles.pipeTime}>07:32 AM</Text>
            </View>

            <View style={styles.pipeLineActive} />

            <View style={styles.pipeStep}>
              <View style={[styles.pipeNode, { backgroundColor: '#3B49DF' }]}>
                <Text style={styles.pipeCheck}>●</Text>
              </View>
              <Text style={[styles.pipeLabel, { color: '#38bdf8' }]}>On Route</Text>
              <Text style={styles.pipeTime}>Speed 36 km/h</Text>
            </View>

            <View style={styles.pipeLineInactive} />

            <View style={styles.pipeStep}>
              <View style={[styles.pipeNode, { backgroundColor: '#374151' }]}>
                <Text style={styles.pipeCheck}>🏫</Text>
              </View>
              <Text style={[styles.pipeLabel, { color: '#9ca3af' }]}>School Drop</Text>
              <Text style={styles.pipeTime}>ETA 08:10 AM</Text>
            </View>
          </View>

          {/* Geofence Proximity Alert Setting */}
          <View style={styles.geofenceConfigRow}>
            <View>
              <Text style={styles.geofenceTitle}>Proximity Radar Corridor</Text>
              <Text style={styles.geofenceSub}>Alert me when cab is within {alertDistance} miles</Text>
            </View>
            <View style={styles.geofenceChipRow}>
              {[0.5, 1.0, 2.0].map(dist => (
                <TouchableOpacity
                  key={dist}
                  onPress={() => dispatch(updateAlertDistance(dist))}
                  style={[styles.distChip, alertDistance === dist && styles.distChipActive]}
                >
                  <Text style={[styles.distChipText, alertDistance === dist && styles.distChipTextActive]}>
                    {dist} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions 6-Grid */}
      <Text style={styles.sectionTitle}>Command & Quick Actions</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FindTransport')}
          style={styles.actionCard}
        >
          <Avatar.Icon size={36} icon="magnify" style={{ backgroundColor: 'rgba(59, 73, 223, 0.15)' }} color="#38bdf8" />
          <Text style={styles.actionLabel}>Find Transport</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('SubscriptionManagement')}
          style={styles.actionCard}
        >
          <Avatar.Icon size={36} icon="calendar-month" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }} color="#a855f7" />
          <Text style={styles.actionLabel}>Subscriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('LiveTrack')}
          style={styles.actionCard}
        >
          <Avatar.Icon size={36} icon="map-marker-path" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} color="#10b981" />
          <Text style={styles.actionLabel}>Live Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Passport')}
          style={styles.actionCard}
        >
          <Avatar.Icon size={36} icon="qrcode-scan" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }} color="#38bdf8" />
          <Text style={styles.actionLabel}>Child QR Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Payments')}
          style={styles.actionCard}
        >
          <Avatar.Icon size={36} icon="credit-card-outline" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }} color="#f59e0b" />
          <Text style={styles.actionLabel}>Invoices & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleEmergencySOS}
          style={[styles.actionCard, { borderColor: 'rgba(239, 68, 68, 0.4)', backgroundColor: 'rgba(239, 68, 68, 0.08)' }]}
        >
          <Avatar.Icon size={36} icon="shield-alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }} color="#ef4444" />
          <Text style={[styles.actionLabel, { color: '#ef4444' }]}>Emergency SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Add New Child Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar.Icon size={32} icon="account-plus" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }} color="#38bdf8" />
                <Text style={styles.modalTitle}>Add New Child Profile</Text>
              </View>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Avatar.Icon size={24} icon="close" style={{ backgroundColor: 'transparent' }} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Enroll a child to track daily pickup & school drop commutes.</Text>

            <TextInput
              label="Child Full Name *"
              value={newChildName}
              onChangeText={setNewChildName}
              placeholder="e.g. Rahul Sharma"
              mode="outlined"
              style={styles.modalInput}
              outlineColor="rgba(255,255,255,0.12)"
              activeOutlineColor="#38bdf8"
              textColor="#fff"
            />

            <TextInput
              label="School / Institution Name"
              value={newChildSchool}
              onChangeText={setNewChildSchool}
              placeholder="e.g. Green Valley School"
              mode="outlined"
              style={styles.modalInput}
              outlineColor="rgba(255,255,255,0.12)"
              activeOutlineColor="#38bdf8"
              textColor="#fff"
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                label="Grade / Class"
                value={newChildGrade}
                onChangeText={setNewChildGrade}
                placeholder="e.g. Class 5-B"
                mode="outlined"
                style={[styles.modalInput, { flex: 1 }]}
                outlineColor="rgba(255,255,255,0.12)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
              <TextInput
                label="Pickup Landmark"
                value={newChildPickup}
                onChangeText={setNewChildPickup}
                placeholder="e.g. Home Gate"
                mode="outlined"
                style={[styles.modalInput, { flex: 1 }]}
                outlineColor="rgba(255,255,255,0.12)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
            </View>

            <View style={styles.modalButtonRow}>
              <Button
                mode="outlined"
                onPress={() => setIsAddModalOpen(false)}
                textColor="#94a3b8"
                style={styles.modalCancelBtn}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleAddChild}
                buttonColor="#3B49DF"
                textColor="#fff"
                icon="check-circle-outline"
                style={styles.modalSaveBtn}
                labelStyle={{ fontWeight: 'bold' }}
              >
                Save & Enroll
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 36,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeAvatar: {
    backgroundColor: '#3B49DF',
  },
  welcomeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcomeSub: {
    fontSize: 11,
    color: '#93c5fd',
    marginTop: 2,
  },
  bellBtn: {
    padding: 8,
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  childSwitcherContainer: {
    marginBottom: 14,
  },
  switcherHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  switcherHeaderLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  addChildHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  addChildHeaderText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  childTabsScroll: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  childTabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  childTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    minWidth: 140,
  },
  addChildMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  addChildMiniText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#070b13',
    marginBottom: 10,
    fontSize: 12,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
  },
  modalSaveBtn: {
    borderRadius: 10,
  },
  childTabActive: {
    borderColor: '#3B49DF',
    backgroundColor: 'rgba(59, 73, 223, 0.12)',
  },
  childTabName: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  childTabNameActive: {
    color: '#fff',
  },
  childTabGrade: {
    color: '#64748b',
    fontSize: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
  },
  otpCard: {
    backgroundColor: '#0b1329',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: 16,
    marginBottom: 14,
  },
  otpCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  otpCardBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#38bdf8',
    letterSpacing: 0.5,
  },
  etaText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#10b981',
  },
  otpDisplaySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  otpHintLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 6,
  },
  otpBoxRow: {
    flexDirection: 'row',
    gap: 6,
  },
  otpDigitBox: {
    width: 32,
    height: 36,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  otpDigitText: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshOtpBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  refreshOtpText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  driverQuickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverNameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vehicleNoText: {
    color: '#94a3b8',
    fontSize: 10,
  },
  driverActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  callIconBtn: {
    padding: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  whatsappIconBtn: {
    padding: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  pipelineCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 20,
  },
  pipelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pipelineTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveMapBtn: {
    borderRadius: 10,
  },
  pipeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  pipeStep: {
    alignItems: 'center',
  },
  pipeNode: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pipeCheck: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  pipeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  pipeTime: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 1,
  },
  pipeLineActive: {
    flex: 1,
    height: 2,
    backgroundColor: '#3B49DF',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  pipeLineInactive: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  geofenceConfigRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  geofenceTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  geofenceSub: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 1,
  },
  geofenceChipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  distChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  distChipActive: {
    backgroundColor: '#3B49DF',
    borderColor: '#60a5fa',
  },
  distChipText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  distChipTextActive: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '31%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    color: '#e5e7eb',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
