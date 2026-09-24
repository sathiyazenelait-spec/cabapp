import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';

interface ServiceInfoProps {
  date: string;
  plate: string;
  statusText: string;
  onLiveTrackPress: () => void;
  onBoardingSpotPress: () => void;
}

export const ServiceInfo: React.FC<ServiceInfoProps> = ({
  date,
  plate,
  statusText,
  onLiveTrackPress,
  onBoardingSpotPress
}) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title}>Servis Bilgileri</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <View style={styles.alertBox}>
          <Avatar.Icon size={32} icon="check" style={styles.avatarIcon} color="#fff" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>{statusText}</Text>
            <Text style={styles.alertDesc}>
              Öğrenciniz saat 13:40'da servis aracına bindi. Konumu haritadan takip edebilirsiniz.
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>ALINIŞ SAATİ</Text>
            <Text style={styles.statVal}>07:45</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>YOLCULUK SÜRESİ</Text>
            <Text style={styles.statVal}>38 dk</Text>
          </View>
        </View>

        <View style={styles.vehicleRow}>
          <Avatar.Icon size={36} icon="van-passenger" style={styles.vanIcon} color="#fff" />
          <View style={styles.plateCell}>
            <Text style={styles.plateLabel}>ARAÇ PLAKASI</Text>
            <Text style={styles.plateVal}>{plate}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button 
            mode="outlined" 
            onPress={onBoardingSpotPress} 
            style={styles.btnOutlined}
            labelStyle={styles.btnLabel}
          >
            BİNİŞ ADRESİ
          </Button>
          <Button 
            mode="contained" 
            onPress={onLiveTrackPress} 
            style={styles.btnContained}
            labelStyle={styles.btnLabelContained}
          >
            CANLI İZLE
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    color: '#38bdf8',
    fontWeight: '800',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
    padding: 10,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarIcon: {
    backgroundColor: '#10b981',
    marginRight: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e5e7eb',
  },
  alertDesc: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 14,
  },
  vanIcon: {
    backgroundColor: '#38bdf8',
    marginRight: 10,
  },
  plateCell: {
    flex: 1,
  },
  plateLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  plateVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  btnOutlined: {
    flex: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  btnContained: {
    flex: 1,
    backgroundColor: '#38bdf8',
    borderRadius: 8,
  },
  btnLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#d1d5db',
  },
  btnLabelContained: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  }
});
