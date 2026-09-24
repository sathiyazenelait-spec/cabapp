import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { JourneyPassport } from '../components/JourneyPassport';
import { parentApi } from '../services/api';

export const PassportScreen: React.FC = () => {
  const [timeline, setTimeline] = useState<any[]>([
    { time: '07:30 AM', status: 'Vehicle started', desc: 'Driver Kumar started trip from depot', done: true },
    { time: '07:42 AM', status: 'Reached pickup point', desc: 'Cab reached Mehta Nagar Anna Arch Gate', done: true },
    { time: '07:45 AM', status: 'Child boarded safely', desc: 'Ananya Sharma boarded. Attendance verified.', done: true, highlight: true },
    { time: '07:55 AM', status: 'On the way', desc: 'Current speed: 38 km/h. Route match: 98%', done: true },
    { time: '08:02 AM', status: 'School reached', desc: 'Dropped successfully at ABC Matriculation School', done: false }
  ]);

  useEffect(() => {
    parentApi.getTripTimeline('1')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((t: any) => ({
            time: t.time || '07:30 AM',
            status: t.status || 'On Route',
            desc: t.location ? `Location at ${t.location}` : 'Live route tracking active',
            done: t.completed !== undefined ? t.completed : true,
            highlight: t.status === 'Picked Up' || t.status === 'Child boarded safely'
          }));
          setTimeline(mapped);
        }
      })
      .catch(() => console.log('Using default timeline.'));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <JourneyPassport
        childName="Ananya Sharma"
        schoolName="ABC Matriculation School"
        grade="Grade 5-A"
        timeline={timeline}
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
