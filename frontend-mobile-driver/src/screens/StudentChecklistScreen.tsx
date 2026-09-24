import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { Text, Card, Avatar, Button, IconButton, Searchbar, Chip } from 'react-native-paper';
import { driverApi } from '../services/api';

interface StudentRosterItem {
  id: string;
  logId: number;
  name: string;
  rollNo: string;
  grade: string;
  stopId: number;
  stopName: string;
  guardianName: string;
  guardianPhone: string;
  status: 'PENDING' | 'BOARDED' | 'ABSENT';
  boardedAt?: string;
  qrCode: string;
}

const WAYPOINT_STOPS = [
  { id: 1, name: 'Kasturba Nagar Stop 1', time: '07:30 AM', studentCount: 2 },
  { id: 2, name: 'Lawspet Junction', time: '07:45 AM', studentCount: 2 },
  { id: 3, name: 'ECR Bypass', time: '08:00 AM', studentCount: 1 },
  { id: 4, name: 'Green Valley Campus Gate', time: '08:15 AM', studentCount: 0 },
];

const INITIAL_STUDENTS: StudentRosterItem[] = [
  {
    id: 's1',
    logId: 1,
    name: 'Aarav Patel',
    rollNo: 'STD-1042',
    grade: 'Class 8-A',
    stopId: 1,
    stopName: 'Kasturba Nagar Stop 1',
    guardianName: 'Suresh Patel (Father)',
    guardianPhone: '+91 98401 11223',
    status: 'PENDING',
    qrCode: 'STU-001',
  },
  {
    id: 's2',
    logId: 2,
    name: 'Diya Sharma',
    rollNo: 'STD-1055',
    grade: 'Class 9-B',
    stopId: 1,
    stopName: 'Kasturba Nagar Stop 1',
    guardianName: 'Ramesh Sharma (Uncle)',
    guardianPhone: '+91 98402 33445',
    status: 'BOARDED',
    boardedAt: '07:32 AM',
    qrCode: 'STU-002',
  },
  {
    id: 's3',
    logId: 3,
    name: 'Rohan Iyer',
    rollNo: 'STD-1089',
    grade: 'Class 7-C',
    stopId: 2,
    stopName: 'Lawspet Junction',
    guardianName: 'Priya Iyer (Mother)',
    guardianPhone: '+91 98403 55667',
    status: 'PENDING',
    qrCode: 'STU-003',
  },
  {
    id: 's4',
    logId: 4,
    name: 'Ananya Vashistha',
    rollNo: 'STD-1102',
    grade: 'Class 10-A',
    stopId: 2,
    stopName: 'Lawspet Junction',
    guardianName: 'Vikas Vashistha (Father)',
    guardianPhone: '+91 98404 77889',
    status: 'ABSENT',
    boardedAt: 'Marked Absent',
    qrCode: 'STU-004',
  },
  {
    id: 's5',
    logId: 5,
    name: 'Kavya Sundaram',
    rollNo: 'STD-1120',
    grade: 'Class 6-B',
    stopId: 3,
    stopName: 'ECR Bypass',
    guardianName: 'Sundaram Natarajan (Father)',
    guardianPhone: '+91 98405 99001',
    status: 'PENDING',
    qrCode: 'STU-005',
  },
];

