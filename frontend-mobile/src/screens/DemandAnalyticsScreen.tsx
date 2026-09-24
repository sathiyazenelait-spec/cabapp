import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, DataTable, Chip } from 'react-native-paper';

interface RouteDemandRow {
  id: number;
  origin: string;
  destination: string;
  category: 'College' | 'Work' | 'School';
  demandCount: number;
  availableSeats: number;
}

const mockTopRoutes: RouteDemandRow[] = [
  { id: 1, origin: 'Kattur', destination: 'ABC College', category: 'College', demandCount: 68, availableSeats: 12 },
  { id: 2, origin: 'Kattur', destination: 'IT Park', category: 'Work', demandCount: 54, availableSeats: 10 },
  { id: 3, origin: 'Ariyankuppam', destination: 'School', category: 'School', demandCount: 48, availableSeats: 8 },
  { id: 4, origin: 'Lawspet', destination: 'College', category: 'College', demandCount: 41, availableSeats: 15 },
  { id: 5, origin: 'Villupuram', destination: 'IT Park', category: 'Work', demandCount: 37, availableSeats: 9 },
];

export const DemandAnalyticsScreen: React.FC<{ navigation?: any }> = () => {
  const [selectedDate, setSelectedDate] = useState('Apr 15, 2025');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date Header Pill */}
      <View style={styles.dateRow}>
        <Text style={styles.headerTitle}>Overview Analytics</Text>
        <Chip icon="calendar" style={styles.dateChip} textStyle={{ color: '#fff', fontSize: 10 }}>
          {selectedDate}
        </Chip>
      </View>

      {/* 4 Stat KPI Grid */}
      <View style={styles.kpiGrid}>
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Avatar.Icon size={28} icon="account-group" color="#10b981" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }} />
            <Text style={styles.kpiLabel}>Total Demand</Text>
            <Text style={styles.kpiValue}>1,248</Text>
            <Text style={styles.kpiTrendPositive}>↑ 12% vs last week</Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Avatar.Icon size={28} icon="car" color="#38bdf8" style={{ backgroundColor: 'rgba(56,189,248,0.1)' }} />
            <Text style={styles.kpiLabel}>Available Seats</Text>
            <Text style={styles.kpiValue}>892</Text>
            <Text style={styles.kpiTrendNegative}>↓ 8% vs last week</Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Avatar.Icon size={28} icon="source-branch" color="#a855f7" style={{ backgroundColor: 'rgba(168,85,247,0.1)' }} />
            <Text style={styles.kpiLabel}>Active Routes</Text>
            <Text style={styles.kpiValue}>86</Text>
            <Text style={styles.kpiTrendPositive}>↑ 6% vs last week</Text>
          </Card.Content>
        </Card>

        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <Avatar.Icon size={28} icon="percent" color="#f59e0b" style={{ backgroundColor: 'rgba(245,158,11,0.1)' }} />
            <Text style={styles.kpiLabel}>Avg. Fill Rate</Text>
            <Text style={styles.kpiValue}>71%</Text>
            <Text style={styles.kpiTrendPositive}>↑ 14% vs last week</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Demand by Category Card */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Demand by Category</Text>
          <View style={styles.categoryBreakdown}>
            <View style={styles.categoryItem}>
              <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.categoryLabel}>School</Text>
              <Text style={styles.categoryPercent}>32% (399)</Text>
            </View>
            <View style={styles.categoryItem}>
              <View style={[styles.dot, { backgroundColor: '#6366f1' }]} />
              <Text style={styles.categoryLabel}>College</Text>
              <Text style={styles.categoryPercent}>28% (349)</Text>
            </View>
            <View style={styles.categoryItem}>
              <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.categoryLabel}>Work</Text>
              <Text style={styles.categoryPercent}>40% (500)</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Top Demand Routes */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.sectionTitle}>Top Demand Routes</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 0.5 }}><Text style={styles.th}>#</Text></DataTable.Title>
              <DataTable.Title style={{ flex: 2 }}><Text style={styles.th}>Route</Text></DataTable.Title>
              <DataTable.Title style={{ flex: 1.2 }}><Text style={styles.th}>Category</Text></DataTable.Title>
              <DataTable.Title numeric style={{ flex: 1 }}><Text style={styles.th}>Demand</Text></DataTable.Title>
              <DataTable.Title numeric style={{ flex: 1 }}><Text style={styles.th}>Seats</Text></DataTable.Title>
            </DataTable.Header>

            {mockTopRoutes.map((r) => (
              <DataTable.Row key={r.id}>
                <DataTable.Cell style={{ flex: 0.5 }}><Text style={styles.td}>{r.id}</Text></DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                  <Text style={styles.tdBold}>{r.origin} ➔ {r.destination}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 1.2 }}>
                  <Text style={[styles.categoryTag, { color: r.category === 'College' ? '#818cf8' : r.category === 'Work' ? '#34d399' : '#60a5fa' }]}>
                    {r.category}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 1 }}><Text style={styles.tdBold}>{r.demandCount}</Text></DataTable.Cell>
                <DataTable.Cell numeric style={{ flex: 1 }}><Text style={styles.td}>{r.availableSeats}</Text></DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Demand Heat Map Card */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.sectionTitle}>Demand Heat Map</Text>
            <Text style={styles.viewAllText}>View Map</Text>
          </View>

          <View style={styles.heatMapContainer}>
            <View style={[styles.heatSpot, { top: '30%', left: '35%', backgroundColor: 'rgba(239,68,68,0.4)' }]}>
              <Text style={styles.spotText}>Kattur (68)</Text>
            </View>
            <View style={[styles.heatSpot, { top: '55%', left: '65%', backgroundColor: 'rgba(245,158,11,0.4)' }]}>
              <Text style={styles.spotText}>ABC College (45)</Text>
            </View>
            <View style={[styles.heatSpot, { top: '70%', left: '40%', backgroundColor: 'rgba(16,185,129,0.4)' }]}>
              <Text style={styles.spotText}>IT Park (54)</Text>
            </View>
          </View>

          <View style={styles.legendRow}>
            <Text style={[styles.legendText, { color: '#ef4444' }]}>● Very High</Text>
            <Text style={[styles.legendText, { color: '#f59e0b' }]}>● High</Text>
            <Text style={[styles.legendText, { color: '#10b981' }]}>● Medium</Text>
            <Text style={[styles.legendText, { color: '#6b7280' }]}>● Low</Text>
          </View>
        </Card.Content>
      </Card>
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
    paddingBottom: 40,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateChip: {
    backgroundColor: '#1e293b',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderRadius: 14,
  },
  kpiContent: {
    padding: 10,
  },
  kpiLabel: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 6,
  },
  kpiValue: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    marginTop: 2,
  },
  kpiTrendPositive: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  kpiTrendNegative: {
    color: '#f43f5e',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryBreakdown: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryLabel: {
    color: '#e2e8f0',
    fontSize: 11,
    flex: 1,
  },
  categoryPercent: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  th: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  td: {
    color: '#94a3b8',
    fontSize: 10,
  },
  tdBold: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryTag: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  heatMapContainer: {
    height: 120,
    backgroundColor: '#0b1329',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heatSpot: {
    position: 'absolute',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  legendText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
});
