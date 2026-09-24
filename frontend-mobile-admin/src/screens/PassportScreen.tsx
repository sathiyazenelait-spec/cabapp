import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { JourneyPassport } from '../components/JourneyPassport';

export const PassportScreen: React.FC = () => {
  const mockTimeline = [
    { time: '07:30 AM', status: 'Vehicle started', desc: 'Driver Kumar started trip from depot', done: true },
    { time: '07:42 AM', status: 'Reached pickup point', desc: 'Cab reached Mehta Nagar Anna Arch Gate', done: true },
    { time: '07:45 AM', status: 'Child boarded safely', desc: 'Ananya Sharma boarded. Attendance verified.', done: true, highlight: true },
    { time: '07:55 AM', status: 'On the way', desc: 'Current speed: 38 km/h. Route match: 98%', done: true },
    { time: '08:02 AM', status: 'School reached', desc: 'Dropped successfully at ABC Matriculation School', done: false }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <JourneyPassport
        childName="Ananya Sharma"
        schoolName="ABC Matriculation School"
        grade="Grade 5-A"
        timeline={mockTimeline}
      />
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
  }
});