export const StudentChecklistScreen: React.FC = () => {
  const [students, setStudents] = useState<StudentRosterItem[]>(INITIAL_STUDENTS);
  const [selectedStopId, setSelectedStopId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'BOARDED' | 'ABSENT'>('ALL');

  // QR Scanner Modal State
  const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
  const [lastScannedStudent, setLastScannedStudent] = useState<StudentRosterItem | null>(null);

  // Guardian PIN Verification Modal
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [selectedStudentForPin, setSelectedStudentForPin] = useState<StudentRosterItem | null>(null);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinMessage, setPinMessage] = useState<string>('');

  // Laser scanner animation
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showQrScanner) {
      const laserLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 180,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      laserLoop.start();
      return () => laserLoop.stop();
    }
  }, [showQrScanner]);

  // Toggle student status (Mark Boarded / Absent / Pending)
  const handleUpdateStatus = async (studentId: string, nextStatus: 'BOARDED' | 'ABSENT' | 'PENDING') => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const timeString = nextStatus === 'BOARDED' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, status: nextStatus, boardedAt: timeString }
          : s
      )
    );

    try {
      await driverApi.toggleBoard(student.logId, nextStatus);
    } catch (e) {
      console.log('Status update demo mode', e);
    }
  };

  // Mark all students at current stop as boarded
  const handleMarkAllStopBoarded = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStudents((prev) =>
      prev.map((s) =>
        s.stopId === selectedStopId && s.status !== 'ABSENT'
          ? { ...s, status: 'BOARDED', boardedAt: timeString }
          : s
      )
    );
    Alert.alert('Stop Check-In Complete', `All present students at ${WAYPOINT_STOPS.find(w => w.id === selectedStopId)?.name} marked as BOARDED.`);
  };

  // Handle QR code match
  const handleSimulateQrScan = (code: string) => {
    const found = students.find((s) => s.qrCode === code);
    if (found) {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStudents((prev) =>
        prev.map((s) =>
          s.id === found.id
            ? { ...s, status: 'BOARDED', boardedAt: timeString }
            : s
        )
      );
      setLastScannedStudent({ ...found, status: 'BOARDED', boardedAt: timeString });
      try {
        driverApi.toggleBoard(found.logId, 'BOARDED').catch(() => {});
      } catch (e) {}
    } else {
      Alert.alert('Unrecognized QR', `No student registered with QR token ${code}.`);
    }
  };

  // Handle Guardian PIN Handover Verification
  const handleVerifyGuardianPin = async () => {
    if (pinInput.length < 4) {
      setPinMessage('Please enter 4-digit PIN.');
      return;
    }

    try {
      const res = await driverApi.verifyGuardianPin(pinInput, selectedStudentForPin?.id);
      if (res && res.verified) {
        Alert.alert('Guardian Verified ✅', `${res.guardianName} identity confirmed. Safe handover certified.`);
        setShowPinModal(false);
        setPinInput('');
        setPinMessage('');
      } else {
        setPinMessage('Invalid PIN. Correct demo PIN is 7429.');
      }
    } catch (e) {
      if (pinInput === '7429') {
        Alert.alert('Guardian Verified ✅', 'Ramesh Sharma (Uncle) identity confirmed. Safe handover certified.');
        setShowPinModal(false);
        setPinInput('');
        setPinMessage('');
      } else {
        setPinMessage('Invalid PIN. Correct demo PIN is 7429.');
      }
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesStop = selectedStopId === 0 || s.stopId === selectedStopId;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesStop && matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalCount = students.length;
  const boardedCount = students.filter((s) => s.status === 'BOARDED').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;
  const pendingCount = students.filter((s) => s.status === 'PENDING').length;
  const boardedPct = Math.round((boardedCount / totalCount) * 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Student Boarding Roster
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            Waypoint Check-in • Instant QR Verification • Safe Handover
          </Text>
        </View>
        <TouchableOpacity
          style={styles.qrScanHeaderBtn}
          onPress={() => setShowQrScanner(true)}
          activeOpacity={0.8}
        >
          <Avatar.Icon size={22} icon="qrcode-scan" style={{ backgroundColor: 'transparent' }} color="#070b13" />
          <Text style={styles.qrScanHeaderBtnText}>SCAN QR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Attendance Summary Banner */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10b981' }]}>{boardedCount}</Text>
              <Text style={styles.statLabel}>Boarded ({boardedPct}%)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#ef4444' }]}>{absentCount}</Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
          </View>
        </Card>

        {/* Waypoint Stops Horizontal Selector */}
        <Text style={styles.sectionHeading}>SELECT WAYPOINT STOP</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stopsScroll}>
          <TouchableOpacity
            style={[styles.stopPill, selectedStopId === 0 && styles.stopPillActive]}
            onPress={() => setSelectedStopId(0)}
          >
            <Text style={[styles.stopPillName, selectedStopId === 0 && styles.stopPillNameActive]}>
              All Stops ({totalCount})
            </Text>
          </TouchableOpacity>
          {WAYPOINT_STOPS.map((stop) => {
            const count = students.filter((s) => s.stopId === stop.id).length;
            const isSelected = selectedStopId === stop.id;
            return (
              <TouchableOpacity
                key={stop.id}
                style={[styles.stopPill, isSelected && styles.stopPillActive]}
                onPress={() => setSelectedStopId(stop.id)}
              >
                <Text style={[styles.stopPillName, isSelected && styles.stopPillNameActive]}>
                  {stop.name}
                </Text>
                <Text style={[styles.stopPillTime, isSelected && styles.stopPillTimeActive]}>
                  {stop.time} • {count} stds
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Quick Batch Actions for Stop */}
        {selectedStopId !== 0 && (
          <View style={styles.batchActionRow}>
            <Button
              mode="contained"
              icon="checkbox-multiple-marked"
              buttonColor="#10b981"
              textColor="#070b13"
              style={styles.batchBtn}
              onPress={handleMarkAllStopBoarded}
            >
              MARK ALL STOP BOARDED
            </Button>
          </View>
        )}

        {/* Search & Filter Bar */}
        <Searchbar
          placeholder="Search student or roll no..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ color: '#ffffff', fontSize: 13 }}
          iconColor="#94a3b8"
          placeholderTextColor="#64748b"
        />

        {/* Status Filter Chips */}
        <View style={styles.filterChipRow}>
          {(['ALL', 'PENDING', 'BOARDED', 'ABSENT'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, statusFilter === filter && styles.filterChipActive]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text style={[styles.filterChipText, statusFilter === filter && styles.filterChipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Student Checklist Cards */}
        <View style={styles.studentsList}>
          {filteredStudents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No students match the selected filter.</Text>
            </View>
          ) : (
            filteredStudents.map((student) => {
              const isBoarded = student.status === 'BOARDED';
              const isAbsent = student.status === 'ABSENT';
              const isPending = student.status === 'PENDING';

              return (
                <Card key={student.id} style={styles.studentCard}>
                  <View style={styles.studentCardHeader}>
                    <Avatar.Text
                      size={40}
                      label={student.name.substring(0, 2).toUpperCase()}
                      style={{
                        backgroundColor: isBoarded ? 'rgba(16, 185, 129, 0.2)' : isAbsent ? 'rgba(239, 68, 68, 0.2)' : '#1e293b',
                      }}
                      color={isBoarded ? '#10b981' : isAbsent ? '#ef4444' : '#94a3b8'}
                    />
                    <View style={styles.studentDetails}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.studentName}>{student.name}</Text>
                        {/* Status Badge */}
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: isBoarded
                                ? 'rgba(16, 185, 129, 0.15)'
                                : isAbsent
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isBoarded ? '#10b981' : isAbsent ? '#ef4444' : '#f59e0b',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: isBoarded ? '#10b981' : isAbsent ? '#ef4444' : '#f59e0b' },
                            ]}
                          >
                            {student.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.studentSub}>
                        {student.rollNo} • {student.grade} • 📍 {student.stopName}
                      </Text>
                      {student.boardedAt && (
                        <Text style={styles.boardedTimeText}>
                          🕒 {isBoarded ? `Boarded at ${student.boardedAt}` : student.boardedAt}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Guardian & Call Info */}
                  <View style={styles.guardianRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.guardianLabel}>GUARDIAN</Text>
                      <Text style={styles.guardianName}>{student.guardianName}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.guardianCallBtn}
                      onPress={() => Linking.openURL(`tel:${student.guardianPhone}`)}
                    >
                      <Avatar.Icon size={24} icon="phone" style={{ backgroundColor: 'transparent' }} color="#10b981" />
                      <Text style={styles.guardianCallText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.guardianPinBtn}
                      onPress={() => {
                        setSelectedStudentForPin(student);
                        setShowPinModal(true);
                      }}
                    >
                      <Avatar.Icon size={24} icon="shield-key" style={{ backgroundColor: 'transparent' }} color="#f59e0b" />
                      <Text style={styles.guardianPinText}>PIN</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={[styles.actionChip, isBoarded && styles.actionChipBoardedActive]}
                      onPress={() => handleUpdateStatus(student.id, 'BOARDED')}
                      activeOpacity={0.7}
                    >
                      <Avatar.Icon size={20} icon="check-circle" color={isBoarded ? '#070b13' : '#10b981'} style={{ backgroundColor: 'transparent' }} />
                      <Text style={[styles.actionChipText, isBoarded && { color: '#070b13', fontWeight: 'bold' }]}>
                        Boarded
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionChip, isAbsent && styles.actionChipAbsentActive]}
                      onPress={() => handleUpdateStatus(student.id, 'ABSENT')}
                      activeOpacity={0.7}
                    >
                      <Avatar.Icon size={20} icon="close-circle" color={isAbsent ? '#ffffff' : '#ef4444'} style={{ backgroundColor: 'transparent' }} />
                      <Text style={[styles.actionChipText, isAbsent && { color: '#ffffff', fontWeight: 'bold' }]}>
                        Absent
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionChip, isPending && styles.actionChipPendingActive]}
                      onPress={() => handleUpdateStatus(student.id, 'PENDING')}
                      activeOpacity={0.7}
                    >
                      <Avatar.Icon size={20} icon="clock-outline" color={isPending ? '#070b13' : '#f59e0b'} style={{ backgroundColor: 'transparent' }} />
                      <Text style={[styles.actionChipText, isPending && { color: '#070b13', fontWeight: 'bold' }]}>
                        Pending
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* QR SCANNER MODAL */}
      <Modal visible={showQrScanner} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.qrScannerCard}>
            <View style={styles.qrScannerHeader}>
              <Text style={styles.qrScannerTitle}>Student ID Badge Scanner</Text>
              <IconButton icon="close" iconColor="#94a3b8" size={24} onPress={() => setShowQrScanner(false)} />
            </View>

            {/* Viewfinder simulation */}
            <View style={styles.viewfinder}>
              <View style={[styles.reticleCorner, styles.reticleTopLeft]} />
              <View style={[styles.reticleCorner, styles.reticleTopRight]} />
              <View style={[styles.reticleCorner, styles.reticleBottomLeft]} />
              <View style={[styles.reticleCorner, styles.reticleBottomRight]} />

              {/* Animated Laser Beam */}
              <Animated.View
                style={[
                  styles.laserBeam,
                  {
                    transform: [{ translateY: laserAnim }],
                  },
                ]}
              />

              <Avatar.Icon size={56} icon="qrcode" color="rgba(255, 255, 255, 0.4)" style={{ backgroundColor: 'transparent' }} />
              <Text style={styles.viewfinderText}>Align Student Smart Badge / QR</Text>
            </View>

            {/* Success Scan Feedback */}
            {lastScannedStudent && (
              <View style={styles.scannedSuccessBox}>
                <Avatar.Icon size={24} icon="check-circle" color="#10b981" style={{ backgroundColor: 'transparent' }} />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.scannedStudentName}>{lastScannedStudent.name} (Verified)</Text>
                  <Text style={styles.scannedStudentSub}>Status updated to BOARDED at {lastScannedStudent.boardedAt}</Text>
                </View>
              </View>
            )}

            {/* Test QR Quick Triggers */}
            <Text style={styles.qrSimLabel}>SIMULATE QR SCAN CLICK:</Text>
            <View style={styles.qrSimRow}>
              {['STU-001', 'STU-002', 'STU-003', 'STU-005'].map((code) => (
                <TouchableOpacity
                  key={code}
                  style={styles.qrSimButton}
                  onPress={() => handleSimulateQrScan(code)}
                >
                  <Text style={styles.qrSimButtonText}>{code}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              mode="contained"
              buttonColor="#10b981"
              textColor="#070b13"
              style={{ marginTop: 16, borderRadius: 10 }}
              onPress={() => setShowQrScanner(false)}
            >
              DONE SCANNING
            </Button>
          </View>
        </View>
      </Modal>

      {/* GUARDIAN PIN HANDOVER MODAL */}
      <Modal visible={showPinModal} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.pinModalCard}>
            <View style={styles.pinModalHeader}>
              <Avatar.Icon size={36} icon="shield-account" style={{ backgroundColor: 'transparent' }} color="#f59e0b" />
              <Text style={styles.pinModalTitle}>Guardian Release Verification</Text>
              <Text style={styles.pinModalSub}>
                Releasing {selectedStudentForPin?.name} to {selectedStudentForPin?.guardianName}
              </Text>
            </View>

            <Text style={styles.pinLabel}>ENTER 4-DIGIT GUARDIAN PIN (DEMO: 7429)</Text>
            <TextInput
              style={styles.pinInputField}
              value={pinInput}
              onChangeText={setPinInput}
              placeholder="7429"
              placeholderTextColor="#64748b"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            {pinMessage ? <Text style={styles.pinMessageText}>{pinMessage}</Text> : null}

            <View style={styles.pinModalActions}>
              <Button mode="outlined" textColor="#94a3b8" style={{ flex: 1, borderColor: '#334155' }} onPress={() => setShowPinModal(false)}>
                CANCEL
              </Button>
              <Button mode="contained" buttonColor="#10b981" textColor="#070b13" style={{ flex: 1 }} onPress={handleVerifyGuardianPin}>
                CONFIRM RELEASE
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  qrScanHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  qrScanHeaderBtnText: {
    color: '#070b13',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeading: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stopsScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  stopPill: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  stopPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981',
  },
  stopPillName: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  stopPillNameActive: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  stopPillTime: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  stopPillTimeActive: {
    color: '#34d399',
  },
  batchActionRow: {
    marginTop: 10,
  },
  batchBtn: {
    borderRadius: 10,
    paddingVertical: 2,
  },
  searchBar: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    marginTop: 14,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 14,
  },
  filterChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  filterChipTextActive: {
    color: '#070b13',
  },
  studentsList: {
    gap: 12,
  },
  studentCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  studentSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  boardedTimeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  guardianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e32',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },
  guardianLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
  },
  guardianName: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  guardianCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  guardianCallText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  guardianPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  guardianPinText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionChipBoardedActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  actionChipAbsentActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  actionChipPendingActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  actionChipText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrScannerCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
  },
  qrScannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrScannerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewfinder: {
    height: 200,
    backgroundColor: '#070b13',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  reticleCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#10b981',
  },
  reticleTopLeft: {
    top: 16,
    left: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  reticleTopRight: {
    top: 16,
    right: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  reticleBottomLeft: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  reticleBottomRight: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserBeam: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  viewfinderText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
  },
  scannedSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  scannedStudentName: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scannedStudentSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  qrSimLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  qrSimRow: {
    flexDirection: 'row',
    gap: 8,
  },
  qrSimButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrSimButtonText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pinModalCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  pinModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pinModalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  pinModalSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  pinLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pinInputField: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
  },
  pinMessageText: {
    color: '#ef4444',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  pinModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
});
