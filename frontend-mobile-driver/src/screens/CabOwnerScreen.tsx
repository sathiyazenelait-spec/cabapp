import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Alert } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, Chip, Divider, ProgressBar } from 'react-native-paper';

import { cabOwnerApi, API_BASE } from '../services/api';

interface FleetVehicle {
  id: string;
  regNumber: string;
  type: string;
  capacity: number;
  driverName: string;
  status: 'on_duty' | 'idle' | 'maintenance';
  seatsFilled: number;
}

interface EarningLog {
  id: string;
  period: string;
  grossEarnings: number;
  commission: number;
  netPayout: number;
  status: 'paid' | 'pending';
}

export const CabOwnerScreen: React.FC = () => {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    { id: 'v1', regNumber: 'TN 01 AB 1234', type: 'VAN', capacity: 12, driverName: 'Ravi Kumar', status: 'on_duty', seatsFilled: 10 },
    { id: 'v2', regNumber: 'TN 02 CD 5678', type: 'SUV', capacity: 7, driverName: 'Suresh Raina', status: 'idle', seatsFilled: 0 },
    { id: 'v3', regNumber: 'TN 03 EF 9012', type: 'BUS', capacity: 40, driverName: 'Amit Singh', status: 'maintenance', seatsFilled: 0 },
  ]);

  const [earnings, setEarnings] = useState<EarningLog[]>([
    { id: 'e1', period: 'Aug 17 - Aug 23, 2026', grossEarnings: 15400, commission: 1540, netPayout: 13860, status: 'paid' },
    { id: 'e2', period: 'Aug 10 - Aug 16, 2026', grossEarnings: 18200, commission: 1820, netPayout: 16380, status: 'paid' },
    { id: 'e3', period: 'Aug 03 - Aug 09, 2026', grossEarnings: 12500, commission: 1250, netPayout: 11250, status: 'pending' },
  ]);

  React.useEffect(() => {
    cabOwnerApi.getFleet().then(fleetData => {
      if (Array.isArray(fleetData) && fleetData.length > 0) {
        const mapped: FleetVehicle[] = fleetData.map((item: any) => ({
          id: String(item.id || item.regNumber),
          regNumber: item.regNumber || 'TN-XX-0000',
          type: item.vehicleType || 'VAN',
          capacity: item.capacity || 7,
          driverName: item.driverName || 'Kumar',
          status: (item.status?.toLowerCase() as any) || 'on_duty',
          seatsFilled: item.seatsFilled || 5,
        }));
        setVehicles(mapped);
      }
    }).catch(() => {});

    cabOwnerApi.getEarnings().then(earnData => {
      if (Array.isArray(earnData) && earnData.length > 0) {
        setEarnings(earnData as any);
      }
    }).catch(() => {});
  }, []);

  const getStatusColor = (status: FleetVehicle['status']) => {
    if (status === 'on_duty') return '#10b981';
    if (status === 'idle') return '#3b82f6';
    return '#f59e0b';
  };

  const getStatusLabel = (status: FleetVehicle['status']) => {
    if (status === 'on_duty') return 'On Duty';
    if (status === 'idle') return 'Idle';
    return 'Maintenance';
  };

  const handleRegisterCab = () => {
    Alert.alert(
      "Simulate Document Upload (S3 / Backend)",
      "Select a cab registration document to upload via camera/scanner roll:",
      [
        {
          text: "Swift Dzire RC (TN 01 AB 1234)",
          onPress: () => performRegistration("TN 01 AB 1234", "SEDAN", 4, "rc_swift.pdf")
        },
        {
          text: "Traveller Van RC (TN 14 TN 7899)",
          onPress: () => performRegistration("TN 14 TN 7899", "VAN", 12, "rc_traveller.pdf")
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const performRegistration = (regNo: string, type: string, cap: number, filename: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      name: filename,
      type: "application/pdf"
    } as any);

    fetch(`${API_BASE.PARENT}/api/parent/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(res => res.json())
      .then(data => {
        const uploadedUrl = data.url || `${API_BASE.PARENT}/api/parent/files/dummy.pdf`;
        
        const payload = {
          regNumber: regNo,
          vehicleType: type,
          capacity: cap,
          rc: uploadedUrl,
          insurance: uploadedUrl,
          permit: uploadedUrl,
          verificationStatus: "PENDING"
        };

        fetch(`${API_BASE.CAB_OWNER}/api/fleet/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(savedVehicle => {
            const newVehicle: FleetVehicle = {
              id: savedVehicle.id ? String(savedVehicle.id) : Date.now().toString(),
              regNumber: savedVehicle.regNumber,
              type: savedVehicle.vehicleType || type,
              capacity: savedVehicle.capacity || cap,
              driverName: "Unassigned",
              status: "idle",
              seatsFilled: 0
            };
            setVehicles(prev => [...prev, newVehicle]);
            Alert.alert("Success", `KYC documents verified and uploaded. Cab registration submitted! Status: PENDING.`);
          })
          .catch(() => {
            const localVehicle: FleetVehicle = {
              id: Date.now().toString(),
              regNumber: regNo,
              type: type,
              capacity: cap,
              driverName: "Unassigned",
              status: "idle",
              seatsFilled: 0
            };
            setVehicles(prev => [...prev, localVehicle]);
            Alert.alert("Demo Success", `Documents uploaded locally. New vehicle added.`);
          });
      })
      .catch(() => {
        Alert.alert("Demo Mode Success", "Simulated document KYC upload complete.");
      });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Avatar.Text size={48} label="KO" style={styles.avatar} color="#fff" />
          <View style={styles.profileText}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.ownerName}>Kumar Cab Owners Ltd.</Text>
          </View>
          <IconButton icon="bell-ring-outline" iconColor="#38bdf8" size={24} onPress={() => {}} />
        </View>
      </View>

      {/* Fleet Stats Summary */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Fleet Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>Vehicles</Text>
              <Text style={styles.statValue}>3 Cabs</Text>
            </View>
            <Divider style={styles.verticalDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>Active Drivers</Text>
              <Text style={styles.statValue}>3 Assigned</Text>
            </View>
            <Divider style={styles.verticalDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statLabel}>Weekly Gross</Text>
              <Text style={[styles.statValue, { color: '#10b981' }]}>₹46,100</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Fleet Management List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fleet Vehicles</Text>
        <Button mode="text" compact onPress={handleRegisterCab} textColor="#38bdf8">
          + Add Cab
        </Button>
      </View>

      {vehicles.map(vehicle => (
        <Card key={vehicle.id} style={styles.vehicleCard}>
          <Card.Content>
            <View style={styles.vehicleRow}>
              <View>
                <Text style={styles.regNo}>{vehicle.regNumber}</Text>
                <Text style={styles.vehicleSub}>
                  {vehicle.type} • {vehicle.capacity} Seats • Driver: {vehicle.driverName}
                </Text>
              </View>
              <Chip 
                style={[styles.statusChip, { backgroundColor: getStatusColor(vehicle.status) + '15' }]}
                textStyle={{ color: getStatusColor(vehicle.status), fontSize: 10, fontWeight: 'bold' }}
                compact
              >
                {getStatusLabel(vehicle.status)}
              </Chip>
            </View>

            {vehicle.status === 'on_duty' && (
              <View style={styles.seatProgress}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressText}>Occupancy Ratio</Text>
                  <Text style={styles.progressText}>
                    {vehicle.seatsFilled}/{vehicle.capacity} Seats Filled
                  </Text>
                </View>
                <ProgressBar 
                  progress={vehicle.seatsFilled / vehicle.capacity} 
                  color="#10b981" 
                  style={styles.progressBar}
                />
              </View>
            )}
          </Card.Content>
        </Card>
      ))}

      {/* KYC / Compliance Alerts */}
      <Card style={styles.complianceCard}>
        <Card.Content>
          <View style={styles.complianceHeader}>
            <Avatar.Icon size={32} icon="shield-alert-outline" color="#f59e0b" style={{ backgroundColor: 'transparent' }} />
            <Text style={styles.complianceTitle}>KYC & Document Status</Text>
          </View>
          <Text style={styles.complianceDesc}>
            Your vehicles require continuous document renewals. Please upload missing Pollution & Fitness Certificates to prevent driver locks.
          </Text>
          <View style={styles.docGrid}>
            <View style={styles.docRow}>
              <Text style={styles.docName}>TN 01 AB 1234: Insurance Renewal</Text>
              <Chip style={styles.verifiedChip} textStyle={styles.verifiedText}>Verified</Chip>
            </View>
            <View style={styles.docRow}>
              <Text style={styles.docName}>TN 03 EF 9012: Pollution Certificate</Text>
              <Chip style={styles.pendingChip} textStyle={styles.pendingText}>Pending</Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Earnings Dashboard Log */}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Weekly Revenue Logs</Text>
      {earnings.map(earn => (
        <Card key={earn.id} style={styles.earningCard}>
          <Card.Content>
            <View style={styles.earningHeader}>
              <Text style={styles.earningPeriod}>{earn.period}</Text>
              <Chip 
                style={[styles.statusChip, { backgroundColor: earn.status === 'paid' ? '#10b98115' : '#f59e0b15' }]}
                textStyle={{ color: earn.status === 'paid' ? '#10b981' : '#f59e0b', fontSize: 9, fontWeight: 'bold' }}
                compact
              >
                {earn.status.toUpperCase()}
              </Chip>
            </View>
            <View style={styles.earningDetailRow}>
              <View style={styles.earnDetailCell}>
                <Text style={styles.earnDetailLabel}>Gross Revenue</Text>
                <Text style={styles.earnDetailVal}>₹{earn.grossEarnings}</Text>
              </View>
              <View style={styles.earnDetailCell}>
                <Text style={styles.earnDetailLabel}>Platform Fee (10%)</Text>
                <Text style={[styles.earnDetailVal, { color: '#ef4444' }]}>-₹{earn.commission}</Text>
              </View>
              <View style={styles.earnDetailCell}>
                <Text style={styles.earnDetailLabel}>Net Payout</Text>
                <Text style={[styles.earnDetailVal, { color: '#10b981', fontWeight: 'bold' }]}>₹{earn.netPayout}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}

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
  },
  header: {
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#38bdf8',
  },
  profileText: {
    flex: 1,
    marginLeft: 12,
  },
  welcomeText: {
    color: '#6b7280',
    fontSize: 11,
  },
  ownerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  statCell: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 10,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  vehicleCard: {
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  regNo: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  vehicleSub: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  statusChip: {
    borderRadius: 4,
  },
  seatProgress: {
    marginTop: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  complianceCard: {
    backgroundColor: '#1e293b30',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b30',
    marginTop: 16,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: -8,
  },
  complianceTitle: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  complianceDesc: {
    color: '#9ca3af',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  docGrid: {
    gap: 8,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 4,
  },
  docName: {
    color: '#e5e7eb',
    fontSize: 10,
  },
  verifiedChip: {
    backgroundColor: '#10b98115',
    borderRadius: 4,
    height: 22,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 8,
    fontWeight: 'bold',
  },
  pendingChip: {
    backgroundColor: '#f59e0b15',
    borderRadius: 4,
    height: 22,
  },
  pendingText: {
    color: '#f59e0b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  earningCard: {
    backgroundColor: '#111827',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  earningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningPeriod: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: '600',
  },
  earningDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earnDetailCell: {
    flex: 1,
  },
  earnDetailLabel: {
    color: '#9ca3af',
    fontSize: 9,
    marginBottom: 2,
  },
  earnDetailVal: {
    color: '#fff',
    fontSize: 11,
  },
});
