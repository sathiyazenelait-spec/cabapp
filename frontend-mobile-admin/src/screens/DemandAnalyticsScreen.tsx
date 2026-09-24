import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Text, Card, Avatar, Button, IconButton, ProgressBar, Chip } from 'react-native-paper';
import Svg, { Circle, Path, G, Rect, Text as SvgText } from 'react-native-svg';
import { adminApi } from '../services/api';

const { width } = Dimensions.get('window');

interface KycItem {
  id: number;
  driverName: string;
  phone: string;
  email: string;
  vehiclePlate: string;
  licenseNumber: string;
  licenseExpiry: string;
  rcNumber: string;
  insurancePolicy: string;
  backgroundCheckStatus: 'POLICE_VERIFIED' | 'PENDING_AUDIT' | 'REJECTED';
  backgroundCheckDoc: string;
  status: 'VERIFIED' | 'PENDING_AUDIT' | 'REJECTED';
  submittedAt: string;
  auditedBy: string | null;
  remarks: string;
}

interface CorridorCluster {
  id: string;
  name: string;
  densityLevel: 'CRITICAL_HIGH' | 'HIGH' | 'BALANCED';
  densityColor: string;
  commutersCount: number;
  activeCabs: number;
  seatDeficit: number;
  lat: number;
  lng: number;
}

interface FleetMarker {
  cabId: string;
  plate: string;
  driverName: string;
  driverPhone: string;
  speedKmh: number;
  route: string;
  occupancy: string;
  status: string;
  lat: number;
  lng: number;
}

