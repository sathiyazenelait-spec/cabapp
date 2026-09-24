import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Linking, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleStudentStatus, markAllBoarded, setTripStarted, incrementStop, resetStop } from '../store/slices/studentSlice';
import { toggleSOS } from '../store/slices/tripSlice';
import { driverApi, parentApi } from '../services/api';

export const ConductorScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, tripStarted, activeStopIndex } = useAppSelector(state => state.students);
  const { sosTriggered, sosVoiceSmsSent, sosCallConnected } = useAppSelector(state => state.trip);

  const [activeTripId, setActiveTripId] = useState<number | string>(1);
  const [simLat, setSimLat] = useState(12.9815);
  const [simLon, setSimLon] = useState(80.2450);

  useEffect(() => {
    if (!tripStarted) return;

    const interval = setInterval(() => {
      setSimLat(prevLat => {
        const nextLat = prevLat - 0.0001;
        driverApi.updateLocation('d1', nextLat, simLon).catch(() => {});
        return nextLat;
      });
      setSimLon(prevLon => prevLon + 0.0001);
    }, 4000);

    return () => clearInterval(interval);
  }, [tripStarted, simLon]);

  const handleStartTrip = async () => {
    try {
      const resp = await driverApi.startTrip(1, 1, 1);
      if (resp && resp.id) {
        setActiveTripId(resp.id);
      }
    } catch (e) {
      console.log('Trip start demo mode', e);
    }
    dispatch(setTripStarted(true));
  };

  const handleStopTrip = async () => {
    try {
      await driverApi.stopTrip(activeTripId);
    } catch (e) {
      console.log('Trip stop demo mode', e);
    }
    dispatch(setTripStarted(false));
  };

  const handleToggleStudent = async (studentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'BOARDED' : currentStatus === 'boarded' ? 'ABSENT' : 'PENDING';
    dispatch(toggleStudentStatus(studentId));
    try {
      const numericLogId = parseInt(studentId.replace(/\D/g, ''), 10) || 1;
      await driverApi.toggleBoard(numericLogId, nextStatus);
    } catch (e) {
      console.log('Toggle boarding status demo mode', e);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(err => console.log('Call error', err));
  };

  const triggerManualSOS = async () => {
    if (sosTriggered) {
      dispatch(toggleSOS());
      return;
    }

    Alert.alert(
      "Safety SOS Emergency",
      "This will immediately call Emergency Services (108), dispatch live GPS coordinates to dispatch, and trigger police alerts. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "CONFIRM SOS", 
          style: "destructive",
          onPress: async () => {
            dispatch(toggleSOS());
            try {
              await parentApi.triggerSos({
                driverId: 'd1',
                tripId: activeTripId,
                lat: simLat,
                lng: simLon,
                timestamp: Date.now(),
              });
              await parentApi.triggerFcmAlert({
                title: '🚨 CRITICAL SOS: Bus RJ14 CH 4656',
                message: `Emergency SOS triggered near Kasturba Nagar (Stop ${activeStopIndex}). Immediate response initiated.`,
                type: 'SOS',
              });
            } catch (e) {
              console.log('SOS triggered in local/demo mode');
            }
            // Open emergency dialer
            Linking.openURL('tel:108').catch(() => {
              Alert.alert('Calling Emergency', 'Simulating call to 108...');
            });
          }
        }
      ]
    );
  };

  const getStatusColor = (status: 'pending' | 'boarded' | 'absent') => {
    if (status === 'boarded') return '#10b981';
    if (status === 'absent') return '#ef4444';
    return '#9ca3af';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* SOS Header Banner / Trigger Button */}
      <Card style={[styles.sosHeaderCard, sosTriggered && styles.sosTriggeredCard]}>
        <Card.Content style={styles.sosCardContent}>
          <View style={styles.sosMeta}>
            <Text style={styles.sosTitle}>
              {sosTriggered ? "🚨 SOS EMERGENCY BROADCASTING" : "SAFETY SOS TRIGGER"}
            </Text>
            <Text style={styles.sosDesc}>
              {sosTriggered 
                ? "Police and Hospital dispatch alerted. Tap to disarm." 
                : "Immediately call 108 and alert nearest hospital & police."}
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={triggerManualSOS}
            buttonColor={sosTriggered ? "#070b13" : "#ef4444"}
            textColor="#fff"
            style={[styles.sosActionBtn, sosTriggered && styles.sosActionActiveBorder]}
            labelStyle={styles.sosActionBtnLabel}
          >
            {sosTriggered ? "DISARM" : "SOS"}
          </Button>
        </Card.Content>
      </Card>

      {/* active stop details widget (Template 3 screen 1) */}
      <Card style={styles.routeCard}>
        <Card.Content>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>Route: Kasturba Nagar</Text>
            <Text style={styles.stopBadge}>Stop {activeStopIndex} of 4</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>Vehicle Config</Text>
              <Text style={styles.statVal}>Bus No.1 (RJ14 CH 4656)</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>Pickup Registered</Text>
              <Text style={styles.statVal}>16 Students</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Checklist section */}
      <Card style={styles.checklistCard}>
        <Card.Content>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Student Pickup Checklist</Text>
            <TouchableOpacity onPress={() => dispatch(markAllBoarded())}>
              <Text style={styles.pickAllText}>Pick All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.studentList}>
            {students.map(student => (
              <View key={student.id} style={styles.studentRow}>
                <View style={styles.studentMeta}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentGrade}>{student.grade}</Text>
                </View>

                <View style={styles.actions}>
                  <IconButton
                    icon="phone"
                    size={16}
                    iconColor="#9ca3af"
                    style={styles.callBtn}
                    onPress={() => handleCall(student.phone)}
                  />

                  <Button
                    mode="contained-tonal"
                    onPress={() => handleToggleStudent(student.id, student.status)}
                    buttonColor="rgba(255,255,255,0.03)"
                    style={[
                      styles.statusBtn,
                      { borderColor: getStatusColor(student.status) }
                    ]}
                    labelStyle={[
                      styles.statusLabel,
                      { color: getStatusColor(student.status) }
                    ]}
                  >
                    {student.status.toUpperCase()}
                  </Button>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Progress & Control actions */}
      {tripStarted ? (
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text style={styles.progressText}>Trip Progress: Started</Text>
            <Text style={styles.progressDesc}>
              Broadcasting GPS coordinates. Parents will get automated notifications as you toggle status.
            </Text>
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={() => dispatch(incrementStop())}
                style={styles.progressBtn}
                buttonColor="#10b981"
                textColor="#fff"
              >
                Next Stop
              </Button>
              <Button
                mode="outlined"
                onPress={handleStopTrip}
                style={styles.endBtn}
                textColor="#ef4444"
              >
                End Trip
              </Button>
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Button
          mode="contained"
          onPress={handleStartTrip}
          style={styles.startBtn}
          buttonColor="#10b981"
          textColor="#fff"
        >
          Start Active Commute
        </Button>
      )}

      {/* Reset logs tool */}
      <Button
        mode="text"
        onPress={() => dispatch(resetStop())}
        style={styles.resetBtn}
        textColor="#6b7280"
      >
        Reset Checklist Logs
      </Button>

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
  },
  routeCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginBottom: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  stopBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: '#9ca3af',
    fontSize: 9,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCell: {
    flex: 1,
  },
  statLabel: {
    fontSize: 8,
    color: '#9ca3af',
  },
  statVal: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginBottom: 16,
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickAllText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  studentList: {
    gap: 8,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  studentMeta: {
    flex: 1,
  },
  studentName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  studentGrade: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callBtn: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    margin: 0,
  },
  statusBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressDesc: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 4,
    lineHeight: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  progressBtn: {
    flex: 1,
    borderRadius: 8,
  },
  endBtn: {
    flex: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
  },
  startBtn: {
    borderRadius: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  resetBtn: {
    marginTop: 8,
  },
  sosHeaderCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginBottom: 16,
  },
  sosTriggeredCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444',
  },
  sosCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  sosMeta: {
    flex: 1,
    marginRight: 12,
  },
  sosTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ef4444',
    letterSpacing: 0.5,
  },
  sosDesc: {
    fontSize: 8.5,
    color: '#9ca3af',
    marginTop: 2,
    lineHeight: 12,
  },
  sosActionBtn: {
    borderRadius: 8,
    paddingVertical: 0,
    minWidth: 70,
  },
  sosActionActiveBorder: {
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  sosActionBtnLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginHorizontal: 0,
  },
});
