import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { parentApi } from '../services/api';

export const JourneyTimelineScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [timeline, setTimeline] = useState<any[]>([
    { id: 1, time: '7:32 AM', status: 'Picked Up', location: 'Kattur Home Spot', completed: true },
    { id: 2, time: '7:45 AM', status: 'On Route', location: 'Passing Lawspet Junction', completed: true },
    { id: 3, time: '8:10 AM', status: 'Reached School', location: 'Green Valley School Main Gate', completed: false },
  ]);

  useEffect(() => {
    parentApi.getTripTimeline().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setTimeline(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Map Mini Banner */}
      <TouchableOpacity
        onPress={() => navigation.navigate('LiveTrack')}
        style={styles.mapBanner}
      >
        <Avatar.Icon size={32} icon="navigation-variant" style={{ backgroundColor: '#3B49DF' }} color="#fff" />
        <Text style={styles.mapBannerText}>Live Map Active • Tap to view real-time location</Text>
      </TouchableOpacity>

      {/* Timeline Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.timelineTitle}>Journey Timeline</Text>

          <View style={styles.stepper}>
            {timeline.map((step, idx) => {
              const isCompleted = step.completed;
              const isCurrent = !isCompleted && (idx === 0 || timeline[idx - 1]?.completed);
              const nodeBg = isCompleted ? '#10b981' : isCurrent ? '#3B49DF' : '#374151';
              const titleColor = isCompleted ? '#10b981' : isCurrent ? '#38bdf8' : '#9ca3af';
              const icon = isCompleted ? '✓' : isCurrent ? '●' : '⏳';

              return (
                <React.Fragment key={step.id || idx}>
                  <View style={styles.stepItem}>
                    <View style={[styles.stepNode, { backgroundColor: nodeBg }]}>
                      <Text style={styles.stepCheck}>{icon}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: titleColor }]}>
                        {step.time} • {step.status}
                      </Text>
                      <Text style={styles.stepLocation}>{step.location}</Text>
                    </View>
                  </View>
                  {idx < timeline.length - 1 && <View style={styles.stepLine} />}
                </React.Fragment>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* Call Driver Primary Button */}
      <Button
        mode="contained"
        onPress={() => {
          Linking.openURL('tel:+919840123456').catch(() => {
            Alert.alert('Call Driver', 'Dialing driver Kumar at +91 98401 23456');
          });
        }}
        buttonColor="#3B49DF"
        textColor="#fff"
        icon="phone"
        style={styles.callBtn}
        labelStyle={{ fontWeight: 'bold', fontSize: 13 }}
      >
        Call Driver
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
  mapBanner: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#3B49DF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  mapBannerText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  card: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  timelineTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepper: {
    paddingLeft: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCheck: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  stepLocation: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  stepLine: {
    width: 2,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 11,
    marginVertical: 4,
  },
  callBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
