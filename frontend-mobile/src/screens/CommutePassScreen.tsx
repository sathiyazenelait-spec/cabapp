import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Text, Card, Avatar, Button, Chip } from 'react-native-paper';
import Svg, { Rect, Path, G, Circle } from 'react-native-svg';
import { studentWorkApi } from '../services/api';

export const CommutePassScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [passData, setPassData] = useState<any>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nfcTapped, setNfcTapped] = useState<boolean>(false);

  useEffect(() => {
    loadPassDetails();
  }, []);

  const loadPassDetails = async () => {
    setLoading(true);
    try {
      const [passes, logs] = await Promise.all([
        studentWorkApi.getPasses('arun.kumar@loyola.edu'),
        studentWorkApi.getAttendanceLogs('arun.kumar@loyola.edu'),
      ]);

      if (passes && passes.length > 0) {
        setPassData(passes[0]);
      } else {
        setPassData({
          id: 109,
          userEmail: 'arun.kumar@loyola.edu',
          userName: 'Arun Kumar',
          commuterType: 'STUDENT',
          institutionOrCompany: 'Loyola College, Chennai',
          routeId: 'CH-IT-09',
          pickupPoint: 'Tambaram Sanatorium',
          dropPoint: 'Loyola College Gate 3',
          passType: 'MONTHLY • UNLIMITED',
          amountPaid: 2800.0,
          status: 'ACTIVE',
          validUntil: '2026-10-15',
          vehicleNumber: 'TN 01 AB 1234',
        });
      }
      setAttendanceLogs(logs || []);
    } catch (e) {
      console.log('Using default pass', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateNfcTap = () => {
    setNfcTapped(true);
    Alert.alert(
      'NFC Smart Pass Scanned ✅',
      'Digital Commute Pass verified by Conductor scanner terminal. Boarding logged for today at ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    setTimeout(() => setNfcTapped(false), 3000);
  };

  const handleSharePass = async () => {
    try {
      await Share.share({
        message: `SafePassage Digital Commute Pass\nHolder: Arun Kumar\nPass ID: PASS-${passData?.id || 109}\nRoute: Tambaram ➔ Loyola College\nStatus: ACTIVE`,
      });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Digital Commute Pass
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            Smart QR Token • NFC Boarding • Live Shuttle ETA
          </Text>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleSharePass}>
          <Avatar.Icon size={20} icon="share-variant" color="#10b981" style={{ backgroundColor: 'transparent' }} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Digital Pass Card */}
        <Card style={styles.passCard}>
          {/* Card Top Header */}
          <View style={styles.passHeader}>
            <View>
              <Text style={styles.passOrgName}>SAFEPASSAGE COMMUTER PASS</Text>
              <Text style={styles.passIdText}>ID: PASS-2026-CH-{passData?.id || '109'}</Text>
            </View>
            <Chip style={styles.activeStatusChip} textStyle={{ color: '#10b981', fontWeight: '900', fontSize: 10 }}>
              ● ACTIVE
            </Chip>
          </View>

          {/* Commuter Information */}
          <View style={styles.commuterRow}>
            <Avatar.Text
              size={48}
              label={passData?.userName ? passData.userName.substring(0, 2).toUpperCase() : 'AK'}
              style={{ backgroundColor: '#1e293b' }}
              color="#10b981"
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.commuterName}>{passData?.userName || 'Arun Kumar'}</Text>
              <Text style={styles.commuterInstitution}>{passData?.institutionOrCompany || 'Loyola College, Chennai'}</Text>
              <Text style={styles.commuterPlan}>{passData?.passType || 'MONTHLY • UNLIMITED PASS'}</Text>
            </View>
          </View>

          {/* Route Details */}
          <View style={styles.routeBox}>
            <View style={styles.routePoint}>
              <Text style={styles.routeLabel}>PICKUP STOP</Text>
              <Text style={styles.routeStopName}>📍 {passData?.pickupPoint || 'Tambaram Sanatorium'}</Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routePoint}>
              <Text style={styles.routeLabel}>DROP DESTINATION</Text>
              <Text style={styles.routeStopName}>🏁 {passData?.dropPoint || 'Loyola College Gate 3'}</Text>
            </View>
          </View>

          {/* QR Code SVG Widget */}
          <View style={styles.qrWidgetContainer}>
            <Svg width="140" height="140" viewBox="0 0 140 140">
              <Rect width="140" height="140" fill="#ffffff" rx="12" />
              {/* Corner Targets */}
              <Rect x="14" y="14" width="34" height="34" fill="#070b13" rx="4" />
              <Rect x="20" y="20" width="22" height="22" fill="#ffffff" rx="2" />
              <Rect x="25" y="25" width="12" height="12" fill="#070b13" rx="1" />

              <Rect x="92" y="14" width="34" height="34" fill="#070b13" rx="4" />
              <Rect x="98" y="20" width="22" height="22" fill="#ffffff" rx="2" />
              <Rect x="103" y="25" width="12" height="12" fill="#070b13" rx="1" />

              <Rect x="14" y="92" width="34" height="34" fill="#070b13" rx="4" />
              <Rect x="20" y="98" width="22" height="22" fill="#ffffff" rx="2" />
              <Rect x="25" y="103" width="12" height="12" fill="#070b13" rx="1" />

              {/* Data Pattern Dots */}
              <Rect x="58" y="16" width="10" height="10" fill="#070b13" rx="2" />
              <Rect x="74" y="22" width="8" height="8" fill="#070b13" rx="2" />
              <Rect x="56" y="38" width="12" height="12" fill="#070b13" rx="2" />
              <Rect x="76" y="44" width="10" height="10" fill="#070b13" rx="2" />
              <Rect x="58" y="60" width="24" height="24" fill="#10b981" rx="4" />
              <Rect x="18" y="60" width="12" height="12" fill="#070b13" rx="2" />
              <Rect x="36" y="70" width="10" height="10" fill="#070b13" rx="2" />
              <Rect x="94" y="64" width="12" height="12" fill="#070b13" rx="2" />
              <Rect x="112" y="76" width="14" height="14" fill="#070b13" rx="2" />
              <Rect x="58" y="94" width="12" height="12" fill="#070b13" rx="2" />
              <Rect x="76" y="102" width="10" height="10" fill="#070b13" rx="2" />
              <Rect x="94" y="112" width="16" height="16" fill="#070b13" rx="2" />
              <Rect x="116" y="100" width="10" height="10" fill="#070b13" rx="2" />
            </Svg>
            <Text style={styles.qrHintText}>Scan at shuttle entrance or tap NFC</Text>
          </View>

          {/* Pass Footer Meta */}
          <View style={styles.passFooter}>
            <View>
              <Text style={styles.footerLabel}>ASSIGNED VEHICLE</Text>
              <Text style={styles.footerValue}>{passData?.vehicleNumber || 'TN 01 AB 1234'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.footerLabel}>VALID UNTIL</Text>
              <Text style={[styles.footerValue, { color: '#10b981' }]}>
                {passData?.validUntil ? `Oct 15, 2026` : '30 Days Active'}
              </Text>
            </View>
          </View>
        </Card>

        {/* NFC Tap Simulator Button */}
        <TouchableOpacity
          style={[styles.nfcActionBtn, nfcTapped && styles.nfcActionBtnActive]}
          onPress={handleSimulateNfcTap}
          activeOpacity={0.8}
        >
          <Avatar.Icon size={24} icon="nfc" style={{ backgroundColor: 'transparent' }} color="#070b13" />
          <Text style={styles.nfcActionText}>TAP NFC SCANNER AT SHUTTLE GATE</Text>
        </TouchableOpacity>

        {/* Live Shuttle Tracker Card */}
        <Card style={styles.etaCard}>
          <View style={styles.etaHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.blinkerDot} />
              <Text style={styles.etaTitle}>LIVE SHUTTLE STATUS</Text>
            </View>
            <Text style={styles.etaMinutes}>ETA 8 MINS</Text>
          </View>
          <Text style={styles.etaSub}>Van TN 01 AB 1234 is approaching Tambaram Sanatorium.</Text>
          <View style={styles.driverInfoRow}>
            <Avatar.Icon size={28} icon="steering" style={{ backgroundColor: '#1e293b' }} color="#10b981" />
            <Text style={styles.driverPhoneText}>Driver: Kumar Swamy (+91 98401 23456)</Text>
          </View>
        </Card>

        {/* Recent Attendance Logs */}
        <Text style={styles.logsSectionHeader}>RECENT BOARDING LOGS</Text>
        <View style={styles.logsList}>
          {attendanceLogs.length > 0 ? (
            attendanceLogs.map((log) => (
              <Card key={log.id} style={styles.logCard}>
                <View style={styles.logRow}>
                  <Avatar.Icon size={32} icon="check-decagram" color="#10b981" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.logRoute}>{log.route || 'Tambaram ➔ Loyola'}</Text>
                    <Text style={styles.logTime}>{log.date} • {log.timing || '07:30 AM - 08:15 AM'}</Text>
                  </View>
                  <Chip style={styles.punctualChip} textStyle={{ color: '#10b981', fontSize: 9, fontWeight: 'bold' }}>
                    {log.punctuality || 'On Time'}
                  </Chip>
                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.logCard}>
              <View style={styles.logRow}>
                <Avatar.Icon size={32} icon="check-decagram" color="#10b981" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.logRoute}>Tambaram ➔ Loyola Gate 3</Text>
                  <Text style={styles.logTime}>Today • 07:32 AM Boarded</Text>
                </View>
                <Chip style={styles.punctualChip} textStyle={{ color: '#10b981', fontSize: 9, fontWeight: 'bold' }}>
                  On Time
                </Chip>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
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
  shareBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 6,
    borderRadius: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  passCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    padding: 16,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 10,
  },
  passOrgName: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  passIdText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeStatusChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  commuterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  commuterName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commuterInstitution: {
    color: '#94a3b8',
    fontSize: 12,
  },
  commuterPlan: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  routeBox: {
    backgroundColor: '#131e32',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  routePoint: {},
  routeLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  routeStopName: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  routeDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  qrWidgetContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  qrHintText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 8,
  },
  passFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  footerLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  footerValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  nfcActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 14,
  },
  nfcActionBtnActive: {
    backgroundColor: '#34d399',
  },
  nfcActionText: {
    color: '#070b13',
    fontWeight: '900',
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  etaCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 14,
    marginBottom: 16,
  },
  etaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blinkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
    marginRight: 6,
  },
  etaTitle: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  etaMinutes: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  etaSub: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 6,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  driverPhoneText: {
    color: '#94a3b8',
    fontSize: 11,
    marginLeft: 6,
  },
  logsSectionHeader: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  logsList: {
    gap: 8,
  },
  logCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logRoute: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logTime: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  punctualChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
});