export const DemandAnalyticsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HEATMAP' | 'KYC_QUEUE'>('OVERVIEW');
  const [demandData, setDemandData] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<{ corridorClusters: CorridorCluster[]; fleetMarkers: FleetMarker[]; activeFleetCount: number; totalCommutersMonitored: number } | null>(null);
  const [kycQueue, setKycQueue] = useState<KycItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected KYC Driver for Document Audit Modal
  const [selectedKycDriver, setSelectedKycDriver] = useState<KycItem | null>(null);
  const [auditModalVisible, setAuditModalVisible] = useState<boolean>(false);
  const [selectedCluster, setSelectedCluster] = useState<CorridorCluster | null>(null);

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, heatmapRes, kycRes] = await Promise.all([
        adminApi.getDemandOverview(),
        adminApi.getTransitHeatmap(),
        adminApi.getDriverKycQueue(),
      ]);

      setDemandData(overviewRes);
      setHeatmapData(heatmapRes);
      setKycQueue(kycRes || []);
    } catch (e) {
      console.log('Error loading admin analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateKycStatus = async (driverId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminApi.updateDriverKycStatus(driverId, status, `Audited by Super Admin Compliance Desk on ${new Date().toLocaleDateString()}`);
      setKycQueue((prev) =>
        prev.map((item) =>
          item.id === driverId
            ? {
                ...item,
                status: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED',
                backgroundCheckStatus: status === 'APPROVED' ? 'POLICE_VERIFIED' : 'REJECTED',
                auditedBy: 'SuperAdmin Compliance Desk',
              }
            : item
        )
      );
      setAuditModalVisible(false);
      Alert.alert(
        status === 'APPROVED' ? 'KYC Approved ✅' : 'KYC Rejected ⚠️',
        status === 'APPROVED'
          ? 'Driver license, vehicle RC, and police background clearance approved. Driver is now active in fleet rotation.'
          : 'Driver application flagged. Notification sent to driver to re-upload documents.'
      );
    } catch (e) {
      Alert.alert('Update Failed', 'Could not update KYC status.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Super Admin Command Center
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            Transit Demand • Metropolitan Heatmap • Driver KYC Audit
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadAllAdminData}>
          <Avatar.Icon size={20} icon="refresh" style={{ backgroundColor: 'transparent' }} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Navigation Segment Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'OVERVIEW' && styles.tabBtnActive]}
          onPress={() => setActiveTab('OVERVIEW')}
        >
          <Avatar.Icon size={18} icon="chart-donut" color={activeTab === 'OVERVIEW' ? '#070b13' : '#94a3b8'} style={{ backgroundColor: 'transparent' }} />
          <Text style={[styles.tabBtnText, activeTab === 'OVERVIEW' && styles.tabBtnTextActive]}>
            Demand (1,248)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'HEATMAP' && styles.tabBtnActive]}
          onPress={() => setActiveTab('HEATMAP')}
        >
          <Avatar.Icon size={18} icon="map-marker-radius" color={activeTab === 'HEATMAP' ? '#070b13' : '#94a3b8'} style={{ backgroundColor: 'transparent' }} />
          <Text style={[styles.tabBtnText, activeTab === 'HEATMAP' && styles.tabBtnTextActive]}>
            Transit Heatmap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'KYC_QUEUE' && styles.tabBtnActive]}
          onPress={() => setActiveTab('KYC_QUEUE')}
        >
          <Avatar.Icon size={18} icon="shield-check" color={activeTab === 'KYC_QUEUE' ? '#070b13' : '#94a3b8'} style={{ backgroundColor: 'transparent' }} />
          <Text style={[styles.tabBtnText, activeTab === 'KYC_QUEUE' && styles.tabBtnTextActive]}>
            KYC Queue ({kycQueue.filter((k) => k.status === 'PENDING_AUDIT').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ============================================================== */}
        {/* TAB 1: DEMAND ANALYTICS & CAPACITY HEATMAP                      */}
        {/* ============================================================== */}
        {activeTab === 'OVERVIEW' && (
          <View>
            {/* KPI Cards Grid */}
            <View style={styles.kpiGrid}>
              <Card style={[styles.kpiCard, { borderColor: 'rgba(59, 130, 246, 0.4)' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>TRANSIT DEMAND</Text>
                  <Avatar.Icon size={24} icon="account-group" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }} color="#3b82f6" />
                </View>
                <Text style={styles.kpiValue}>{demandData?.totalDemand?.toLocaleString() || '1,248'}</Text>
                <Text style={[styles.kpiTrend, { color: '#10b981' }]}>+12% vs last week</Text>
              </Card>

              <Card style={[styles.kpiCard, { borderColor: 'rgba(16, 185, 129, 0.4)' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>SEAT CAPACITY</Text>
                  <Avatar.Icon size={24} icon="car-seat" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }} color="#10b981" />
                </View>
                <Text style={styles.kpiValue}>{demandData?.availableSeats?.toLocaleString() || '892'}</Text>
                <Text style={[styles.kpiTrend, { color: '#f59e0b' }]}>-8% capacity cushion</Text>
              </Card>
            </View>

            <View style={[styles.kpiGrid, { marginTop: 10 }]}>
              <Card style={[styles.kpiCard, { borderColor: 'rgba(99, 102, 241, 0.4)' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>ACTIVE ROUTES</Text>
                  <Avatar.Icon size={24} icon="routes" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }} color="#6366f1" />
                </View>
                <Text style={styles.kpiValue}>{demandData?.activeRoutes || '86'}</Text>
                <Text style={[styles.kpiTrend, { color: '#10b981' }]}>+6% new corridors</Text>
              </Card>

              <Card style={[styles.kpiCard, { borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
                <View style={styles.kpiHeader}>
                  <Text style={styles.kpiLabel}>AVG FILL RATE</Text>
                  <Avatar.Icon size={24} icon="percent" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }} color="#f59e0b" />
                </View>
                <Text style={styles.kpiValue}>{demandData?.avgFillRate || 71}%</Text>
                <Text style={[styles.kpiTrend, { color: '#10b981' }]}>+14% load efficiency</Text>
              </Card>
            </View>

            {/* Category Split Chart Card (School 32%, College 28%, Corporate 40%) */}
            <Card style={styles.chartCard}>
              <View style={styles.chartCardHeader}>
                <View>
                  <Text style={styles.chartTitle}>Commuter Segment Breakdown</Text>
                  <Text style={styles.chartSubtitle}>Demand distribution across institutions</Text>
                </View>
                <Chip icon="check-decagram" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} textStyle={{ color: '#10b981', fontSize: 10 }}>
                  Live Telemetry
                </Chip>
              </View>

              {/* SVG Donut Visual */}
              <View style={styles.donutContainer}>
                <Svg width="140" height="140" viewBox="0 0 140 140">
                  {/* Corporate/Work Segment (40%) */}
                  <Circle
                    cx="70"
                    cy="70"
                    r="52"
                    stroke="#10b981"
                    strokeWidth="18"
                    strokeDasharray={`${(40 / 100) * 326.7} 326.7`}
                    strokeDashoffset="0"
                    fill="transparent"
                  />
                  {/* School Segment (32%) */}
                  <Circle
                    cx="70"
                    cy="70"
                    r="52"
                    stroke="#3b82f6"
                    strokeWidth="18"
                    strokeDasharray={`${(32 / 100) * 326.7} 326.7`}
                    strokeDashoffset={`${-((40 / 100) * 326.7)}`}
                    fill="transparent"
                  />
                  {/* College Segment (28%) */}
                  <Circle
                    cx="70"
                    cy="70"
                    r="52"
                    stroke="#6366f1"
                    strokeWidth="18"
                    strokeDasharray={`${(28 / 100) * 326.7} 326.7`}
                    strokeDashoffset={`${-(((40 + 32) / 100) * 326.7)}`}
                    fill="transparent"
                  />
                  <SvgText x="70" y="66" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">
                    1,248
                  </SvgText>
                  <SvgText x="70" y="82" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">
                    PASSENGERS
                  </SvgText>
                </Svg>

                {/* Legend Breakdown */}
                <View style={styles.legendColumn}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.legendName}>Corporate / Work</Text>
                      <Text style={styles.legendDetails}>500 commuters</Text>
                    </View>
                    <Text style={[styles.legendPct, { color: '#10b981' }]}>40%</Text>
                  </View>

                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.legendName}>School Transport</Text>
                      <Text style={styles.legendDetails}>399 students</Text>
                    </View>
                    <Text style={[styles.legendPct, { color: '#3b82f6' }]}>32%</Text>
                  </View>

                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.legendName}>College Students</Text>
                      <Text style={styles.legendDetails}>349 scholars</Text>
                    </View>
                    <Text style={[styles.legendPct, { color: '#6366f1' }]}>28%</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Top Demand Corridors Table */}
            <Text style={styles.sectionHeader}>TOP HIGH-DEMAND CORRIDORS</Text>
            <View style={styles.corridorsList}>
              {demandData?.topDemandRoutes?.map((route: any) => (
                <Card key={route.id} style={styles.corridorCard}>
                  <View style={styles.corridorHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.corridorRouteName}>
                        {route.origin} ➔ {route.destination}
                      </Text>
                      <Text style={styles.corridorDemandText}>
                        👥 {route.demandCount} commuters awaiting seats
                      </Text>
                    </View>
                    <View style={styles.fillRatePill}>
                      <Text style={styles.fillRateValue}>{route.fillRate}%</Text>
                      <Text style={styles.fillRateLabel}>Fill Rate</Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <ProgressBar
                      progress={route.fillRate / 100}
                      color={route.fillRate > 80 ? '#ef4444' : '#10b981'}
                      style={{ height: 6, borderRadius: 3, backgroundColor: '#1e293b' }}
                    />
                  </View>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 2: METROPOLITAN TRANSIT HEATMAP & FLEET GPS               */}
        {/* ============================================================== */}
        {activeTab === 'HEATMAP' && (
          <View>
            {/* Heatmap Visual Canvas */}
            <Card style={styles.mapCard}>
              <View style={styles.mapCardHeader}>
                <View>
                  <Text style={styles.mapTitle}>Metropolitan Transit Density Map</Text>
                  <Text style={styles.mapSubtitle}>Real-time corridor load & GPS fleet markers</Text>
                </View>
                <View style={styles.fleetBadge}>
                  <View style={styles.liveBlinker} />
                  <Text style={styles.fleetBadgeText}>86 Active Cabs</Text>
                </View>
              </View>

              {/* Simulated Visual Metropolitan Radar & Corridors */}
              <View style={styles.mapCanvas}>
                {/* Simulated Radar Grid Lines */}
                <Svg width="100%" height="220" viewBox="0 0 320 220">
                  <Rect width="320" height="220" fill="#070b13" rx="12" />
                  {/* Grid Lines */}
                  <Path d="M 0 55 L 320 55 M 0 110 L 320 110 M 0 165 L 320 165" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <Path d="M 80 0 L 80 220 M 160 0 L 160 220 M 240 0 L 240 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                  {/* Hotspot 1: OMR Corridor (Red Critical) */}
                  <Circle cx="240" cy="140" r="36" fill="rgba(239, 68, 68, 0.25)" />
                  <Circle cx="240" cy="140" r="14" fill="#ef4444" />
                  <SvgText x="240" y="166" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">
                    OMR IT (498)
                  </SvgText>

                  {/* Hotspot 2: Kattur / Loyola Belt (Amber) */}
                  <Circle cx="160" cy="75" r="28" fill="rgba(245, 158, 11, 0.25)" />
                  <Circle cx="160" cy="75" r="12" fill="#f59e0b" />
                  <SvgText x="160" y="98" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Loyola Belt (380)
                  </SvgText>

                  {/* Hotspot 3: Tambaram Corridor (Green) */}
                  <Circle cx="80" cy="160" r="22" fill="rgba(16, 185, 129, 0.25)" />
                  <Circle cx="80" cy="160" r="10" fill="#10b981" />
                  <SvgText x="80" y="182" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Tambaram (240)
                  </SvgText>

                  {/* Hotspot 4: Anna Nagar (Amber) */}
                  <Circle cx="100" cy="40" r="24" fill="rgba(245, 158, 11, 0.25)" />
                  <Circle cx="100" cy="40" r="10" fill="#f59e0b" />
                  <SvgText x="100" y="62" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Anna Nagar (310)
                  </SvgText>

                  {/* GPS Moving Fleet Pings */}
                  <Circle cx="195" cy="105" r="5" fill="#38bdf8" />
                  <Circle cx="120" cy="120" r="5" fill="#38bdf8" />
                  <Circle cx="265" cy="155" r="5" fill="#38bdf8" />
                </Svg>
              </View>

              <View style={styles.mapLegend}>
                <View style={styles.mapLegendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                  <Text style={styles.mapLegendText}>Critical Deficit (&gt;400)</Text>
                </View>
                <View style={styles.mapLegendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.mapLegendText}>High Demand (300-400)</Text>
                </View>
                <View style={styles.mapLegendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.mapLegendText}>Balanced (&lt;300)</Text>
                </View>
                <View style={styles.mapLegendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#38bdf8' }]} />
                  <Text style={styles.mapLegendText}>Live GPS Cab</Text>
                </View>
              </View>
            </Card>

            {/* Density Clusters Detailed Cards */}
            <Text style={styles.sectionHeader}>CORRIDOR CLUSTER DETAILS</Text>
            {heatmapData?.corridorClusters?.map((cluster) => (
              <Card key={cluster.id} style={styles.clusterCard}>
                <View style={styles.clusterHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clusterName}>{cluster.name}</Text>
                    <Text style={styles.clusterStats}>
                      👥 {cluster.commutersCount} commuters • 🚖 {cluster.activeCabs} active vehicles
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.clusterBadge,
                      {
                        backgroundColor: cluster.densityLevel === 'CRITICAL_HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        borderColor: cluster.densityColor,
                      },
                    ]}
                  >
                    <Text style={[styles.clusterBadgeText, { color: cluster.densityColor }]}>
                      {cluster.densityLevel.replace('_', ' ')}
                    </Text>
                  </View>
                </View>

                {cluster.seatDeficit < 0 ? (
                  <View style={styles.deficitNotice}>
                    <Avatar.Icon size={20} icon="alert-circle" style={{ backgroundColor: 'transparent' }} color="#ef4444" />
                    <Text style={styles.deficitNoticeText}>
                      Deficit of {Math.abs(cluster.seatDeficit)} seats. Dispatch 3 additional 20-seater shuttles.
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.deficitNotice, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Avatar.Icon size={20} icon="check-circle" style={{ backgroundColor: 'transparent' }} color="#10b981" />
                    <Text style={[styles.deficitNoticeText, { color: '#10b981' }]}>
                      Optimal seat cushion (+{cluster.seatDeficit} surplus seats available).
                    </Text>
                  </View>
                )}
              </Card>
            ))}

            {/* Live Fleet Markers */}
            <Text style={[styles.sectionHeader, { marginTop: 16 }]}>LIVE GPS FLEET TELEMATICS</Text>
            {heatmapData?.fleetMarkers?.map((marker) => (
              <Card key={marker.cabId} style={styles.fleetCard}>
                <View style={styles.fleetCardRow}>
                  <Avatar.Text
                    size={40}
                    label={marker.cabId.replace('CAB-', '#')}
                    style={{ backgroundColor: '#1e293b' }}
                    color="#10b981"
                  />
                  <View style={styles.fleetCardDetails}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.fleetPlate}>{marker.plate}</Text>
                      <Text style={styles.fleetSpeed}>🏎️ {marker.speedKmh} km/h</Text>
                    </View>
                    <Text style={styles.fleetDriver}>Driver: {marker.driverName} ({marker.driverPhone})</Text>
                    <Text style={styles.fleetRoute}>{marker.route}</Text>
                    <Text style={styles.fleetOccupancy}>Occupancy: <Text style={{ color: '#10b981', fontWeight: 'bold' }}>{marker.occupancy}</Text></Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 3: DRIVER KYC VERIFICATION QUEUE & AUDIT                   */}
        {/* ============================================================== */}
        {activeTab === 'KYC_QUEUE' && (
          <View>
            <View style={styles.kycSummaryBanner}>
              <View>
                <Text style={styles.kycBannerTitle}>Driver Document Compliance</Text>
                <Text style={styles.kycBannerSub}>
                  Audit Commercial DL, Vehicle RC Books, & Police BG Checks
                </Text>
              </View>
              <Chip style={{ backgroundColor: '#1e293b' }} textStyle={{ color: '#f59e0b', fontWeight: 'bold' }}>
                {kycQueue.filter((k) => k.status === 'PENDING_AUDIT').length} Pending Audit
              </Chip>
            </View>

            <View style={styles.kycList}>
              {kycQueue.map((driver) => {
                const isVerified = driver.status === 'VERIFIED';
                const isPending = driver.status === 'PENDING_AUDIT';

                return (
                  <Card key={driver.id} style={styles.kycCard}>
                    <View style={styles.kycCardHeader}>
                      <Avatar.Text
                        size={44}
                        label={driver.driverName.substring(0, 2).toUpperCase()}
                        style={{
                          backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        }}
                        color={isVerified ? '#10b981' : '#f59e0b'}
                      />
                      <View style={styles.kycDetails}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={styles.kycDriverName}>{driver.driverName}</Text>
                          <View
                            style={[
                              styles.kycStatusBadge,
                              {
                                backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                borderColor: isVerified ? '#10b981' : '#f59e0b',
                              },
                            ]}
                          >
                            <Text style={[styles.kycStatusText, { color: isVerified ? '#10b981' : '#f59e0b' }]}>
                              {driver.status}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.kycSub}>{driver.phone} • 🚗 {driver.vehiclePlate}</Text>
                      </View>
                    </View>

                    {/* Document Checklist Items */}
                    <View style={styles.docGrid}>
                      <View style={styles.docItem}>
                        <Avatar.Icon size={20} icon="card-account-details-outline" style={{ backgroundColor: 'transparent' }} color="#94a3b8" />
                        <View style={{ marginLeft: 6 }}>
                          <Text style={styles.docLabel}>Driving Licence</Text>
                          <Text style={styles.docValue}>{driver.licenseNumber}</Text>
                        </View>
                      </View>

                      <View style={styles.docItem}>
                        <Avatar.Icon size={20} icon="file-document-outline" style={{ backgroundColor: 'transparent' }} color="#94a3b8" />
                        <View style={{ marginLeft: 6 }}>
                          <Text style={styles.docLabel}>RC Book</Text>
                          <Text style={styles.docValue}>{driver.rcNumber}</Text>
                        </View>
                      </View>

                      <View style={styles.docItem}>
                        <Avatar.Icon size={20} icon="shield-account" style={{ backgroundColor: 'transparent' }} color="#10b981" />
                        <View style={{ marginLeft: 6 }}>
                          <Text style={styles.docLabel}>Police BG Check</Text>
                          <Text style={[styles.docValue, { color: '#10b981' }]}>{driver.backgroundCheckStatus}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Audit Action Button */}
                    <View style={styles.kycActionRow}>
                      <Button
                        mode="contained"
                        buttonColor={isVerified ? '#1e293b' : '#10b981'}
                        textColor={isVerified ? '#94a3b8' : '#070b13'}
                        style={styles.auditActionBtn}
                        onPress={() => {
                          setSelectedKycDriver(driver);
                          setAuditModalVisible(true);
                        }}
                      >
                        {isVerified ? 'VIEW AUDIT CERTIFICATE' : 'AUDIT & APPROVE KYC'}
                      </Button>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* DOCUMENT AUDIT MODAL */}
      <Modal visible={auditModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.auditModalCard}>
            <View style={styles.auditModalHeader}>
              <View>
                <Text style={styles.auditModalTitle}>Driver KYC Verification Audit</Text>
                <Text style={styles.auditModalSub}>
                  {selectedKycDriver?.driverName} ({selectedKycDriver?.vehiclePlate})
                </Text>
              </View>
              <IconButton icon="close" iconColor="#94a3b8" size={24} onPress={() => setAuditModalVisible(false)} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
              <View style={styles.auditSection}>
                <Text style={styles.auditSectionTitle}>1. Commercial Driving License</Text>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>License Number:</Text>
                  <Text style={styles.auditDocVal}>{selectedKycDriver?.licenseNumber}</Text>
                </View>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>Expiry Date:</Text>
                  <Text style={styles.auditDocVal}>{selectedKycDriver?.licenseExpiry}</Text>
                </View>
              </View>

              <View style={styles.auditSection}>
                <Text style={styles.auditSectionTitle}>2. Vehicle Registration & Insurance</Text>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>RC Book No:</Text>
                  <Text style={styles.auditDocVal}>{selectedKycDriver?.rcNumber}</Text>
                </View>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>Insurance Policy:</Text>
                  <Text style={styles.auditDocVal}>{selectedKycDriver?.insurancePolicy}</Text>
                </View>
              </View>

              <View style={styles.auditSection}>
                <Text style={styles.auditSectionTitle}>3. Criminal & Police Record Clearance</Text>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>Certificate File:</Text>
                  <Text style={[styles.auditDocVal, { color: '#38bdf8' }]}>📄 {selectedKycDriver?.backgroundCheckDoc}</Text>
                </View>
                <View style={styles.auditDocRow}>
                  <Text style={styles.auditDocLabel}>RTO Status:</Text>
                  <Text style={[styles.auditDocVal, { color: '#10b981' }]}>VERIFIED CLEAR</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtonsRow}>
              <Button
                mode="outlined"
                textColor="#ef4444"
                style={{ flex: 1, borderColor: '#ef4444' }}
                onPress={() => selectedKycDriver && handleUpdateKycStatus(selectedKycDriver.id, 'REJECTED')}
              >
                REJECT
              </Button>
              <Button
                mode="contained"
                buttonColor="#10b981"
                textColor="#070b13"
                style={{ flex: 1 }}
                onPress={() => selectedKycDriver && handleUpdateKycStatus(selectedKycDriver.id, 'APPROVED')}
              >
                APPROVE & ACTIVATE
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
  refreshBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#10b981',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabBtnTextActive: {
    color: '#070b13',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  kpiValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
  },
  kpiTrend: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
    marginTop: 14,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
  },
  donutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendColumn: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131e32',
    padding: 8,
    borderRadius: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  legendDetails: {
    color: '#64748b',
    fontSize: 9,
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '900',
  },
  sectionHeader: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 8,
  },
  corridorsList: {
    gap: 8,
  },
  corridorCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
  },
  corridorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corridorRouteName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  corridorDemandText: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  fillRatePill: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fillRateValue: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
  },
  fillRateLabel: {
    color: '#64748b',
    fontSize: 8,
  },
  mapCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
  },
  fleetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveBlinker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38bdf8',
    marginRight: 4,
  },
  fleetBadgeText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapCanvas: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  mapLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  mapLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapLegendText: {
    color: '#94a3b8',
    fontSize: 9,
  },
  clusterCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 8,
  },
  clusterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clusterName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  clusterStats: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  clusterBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  clusterBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  deficitNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: 6,
    marginTop: 8,
  },
  deficitNoticeText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
    flex: 1,
  },
  fleetCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 8,
  },
  fleetCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fleetCardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fleetPlate: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  fleetSpeed: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fleetDriver: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 1,
  },
  fleetRoute: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  fleetOccupancy: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 1,
  },
  kycSummaryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    marginBottom: 12,
  },
  kycBannerTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  kycBannerSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  kycList: {
    gap: 10,
  },
  kycCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 14,
  },
  kycCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kycDetails: {
    flex: 1,
    marginLeft: 12,
  },
  kycDriverName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  kycStatusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kycStatusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  kycSub: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  docGrid: {
    backgroundColor: '#131e32',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 6,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docLabel: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
  },
  docValue: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  kycActionRow: {
    marginTop: 10,
  },
  auditActionBtn: {
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  auditModalCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
  },
  auditModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  auditModalTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  auditModalSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  auditSection: {
    backgroundColor: '#131e32',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  auditSectionTitle: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  auditDocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  auditDocLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  auditDocVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
});
