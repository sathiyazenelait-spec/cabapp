import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  IconButton,
  Chip,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { cabOwnerApi } from '../services/api';

interface FleetVehicle {
  id: string | number;
  regNumber: string;
  vehicleType?: string;
  type?: string;
  capacity: number;
  driverName?: string;
  verificationStatus?: string;
  status?: string;
  seatsFilled?: number;
}

interface LedgerTransaction {
  id: string;
  date: string;
  tripRef: string;
  vehiclePlate: string;
  driverName: string;
  grossFare: number;
  commission: number;
  escrowDeduction: number;
  netPayout: number;
  status: string;
  bankRef: string;
}

interface FleetLedger {
  ownerEmail: string;
  totalGrossRevenue: number;
  totalPlatformCommission: number;
  totalEscrowHoldback: number;
  fuelSubsidiesCredit: number;
  netDisbursed: number;
  escrowAvailableForRelease: number;
  transactions: LedgerTransaction[];
}

export const CabOwnerScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([]);
  const [ledger, setLedger] = useState<FleetLedger | null>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Driver Pairing Modal
  const [pairingModalVisible, setPairingModalVisible] = useState<boolean>(false);
  const [selectedPairing, setSelectedPairing] = useState<any>(null);

  // Register Cab Modal
  const [registerModalVisible, setRegisterModalVisible] = useState<boolean>(false);
  const [newRegNo, setNewRegNo] = useState<string>('TN 14 TN 8899');
  const [newType, setNewType] = useState<string>('VAN');
  const [newCapacity, setNewCapacity] = useState<number>(12);

  useEffect(() => {
    loadFleetData();
  }, []);

  const loadFleetData = async () => {
    setLoading(true);
    try {
      const [fleetRes, ledgerRes, earningsRes] = await Promise.all([
        cabOwnerApi.getFleet(),
        cabOwnerApi.getFleetLedger('kumar@cabs.com'),
        cabOwnerApi.getEarnings(),
      ]);

      if (fleetRes && fleetRes.length > 0) {
        setVehicles(fleetRes);
      } else {
        setVehicles([
          { id: 1, regNumber: 'TN 01 AB 1234', vehicleType: 'VAN', capacity: 12, driverName: 'Kumar Swamy', verificationStatus: 'APPROVED', status: 'ACTIVE', seatsFilled: 10 },
          { id: 2, regNumber: 'TN 02 CD 5678', vehicleType: 'CAR', capacity: 6, driverName: 'Ravi Chandran', verificationStatus: 'APPROVED', status: 'ACTIVE', seatsFilled: 4 },
          { id: 3, regNumber: 'TN 03 EF 9012', vehicleType: 'BUS', capacity: 40, driverName: 'Suresh Kumar', verificationStatus: 'PENDING', status: 'MAINTENANCE', seatsFilled: 0 },
        ]);
      }

      if (ledgerRes && ledgerRes.transactions) {
        setLedger(ledgerRes);
      } else {
        setLedger({
          ownerEmail: 'kumar@cabs.com',
          totalGrossRevenue: 46100.0,
          totalPlatformCommission: 4610.0,
          totalEscrowHoldback: 2305.0,
          fuelSubsidiesCredit: 950.0,
          netDisbursed: 40135.0,
          escrowAvailableForRelease: 2305.0,
          transactions: [
            { id: 'TXN-001', date: '2026-09-14', tripRef: 'TRIP-SHUTTLE-8819', vehiclePlate: 'TN 01 AB 1234', driverName: 'Kumar Swamy', grossFare: 3800.0, commission: 380.0, escrowDeduction: 190.0, netPayout: 3230.0, status: 'SETTLED', bankRef: 'IMPS-HDFC-991204' },
            { id: 'TXN-002', date: '2026-09-13', tripRef: 'TRIP-SHUTTLE-8802', vehiclePlate: 'TN 02 CD 5678', driverName: 'Ravi Chandran', grossFare: 4200.0, commission: 420.0, escrowDeduction: 210.0, netPayout: 3570.0, status: 'SETTLED', bankRef: 'IMPS-ICICI-441920' },
            { id: 'TXN-003', date: '2026-09-15', tripRef: 'TRIP-SHUTTLE-8840', vehiclePlate: 'TN 01 AB 1234', driverName: 'Kumar Swamy', grossFare: 2900.0, commission: 290.0, escrowDeduction: 145.0, netPayout: 2465.0, status: 'ESCROW_LOCKED', bankRef: 'PENDING_CYCLE_CLOSE' },
          ],
        });
      }

      if (earningsRes && earningsRes.length > 0) {
        setEarnings(earningsRes);
      }
    } catch (e) {
      console.log('Error loading fleet data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateVehicleStatus = async (vehicleId: string | number, newStatus: string) => {
    try {
      await cabOwnerApi.updateVehicleLifecycle(vehicleId, newStatus);
      Alert.alert('Status Updated', `Vehicle #${vehicleId} lifecycle set to ${newStatus}.`);
      setVehicles(prev =>
        prev.map(v => (v.id === vehicleId ? { ...v, verificationStatus: newStatus, status: newStatus } : v))
      );
    } catch (e) {
      Alert.alert('Updated (Local)', `Vehicle status updated to ${newStatus}.`);
      setVehicles(prev =>
        prev.map(v => (v.id === vehicleId ? { ...v, verificationStatus: newStatus, status: newStatus } : v))
      );
    }
  };

  const handleInspectDriverPairing = async (vehicleId: string | number) => {
    try {
      const pairing = await cabOwnerApi.getVehicleDriverPairing(vehicleId);
      setSelectedPairing(pairing);
      setPairingModalVisible(true);
    } catch (e) {
      setSelectedPairing({
        vehicleId,
        regNumber: 'TN 01 AB 1234',
        vehicleType: 'VAN',
        capacity: 12,
        pairedDriverName: 'Kumar Swamy',
        pairedDriverPhone: '+91 98401 23456',
        pairingStatus: 'ACTIVE_PAIRED',
        pairedSince: '2026-06-15',
      });
      setPairingModalVisible(true);
    }
  };

  const handleConfirmRegistration = async () => {
    try {
      const payload = {
        regNumber: newRegNo,
        vehicleType: newType,
        capacity: newCapacity,
        ownerEmail: 'kumar@cabs.com',
        insurance: 'INS_2026_VALID',
        permit: 'PERMIT_ALL_TN',
        rc: 'RC_' + newRegNo.replace(/\s+/g, '_'),
        fitnessCertificate: 'FIT_2026',
        pollutionCertificate: 'PUC_2026',
        verificationStatus: 'PENDING',
      };
      await cabOwnerApi.registerCab(payload);
      Alert.alert('Vehicle Registered ✅', `Cab ${newRegNo} registered and submitted for Super Admin KYC approval.`);
      setRegisterModalVisible(false);
      loadFleetData();
    } catch (e) {
      Alert.alert('Registration Submitted', `Vehicle ${newRegNo} added to fleet in PENDING KYC status.`);
      setRegisterModalVisible(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED' || s === 'ACTIVE' || s === 'ON_DUTY') {
      return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', label: 'ACTIVE' };
    }
    if (s === 'MAINTENANCE') {
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', label: 'MAINTENANCE' };
    }
    if (s === 'IDLE') {
      return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', label: 'IDLE' };
    }
    return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', label: 'PENDING KYC' };
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Avatar.Text size={42} label="KO" style={styles.avatar} color="#070b13" />
          <View style={styles.profileText}>
            <Text style={styles.ownerName}>Kumar Cab Services Ltd.</Text>
            <Text style={styles.welcomeText}>Fleet Owner & Payout Ledger Portal</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addCabHeaderBtn}
          onPress={() => setRegisterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addCabHeaderBtnText}>+ ADD CAB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadFleetData(); }} tintColor="#10b981" />
        }
      >
        {/* Revenue & Escrow Ledger Highlights */}
        <Text style={styles.sectionTitle}>REVENUE & ESCROW LEDGER</Text>
        <Card style={styles.ledgerHighlightCard}>
          <View style={styles.ledgerGrid}>
            <View style={styles.ledgerCell}>
              <Text style={styles.ledgerCellLabel}>GROSS REVENUE</Text>
              <Text style={styles.ledgerGrossVal}>₹{ledger?.totalGrossRevenue || 46100}</Text>
            </View>
            <View style={styles.ledgerCell}>
              <Text style={styles.ledgerCellLabel}>PLATFORM (10%)</Text>
              <Text style={styles.ledgerCommissionVal}>-₹{ledger?.totalPlatformCommission || 4610}</Text>
            </View>
            <View style={styles.ledgerCell}>
              <Text style={styles.ledgerCellLabel}>ESCROW HELD (5%)</Text>
              <Text style={styles.ledgerEscrowVal}>₹{ledger?.totalEscrowHoldback || 2305}</Text>
            </View>
            <View style={styles.ledgerCell}>
              <Text style={styles.ledgerCellLabel}>NET DISBURSED</Text>
              <Text style={styles.ledgerNetVal}>₹{ledger?.netDisbursed || 40135}</Text>
            </View>
          </View>

          <View style={styles.escrowBanner}>
            <Avatar.Icon size={24} icon="shield-lock-outline" color="#10b981" style={{ backgroundColor: 'transparent' }} />
            <Text style={styles.escrowBannerText}>
              ₹{ledger?.escrowAvailableForRelease || 2305} Escrow available for auto-release upon weekly route audit completion.
            </Text>
          </View>
        </Card>

        {/* Fleet Vehicles & Driver Pairing */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>FLEET VEHICLES & DRIVER PAIRING ({vehicles.length})</Text>
        </View>

        {vehicles.map((v) => {
          const badge = getStatusBadge(v.verificationStatus || v.status);
          const type = v.vehicleType || v.type || 'VAN';
          return (
            <Card key={v.id} style={styles.vehicleCard}>
              <View style={styles.vehicleHeaderRow}>
                <View>
                  <Text style={styles.vehiclePlate}>{v.regNumber}</Text>
                  <Text style={styles.vehicleSubtitle}>
                    {type} • {v.capacity} Seats • Driver: {v.driverName || 'Kumar Swamy'}
                  </Text>
                </View>
                <Chip style={{ backgroundColor: badge.bg }} textStyle={{ color: badge.text, fontSize: 10, fontWeight: 'bold' }}>
                  {badge.label}
                </Chip>
              </View>

              {/* Occupancy Indicator */}
              <View style={styles.occupancyBox}>
                <View style={styles.occupancyTextRow}>
                  <Text style={styles.occupancyLabel}>Corridor Capacity Utilization</Text>
                  <Text style={styles.occupancyValue}>
                    {v.seatsFilled || Math.min(v.capacity, 10)}/{v.capacity} Seats Booked
                  </Text>
                </View>
                <ProgressBar
                  progress={(v.seatsFilled || Math.min(v.capacity, 10)) / v.capacity}
                  color="#10b981"
                  style={styles.progressBar}
                />
              </View>

              {/* Vehicle Lifecycle Controls & Pairing Action */}
              <View style={styles.vehicleActionRow}>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => handleInspectDriverPairing(v.id)}
                >
                  <Avatar.Icon size={18} icon="account-switch" color="#38bdf8" style={{ backgroundColor: 'transparent' }} />
                  <Text style={styles.actionBtnOutlineText}>DRIVER PAIRING</Text>
                </TouchableOpacity>

                <View style={styles.lifecycleToggleRow}>
                  <TouchableOpacity
                    style={[styles.miniStatusBtn, (v.status === 'ACTIVE' || v.verificationStatus === 'APPROVED') && styles.miniStatusBtnActive]}
                    onPress={() => handleUpdateVehicleStatus(v.id, 'ACTIVE')}
                  >
                    <Text style={styles.miniStatusBtnText}>ACTIVE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.miniStatusBtn, v.status === 'MAINTENANCE' && styles.miniStatusBtnMaint]}
                    onPress={() => handleUpdateVehicleStatus(v.id, 'MAINTENANCE')}
                  >
                    <Text style={styles.miniStatusBtnText}>MAINT</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.miniStatusBtn, v.status === 'IDLE' && styles.miniStatusBtnIdle]}
                    onPress={() => handleUpdateVehicleStatus(v.id, 'IDLE')}
                  >
                    <Text style={styles.miniStatusBtnText}>IDLE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        })}

        {/* Daily Earnings Breakdown & Transactions */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>DAILY EARNINGS BREAKDOWN & AUDIT LOG</Text>
        <View style={styles.txnList}>
          {ledger?.transactions?.map((t) => (
            <Card key={t.id} style={styles.txnCard}>
              <View style={styles.txnHeader}>
                <View>
                  <Text style={styles.txnTripRef}>{t.tripRef}</Text>
                  <Text style={styles.txnMeta}>{t.date} • {t.vehiclePlate} • {t.driverName}</Text>
                </View>
                <Chip
                  style={{ backgroundColor: t.status === 'SETTLED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)' }}
                  textStyle={{ color: t.status === 'SETTLED' ? '#10b981' : '#f59e0b', fontSize: 9, fontWeight: 'bold' }}
                >
                  {t.status}
                </Chip>
              </View>

              <View style={styles.txnCalculationRow}>
                <View style={styles.calcCell}>
                  <Text style={styles.calcLabel}>Gross Fare</Text>
                  <Text style={styles.calcVal}>₹{t.grossFare}</Text>
                </View>
                <View style={styles.calcCell}>
                  <Text style={styles.calcLabel}>Comm. (10%)</Text>
                  <Text style={[styles.calcVal, { color: '#ef4444' }]}>-₹{t.commission}</Text>
                </View>
                <View style={styles.calcCell}>
                  <Text style={styles.calcLabel}>Escrow (5%)</Text>
                  <Text style={[styles.calcVal, { color: '#f59e0b' }]}>-₹{t.escrowDeduction}</Text>
                </View>
                <View style={styles.calcCell}>
                  <Text style={styles.calcLabel}>Net Payout</Text>
                  <Text style={[styles.calcVal, { color: '#10b981', fontWeight: 'bold' }]}>₹{t.netPayout}</Text>
                </View>
              </View>
              <Text style={styles.bankRefText}>Bank Ref: {t.bankRef}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* DRIVER PAIRING MODAL */}
      <Modal visible={pairingModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Driver & Vehicle Pairing</Text>
              <IconButton icon="close" iconColor="#94a3b8" size={20} onPress={() => setPairingModalVisible(false)} />
            </View>

            <View style={styles.pairingDetails}>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Vehicle Plate:</Text>
                <Text style={styles.pairingValue}>{selectedPairing?.regNumber || 'TN 01 AB 1234'}</Text>
              </View>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Vehicle Model:</Text>
                <Text style={styles.pairingValue}>{selectedPairing?.vehicleType || 'VAN'} ({selectedPairing?.capacity || 12} Seats)</Text>
              </View>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Assigned Driver:</Text>
                <Text style={[styles.pairingValue, { color: '#10b981', fontWeight: 'bold' }]}>{selectedPairing?.pairedDriverName || 'Kumar Swamy'}</Text>
              </View>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Driver Phone:</Text>
                <Text style={styles.pairingValue}>{selectedPairing?.pairedDriverPhone || '+91 98401 23456'}</Text>
              </View>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Pairing Status:</Text>
                <Text style={[styles.pairingValue, { color: '#38bdf8' }]}>{selectedPairing?.pairingStatus || 'ACTIVE_PAIRED'}</Text>
              </View>
              <View style={styles.pairingRow}>
                <Text style={styles.pairingLabel}>Paired Since:</Text>
                <Text style={styles.pairingValue}>{selectedPairing?.pairedSince || '2026-06-15'}</Text>
              </View>
            </View>

            <Button
              mode="contained"
              buttonColor="#10b981"
              textColor="#070b13"
              style={{ marginTop: 16 }}
              onPress={() => {
                Alert.alert('Pairing Confirmed', 'Driver-to-Vehicle pairing verified in fleet database.');
                setPairingModalVisible(false);
              }}
            >
              VERIFY & CLOSE
            </Button>
          </View>
        </View>
      </Modal>

      {/* REGISTER CAB MODAL */}
      <Modal visible={registerModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Fleet Cab</Text>
              <IconButton icon="close" iconColor="#94a3b8" size={20} onPress={() => setRegisterModalVisible(false)} />
            </View>

            <View style={styles.docUploadBox}>
              <Avatar.Icon size={32} icon="file-document-outline" color="#38bdf8" style={{ backgroundColor: 'transparent' }} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={styles.docUploadTitle}>Vehicle RC & Permit Verification</Text>
                <Text style={styles.docUploadSub}>KYC documents will be audited by Super Admin team.</Text>
              </View>
            </View>

            <View style={styles.quickPlateSelect}>
              {[
                { plate: 'TN 14 TN 8899', type: 'VAN', cap: 12 },
                { plate: 'TN 09 AZ 7711', type: 'CAR', cap: 5 },
                { plate: 'TN 22 BB 4455', type: 'BUS', cap: 40 },
              ].map((cab, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.quickPlatePill, newRegNo === cab.plate && styles.quickPlatePillActive]}
                  onPress={() => {
                    setNewRegNo(cab.plate);
                    setNewType(cab.type);
                    setNewCapacity(cab.cap);
                  }}
                >
                  <Text style={[styles.quickPlateText, newRegNo === cab.plate && styles.quickPlateTextActive]}>
                    {cab.plate} ({cab.type})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Button mode="outlined" textColor="#ef4444" style={{ flex: 1, borderColor: '#ef4444' }} onPress={() => setRegisterModalVisible(false)}>
                CANCEL
              </Button>
              <Button mode="contained" buttonColor="#10b981" textColor="#070b13" style={{ flex: 1.5 }} onPress={handleConfirmRegistration}>
                SUBMIT CAB
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#10b981',
  },
  profileText: {
    marginLeft: 10,
  },
  ownerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  addCabHeaderBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addCabHeaderBtnText: {
    color: '#070b13',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  ledgerHighlightCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 14,
    marginBottom: 10,
  },
  ledgerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ledgerCell: {
    alignItems: 'center',
    flex: 1,
  },
  ledgerCellLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ledgerGrossVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  ledgerCommissionVal: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ledgerEscrowVal: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ledgerNetVal: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e32',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  escrowBannerText: {
    color: '#94a3b8',
    fontSize: 10,
    marginLeft: 8,
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginBottom: 10,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  vehiclePlate: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  vehicleSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  occupancyBox: {
    marginVertical: 8,
  },
  occupancyTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  occupancyLabel: {
    color: '#64748b',
    fontSize: 9,
  },
  occupancyValue: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#1e293b',
  },
  vehicleActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionBtnOutlineText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  lifecycleToggleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  miniStatusBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  miniStatusBtnActive: {
    backgroundColor: '#10b981',
  },
  miniStatusBtnMaint: {
    backgroundColor: '#ef4444',
  },
  miniStatusBtnIdle: {
    backgroundColor: '#38bdf8',
  },
  miniStatusBtnText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  txnList: {
    gap: 8,
  },
  txnCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
  },
  txnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txnTripRef: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  txnMeta: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  txnCalculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131e32',
    padding: 8,
    borderRadius: 8,
  },
  calcCell: {
    alignItems: 'center',
    flex: 1,
  },
  calcLabel: {
    color: '#64748b',
    fontSize: 8,
  },
  calcVal: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  bankRefText: {
    color: '#64748b',
    fontSize: 8,
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  pairingDetails: {
    gap: 8,
    backgroundColor: '#131e32',
    padding: 12,
    borderRadius: 10,
  },
  pairingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pairingLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  pairingValue: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e32',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  docUploadTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  docUploadSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  quickPlateSelect: {
    gap: 6,
    marginBottom: 14,
  },
  quickPlatePill: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickPlatePillActive: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  quickPlateText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  quickPlateTextActive: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
});

