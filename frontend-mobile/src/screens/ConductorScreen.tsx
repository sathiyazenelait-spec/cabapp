import React from 'react';
import { StyleSheet, View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Avatar, IconButton } from 'react-native-paper';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleStudentStatus, markAllBoarded, setTripStarted, incrementStop, resetStop } from '../store/slices/studentSlice';

export const ConductorScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, tripStarted, activeStopIndex } = useAppSelector(state => state.students);

  const [simLat, setSimLat] = React.useState(12.9815);
  const [simLon, setSimLon] = React.useState(80.2450);

  React.useEffect(() => {
    if (!tripStarted) return;

    const interval = setInterval(() => {
      setSimLat(prevLat => {
        const nextLat = prevLat - 0.0001;
        fetch(`http://localhost:8084/api/driver/location?driverId=d1&latitude=${nextLat}&longitude=${simLon}`, {
          method: 'POST'
        }).catch(() => {});
        return nextLat;
      });
      setSimLon(prevLon => prevLon + 0.0001);
    }, 4000);

    return () => clearInterval(interval);
  }, [tripStarted, simLon]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(err => console.log('Call error', err));
  };

  const getStatusColor = (status: 'pending' | 'boarded' | 'absent') => {
    if (status === 'boarded') return '#10b981';
    if (status === 'absent') return '#ef4444';
    return '#9ca3af';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
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
                    onPress={() => dispatch(toggleStudentStatus(student.id))}
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
                onPress={() => dispatch(setTripStarted(false))}
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
          onPress={() => dispatch(setTripStarted(true))}
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
  }
});
