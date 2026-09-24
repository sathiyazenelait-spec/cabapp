import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

interface TimelineItem {
  time: string;
  status: string;
  desc: string;
  done: boolean;
  highlight?: boolean;
}

interface JourneyPassportProps {
  childName: string;
  schoolName: string;
  grade: string;
  timeline: TimelineItem[];
}

export const JourneyPassport: React.FC<JourneyPassportProps> = ({
  childName,
  schoolName,
  grade,
  timeline
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.childHeader}>
        <View style={styles.avatarRow}>
          <Avatar.Text 
            size={40} 
            label={childName.split(' ').map(n => n.charAt(0)).join('')} 
            style={styles.avatar} 
          />
          <View style={styles.childMeta}>
            <Text style={styles.childName}>{childName}</Text>
            <Text style={styles.schoolInfo}>{schoolName} • {grade}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>On The Way</Text>
        </View>
      </View>

      <View style={styles.timelineBox}>
        {timeline.map((item, idx) => (
          <View key={idx} style={styles.timelineRow}>
            {/* vertical line segment */}
            {idx < timeline.length - 1 && <View style={styles.vertLine} />}
            
            {/* dot symbol indicator */}
            <View style={[
              styles.dot, 
              item.done 
                ? item.highlight ? styles.dotHighlight : styles.dotActive 
                : styles.dotInactive
            ]}>
              {item.done && <Avatar.Icon size={10} icon="check" style={styles.checkIcon} color="#fff" />}
            </View>

            <View style={styles.content}>
              <Text style={[styles.statusText, item.highlight && styles.textHighlight]}>
                {item.status}
              </Text>
              <Text style={styles.descText}>{item.desc}</Text>
            </View>

            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        ))}
      </View>

      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Today's Push Alerts Log</Text>
        
        <View style={styles.logItem}>
          <View style={[styles.logIndicator, { backgroundColor: '#10b981' }]} />
          <View style={styles.logMeta}>
            <Text style={styles.logItemTitle}>Pickup Alert (07:30 AM)</Text>
            <Text style={styles.logItemDesc}>{childName} has been picked up from pickup station.</Text>
          </View>
        </View>

        <View style={styles.logItem}>
          <View style={[styles.logIndicator, { backgroundColor: '#38bdf8' }]} />
          <View style={styles.logMeta}>
            <Text style={styles.logItemTitle}>On The Way Alert (07:32 AM)</Text>
            <Text style={styles.logItemDesc}>{childName} is on the way to {schoolName}.</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 14,
    marginVertical: 8,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 12,
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6366f1',
    marginRight: 10,
  },
  childMeta: {
    justifyContent: 'center',
  },
  childName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  schoolInfo: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  badgeText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  timelineBox: {
    paddingLeft: 12,
    position: 'relative',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
    paddingLeft: 16,
  },
  vertLine: {
    position: 'absolute',
    left: 4.5,
    top: 14,
    bottom: -18,
    width: 1,
    backgroundColor: '#374151',
  },
  dot: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    zIndex: 10,
  },
  dotActive: {
    backgroundColor: '#38bdf8',
  },
  dotHighlight: {
    backgroundColor: '#10b981',
  },
  dotInactive: {
    backgroundColor: '#374151',
  },
  checkIcon: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  textHighlight: {
    color: '#10b981',
  },
  descText: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  timeText: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
  },
  logBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  logTitle: {
    fontSize: 9,
    color: '#9ca3af',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginVertical: 3,
  },
  logIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  logMeta: {
    flex: 1,
  },
  logItemTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#e5e7eb',
  },
  logItemDesc: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 1,
  }
});
