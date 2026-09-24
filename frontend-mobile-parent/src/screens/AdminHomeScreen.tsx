import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, Chip, ActivityIndicator, Divider } from 'react-native-paper';

interface DashboardStats {
  totalUsers: number;
  activeParents: number;
  studentsCount: number;
  driversCount: number;
  cabOwnersCount: number;
  schoolsCount: number;
  collegesCount: number;
  companiesCount: number;
  activeVehicles: number;
  activeRoutes: number;
  activeSubscriptions: number;
  revenue: number;
  commission: number;
  complaintsCount: number;
  safetyIncidentsCount: number;
  todaysTripsCount: number;
}

interface UserItem {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

interface VehicleItem {
  id: number;
  regNumber: string;
  vehicleType: string;
  capacity: number;
  insurance: string;
  fitnessCertificate: string;
  permit: string;
  rc: string;
  pollutionCertificate: string;
  verificationStatus: string;
}

interface ComplaintItem {
  id: number;
  reporterEmail: string;
  details: string;
  status: string;
  type: string;
  incidentDate: string;
}

interface AIDemandItem {
  corridor: string;
  demand: string;
  studentsCount: number;
  employeesCount: number;
  availableSeats: number;
  recommendation: string;
}

const BACKEND_URL = 'http://10.0.2.2:8082';

export const AdminHomeScreen: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'vehicles' | 'complaints' | 'ai'>('stats');

  // Dashboard Data State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [aiDemand, setAiDemand] = useState<AIDemandItem[]>([]);

  // Add User State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ROLE_PARENT' | 'ROLE_DRIVER' | 'ROLE_CAB_OWNER' | 'ROLE_SUPER_ADMIN'>('ROLE_PARENT');

  const handleAddUser = async () => {
    if (!newUsername || !newEmail || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (token) {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: newUsername,
            email: newEmail,
            password: newPassword,
            role: newRole
          })
        });

        if (response.ok) {
          Alert.alert('Success', 'User added successfully!');
          setShowAddUserModal(false);
          setNewUsername('');
          setNewEmail('');
          setNewPassword('');
          // Refresh list
          await fetchDashboardData(token);
        } else {
          const errMsg = await response.text();
          Alert.alert('Error', errMsg || 'Registration failed.');
          setLoading(false);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to connect to backend.');
        setLoading(false);
      }
    } else {
      // Mock mode
      const newUser = {
        id: users.length + 1,
        username: newUsername,
        email: newEmail,
        role: newRole,
        status: newRole === 'ROLE_SUPER_ADMIN' ? 'ACTIVE' : 'PENDING'
      };
      setUsers(prev => [...prev, newUser]);
      Alert.alert('Success', 'User created successfully (Demo Mode)!');
      setShowAddUserModal(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
    }
  };

  // Default Mock Fallback Data (if backend is offline)
  const loadFallbackData = () => {
    setStats({
      totalUsers: 14,
      activeParents: 5,
      studentsCount: 16,
      driversCount: 3,
      cabOwnersCount: 2,
      schoolsCount: 1,
      collegesCount: 1,
      companiesCount: 1,
      activeVehicles: 2,
      activeRoutes: 3,
      activeSubscriptions: 2,
      revenue: 3500.0,
      commission: 350.0,
      complaintsCount: 2,
      safetyIncidentsCount: 1,
      todaysTripsCount: 6,
    });

    setUsers([
      { id: 1, username: 'admin', email: 'admin@safepassage.ai', role: 'ROLE_SUPER_ADMIN', status: 'ACTIVE' },
      { id: 2, username: 'priya_sharma', email: 'priya@gmail.com', role: 'ROLE_PARENT', status: 'ACTIVE' },
      { id: 3, username: 'kumar_van_owner', email: 'kumar@cabs.com', role: 'ROLE_CAB_OWNER', status: 'ACTIVE' },
      { id: 4, username: 'ravi_driver', email: 'ravi@driver.com', role: 'ROLE_DRIVER', status: 'ACTIVE' },
    ]);

    setVehicles([
      { id: 1, regNumber: 'TN 01 AB 1234', vehicleType: 'VAN', capacity: 12, insurance: 'INS_998822', fitnessCertificate: 'FIT_887711', permit: 'PERMIT_554433', rc: 'RC_223344', pollutionCertificate: 'POL_889900', verificationStatus: 'APPROVED' },
      { id: 2, regNumber: 'TN 02 CD 5678', vehicleType: 'CAR', capacity: 6, insurance: 'INS_998823', fitnessCertificate: 'FIT_887712', permit: 'PERMIT_554434', rc: 'RC_223345', pollutionCertificate: 'POL_889901', verificationStatus: 'APPROVED' },
      { id: 3, regNumber: 'TN 03 EF 9012', vehicleType: 'BUS', capacity: 40, insurance: 'INS_998824', fitnessCertificate: 'FIT_887713', permit: 'PERMIT_554435', rc: 'RC_223346', pollutionCertificate: 'POL_889902', verificationStatus: 'PENDING' },
    ]);

    setComplaints([
      { id: 1, reporterEmail: 'priya@gmail.com', details: 'SOS trigger - Ananya marked absent but onboard notification received.', status: 'RESOLVED', type: 'SOS', incidentDate: '2026-08-12T14:05:00' },
      { id: 2, reporterEmail: 'parent2@gmail.com', details: 'Driver delayed for morning pickup by 15 mins.', status: 'PENDING', type: 'DRIVER', incidentDate: '2026-08-23T08:10:00' },
    ]);

    setAiDemand([
      { corridor: 'Kattur ➔ Chennai IT Park', demand: 'High 🔥', studentsCount: 28, employeesCount: 46, availableSeats: 17, recommendation: 'Add 3 vehicles to this corridor.' },
      { corridor: 'Tambaram ➔ ABC Matriculation School', demand: 'Medium 📈', studentsCount: 19, employeesCount: 5, availableSeats: 4, recommendation: 'Optimize route timing to save 8 minutes.' }
    ]);
  };

  // Perform automated login to backend
  const performLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setToken(data.token);
      return data.token;
    } catch (e) {
      console.log('Backend offline or credentials invalid, loading fallback demo data.');
      loadFallbackData();
      setLoading(false);
      return null;
    }
  };

  // Fetch Dashboard Stats & details
  const fetchDashboardData = async (authToken: string) => {
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };

      const [statsRes, usersRes, vehiclesRes, complaintsRes, aiRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/dashboard/stats`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/users`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/vehicles`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/complaints`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/ai/demand`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (complaintsRes.ok) setComplaints(await complaintsRes.json());
      if (aiRes.ok) setAiDemand(await aiRes.json());

    } catch (err) {
      console.log('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const jwtToken = await performLogin();
      if (jwtToken) {
        await fetchDashboardData(jwtToken);
      }
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    if (token) {
      await fetchDashboardData(token);
    } else {
      const jwtToken = await performLogin();
      if (jwtToken) {
        await fetchDashboardData(jwtToken);
      } else {
        loadFallbackData();
        setLoading(false);
      }
    }
  };

  // REST API: User Actions (APPROVE / SUSPEND)
  const updateUserStatus = async (userId: number, newStatus: string) => {
    if (!token) {
      // Mock update
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      Alert.alert('Status Updated', `User status changed to ${newStatus} (Demo Mode)`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert('Success', `User status updated to ${newStatus}`);
        await fetchDashboardData(token);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update user status');
      setLoading(false);
    }
  };

  // REST API: Vehicle verification (APPROVED / REJECTED)
  const updateVehicleStatus = async (vehicleId: number, newStatus: string) => {
    if (!token) {
      // Mock update
      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, verificationStatus: newStatus } : v));
      Alert.alert('Verification Updated', `Vehicle set to ${newStatus} (Demo Mode)`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/admin/vehicles/${vehicleId}/status?status=${newStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert('Success', `Vehicle verification status updated to ${newStatus}`);
        await fetchDashboardData(token);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update vehicle verification');
      setLoading(false);
    }
  };

  // REST API: Complaint Actions (RESOLVED)
  const resolveComplaint = async (complaintId: number) => {
    if (!token) {
      // Mock update
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'RESOLVED' } : c));
      Alert.alert('Complaint Resolved', 'Incident marked as RESOLVED (Demo Mode)');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/admin/complaints/${complaintId}/status?status=RESOLVED`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert('Success', 'Safety Incident resolved');
        await fetchDashboardData(token);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to resolve incident');
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Syncing with Cab Management Backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Super Admin Console</Text>
          <Text style={styles.headerSubtitle}>
            {token ? '🟢 Connected to Live API' : '🟡 Offline Demo Mode'}
          </Text>
        </View>
        <IconButton icon="refresh" iconColor="#38bdf8" onPress={handleRefresh} />
      </View>

      {/* Tabs segment */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.tabLabel, activeTab === 'stats' && styles.activeTabLabel]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'users' && styles.activeTabButton]}
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.tabLabel, activeTab === 'users' && styles.activeTabLabel]}>Users ({users.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'vehicles' && styles.activeTabButton]}
            onPress={() => setActiveTab('vehicles')}
          >
            <Text style={[styles.tabLabel, activeTab === 'vehicles' && styles.activeTabLabel]}>Fleet ({vehicles.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'complaints' && styles.activeTabButton]}
            onPress={() => setActiveTab('complaints')}
          >
            <Text style={[styles.tabLabel, activeTab === 'complaints' && styles.activeTabLabel]}>Alarms ({complaints.filter(c => c.status !== 'RESOLVED').length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'ai' && styles.activeTabButton]}
            onPress={() => setActiveTab('ai')}
          >
            <Text style={[styles.tabLabel, activeTab === 'ai' && styles.activeTabLabel]}>AI Corridor</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main content body */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* TAB 1: OVERVIEW STATISTICS */}
        {activeTab === 'stats' && stats && (
          <View>
            <Text style={styles.sectionTitle}>Global Ecosystem Overview</Text>

            {/* Financial indicators */}
            <View style={styles.revenueRow}>
              <Card style={[styles.statCard, { flex: 1, marginRight: 8, backgroundColor: '#064e3b' }]}>
                <Card.Content>
                  <Text style={styles.statCardLabel}>GROSS REVENUE</Text>
                  <Text style={styles.statCardValue}>₹{stats.revenue.toFixed(2)}</Text>
                </Card.Content>
              </Card>
              <Card style={[styles.statCard, { flex: 1, backgroundColor: '#1e3a8a' }]}>
                <Card.Content>
                  <Text style={styles.statCardLabel}>PLATFORM COMMISSION</Text>
                  <Text style={styles.statCardValue}>₹{stats.commission.toFixed(2)}</Text>
                </Card.Content>
              </Card>
            </View>

            {/* General metrics grid */}
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Card style={styles.gridCard}>
                  <Card.Content>
                    <Text style={styles.gridNum}>{stats.totalUsers}</Text>
                    <Text style={styles.gridLabel}>Registered Users</Text>
                  </Card.Content>
                </Card>
              </View>
              <View style={styles.gridCol}>
                <Card style={styles.gridCard}>
                  <Card.Content>
                    <Text style={styles.gridNum}>{stats.activeRoutes}</Text>
                    <Text style={styles.gridLabel}>Active Routes</Text>
                  </Card.Content>
                </Card>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Card style={styles.gridCard}>
                  <Card.Content>
                    <Text style={styles.gridNum}>{stats.activeVehicles}</Text>
                    <Text style={styles.gridLabel}>Approved Fleet</Text>
                  </Card.Content>
                </Card>
              </View>
              <View style={styles.gridCol}>
                <Card style={styles.gridCard}>
                  <Card.Content>
                    <Text style={[styles.gridNum, { color: '#ef4444' }]}>{stats.safetyIncidentsCount}</Text>
                    <Text style={styles.gridLabel}>SOS Alerts</Text>
                  </Card.Content>
                </Card>
              </View>
            </View>

            <Card style={styles.detailStatsCard}>
              <Card.Content>
                <Text style={styles.detailTitle}>Role Segment Breakdown</Text>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Parents / Students</Text><Text style={styles.detailVal}>{stats.activeParents}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Drivers</Text><Text style={styles.detailVal}>{stats.driversCount}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Cab Owners</Text><Text style={styles.detailVal}>{stats.cabOwnersCount}</Text></View>
                <View style={styles.detailRow}><Text style={styles.detailLabel}>Today's Trips</Text><Text style={styles.detailVal}>{stats.todaysTripsCount}</Text></View>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>User Account Moderation</Text>
              <Button mode="text" compact onPress={() => setShowAddUserModal(true)} textColor="#38bdf8">
                + Add User
              </Button>
            </View>

            {showAddUserModal && (
              <Card style={styles.addUserCard}>
                <Card.Content>
                  <Text style={styles.addUserTitle}>Create New Account</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newUsername}
                      onChangeText={setNewUsername}
                      placeholder="e.g. rahul_das"
                      placeholderTextColor="#6b7280"
                    />
                  </View>

                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newEmail}
                      onChangeText={setNewEmail}
                      placeholder="e.g. rahul@gmail.com"
                      placeholderTextColor="#6b7280"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.inputContainer, { marginTop: 10 }]}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.textInput}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="••••••••"
                      placeholderTextColor="#6b7280"
                      secureTextEntry
                    />
                  </View>

                  <Text style={[styles.inputLabel, { marginTop: 12, marginBottom: 6 }]}>Account Role</Text>
                  <View style={styles.roleSelectionRow}>
                    {['ROLE_PARENT', 'ROLE_DRIVER', 'ROLE_CAB_OWNER', 'ROLE_SUPER_ADMIN'].map(role => (
                      <TouchableOpacity
                        key={role}
                        style={[styles.roleSelectBtn, newRole === role && styles.roleSelectBtnActive]}
                        onPress={() => setNewRole(role as any)}
                      >
                        <Text style={[styles.roleSelectLabel, newRole === role && styles.roleSelectLabelActive]}>
                          {role.replace('ROLE_', '')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.formActionRow}>
                    <Button 
                      mode="outlined" 
                      onPress={() => setShowAddUserModal(false)}
                      style={[styles.formBtn, { marginRight: 8 }]}
                      textColor="#9ca3af"
                    >
                      Cancel
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={handleAddUser}
                      style={styles.formBtn}
                      buttonColor="#38bdf8"
                      textColor="#0f172a"
                    >
                      Create User
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}

            {users.map(user => (
              <Card key={user.id} style={styles.listItemCard}>
                <Card.Content style={styles.userRowContent}>
                  <View style={styles.rowMain}>
                    <Avatar.Icon size={32} icon="account" style={{ backgroundColor: '#1e293b' }} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>{user.username}</Text>
                      <Text style={styles.rowSubtitle}>{user.email}</Text>
                      <View style={styles.tagRow}>
                        <Chip textStyle={styles.chipText} style={styles.roleChip}>{user.role.replace('ROLE_', '')}</Chip>
                        <Chip
                          textStyle={styles.chipText}
                          style={[
                            styles.statusChip,
                            { backgroundColor: user.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }
                          ]}
                        >
                          {user.status}
                        </Chip>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionButtonRow}>
                    {user.status === 'ACTIVE' ? (
                      <Button
                        mode="outlined"
                        onPress={() => updateUserStatus(user.id, 'SUSPENDED')}
                        style={styles.actionBtn}
                        textColor="#ef4444"
                      >
                        SUSPEND
                      </Button>
                    ) : (
                      <Button
                        mode="contained"
                        onPress={() => updateUserStatus(user.id, 'ACTIVE')}
                        style={styles.actionBtn}
                        buttonColor="#10b981"
                      >
                        ACTIVATE
                      </Button>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* TAB 3: VEHICLE VERIFICATION */}
        {activeTab === 'vehicles' && (
          <View>
            <Text style={styles.sectionTitle}>Document Verification & Fleet</Text>
            {vehicles.map(vehicle => (
              <Card key={vehicle.id} style={styles.listItemCard}>
                <Card.Content>
                  <View style={styles.vehicleRowHeader}>
                    <Text style={styles.vehicleReg}>{vehicle.regNumber}</Text>
                    <Chip
                      style={{
                        backgroundColor: vehicle.verificationStatus === 'APPROVED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'
                      }}
                      textStyle={{ color: vehicle.verificationStatus === 'APPROVED' ? '#10b981' : '#f59e0b', fontSize: 10 }}
                    >
                      {vehicle.verificationStatus}
                    </Chip>
                  </View>

                  <Text style={styles.vehicleMeta}>Type: {vehicle.vehicleType} | Capacity: {vehicle.capacity} seats</Text>
                  
                  <View style={styles.docCheckList}>
                    <Text style={styles.docCheckText}>📄 RC: {vehicle.rc}</Text>
                    <Text style={styles.docCheckText}>📄 Fitness Certificate: {vehicle.fitnessCertificate}</Text>
                    <Text style={styles.docCheckText}>📄 Permit: {vehicle.permit}</Text>
                    <Text style={styles.docCheckText}>📄 Insurance ID: {vehicle.insurance}</Text>
                  </View>

                  {vehicle.verificationStatus === 'PENDING' && (
                    <View style={styles.verifyRowButtons}>
                      <Button
                        mode="contained"
                        buttonColor="#10b981"
                        onPress={() => updateVehicleStatus(vehicle.id, 'APPROVED')}
                        style={{ marginRight: 8, flex: 1 }}
                      >
                        APPROVE
                      </Button>
                      <Button
                        mode="outlined"
                        textColor="#ef4444"
                        onPress={() => updateVehicleStatus(vehicle.id, 'REJECTED')}
                        style={{ flex: 1 }}
                      >
                        REJECT
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* TAB 4: COMPLAINTS & SOS */}
        {activeTab === 'complaints' && (
          <View>
            <Text style={styles.sectionTitle}>Safety Incidents & SOS</Text>
            {complaints.length === 0 ? (
              <Text style={styles.emptyText}>No complaints reported.</Text>
            ) : (
              complaints.map(complaint => (
                <Card key={complaint.id} style={[styles.listItemCard, complaint.type === 'SOS' && styles.sosCard]}>
                  <Card.Content>
                    <View style={styles.complaintHeader}>
                      <View style={styles.headerLeft}>
                        <Avatar.Icon
                          size={24}
                          icon={complaint.type === 'SOS' ? 'alert-octagon' : 'alert-circle'}
                          style={{ backgroundColor: complaint.type === 'SOS' ? '#ef4444' : '#f59e0b' }}
                        />
                        <Text style={styles.complaintType}>{complaint.type} Ticket</Text>
                      </View>
                      <Chip style={styles.complaintStatusChip}>{complaint.status}</Chip>
                    </View>

                    <Text style={styles.complaintReporter}>Reporter: {complaint.reporterEmail}</Text>
                    <Text style={styles.complaintBody}>{complaint.details}</Text>

                    {complaint.status === 'PENDING' && (
                      <Button
                        mode="contained"
                        buttonColor="#38bdf8"
                        style={styles.resolveButton}
                        onPress={() => resolveComplaint(complaint.id)}
                      >
                        RESOLVE TICKET
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}

        {/* TAB 5: AI CORRIDOR INTEL */}
        {activeTab === 'ai' && (
          <View>
            <Text style={styles.sectionTitle}>AI Demand Optimization</Text>
            {aiDemand.map((item, idx) => (
              <Card key={idx} style={styles.listItemCard}>
                <Card.Content>
                  <View style={styles.aiHeader}>
                    <Text style={styles.aiCorridor}>{item.corridor}</Text>
                    <Chip style={styles.aiDemandChip}>{item.demand} Demand</Chip>
                  </View>
                  <View style={styles.aiStatsRow}>
                    <Text style={styles.aiStatVal}>Students: {item.studentsCount}</Text>
                    <Text style={styles.aiStatVal}>Employees: {item.employeesCount}</Text>
                    <Text style={styles.aiStatVal}>Available Seats: {item.availableSeats}</Text>
                  </View>
                  <View style={styles.aiRecBox}>
                    <Text style={styles.aiRecTitle}>💡 AI Recommendation</Text>
                    <Text style={styles.aiRecBody}>{item.recommendation}</Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b13',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#070b13',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 12,
  },
  header: {
    padding: 16,
    paddingTop: 36,
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerSubtitle: {
    color: '#38bdf8',
    fontSize: 10,
    marginTop: 2,
    fontWeight: 'bold',
  },
  tabsContainer: {
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  activeTabButton: {
    backgroundColor: '#38bdf8',
  },
  tabLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: 'bold',
  },
  activeTabLabel: {
    color: '#000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  revenueRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statCard: {
    borderRadius: 8,
  },
  statCardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
    fontWeight: 'bold',
  },
  statCardValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  gridCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
  },
  gridNum: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gridLabel: {
    color: '#9ca3af',
    fontSize: 9,
    marginTop: 2,
  },
  detailStatsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  detailTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    color: '#9ca3af',
    fontSize: 11,
  },
  detailVal: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  listItemCard: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    marginBottom: 12,
  },
  userRowContent: {
    flexDirection: 'column',
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 12,
    flex: 1,
  },
  rowTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rowSubtitle: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  roleChip: {
    height: 20,
    backgroundColor: 'rgba(56,189,248,0.1)',
    marginRight: 6,
  },
  statusChip: {
    height: 20,
  },
  chipText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#38bdf8',
    lineHeight: 10,
  },
  actionButtonRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
    alignItems: 'flex-end',
  },
  actionBtn: {
    borderRadius: 4,
    height: 32,
    justifyContent: 'center',
  },
  vehicleRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleReg: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  vehicleMeta: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 4,
  },
  docCheckList: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  docCheckText: {
    color: '#6b7280',
    fontSize: 9,
    marginVertical: 2,
  },
  verifyRowButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  sosCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintType: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 8,
  },
  complaintStatusChip: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    height: 20,
  },
  complaintReporter: {
    color: '#6b7280',
    fontSize: 9,
    marginTop: 8,
  },
  complaintBody: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
  resolveButton: {
    borderRadius: 4,
    marginTop: 12,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 11,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiCorridor: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  aiDemandChip: {
    backgroundColor: 'rgba(56,189,248,0.1)',
    height: 20,
  },
  aiStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: 6,
    borderRadius: 4,
  },
  aiStatVal: {
    color: '#6b7280',
    fontSize: 9,
  },
  aiRecBox: {
    backgroundColor: 'rgba(56,189,248,0.05)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#38bdf8',
  },
  aiRecTitle: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  aiRecBody: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addUserCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  addUserTitle: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#070b13',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  inputLabel: {
    color: '#38bdf8',
    fontSize: 8,
    fontWeight: 'bold',
  },
  textInput: {
    color: '#fff',
    fontSize: 12,
    padding: 0,
    marginTop: 4,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  roleSelectBtn: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  roleSelectBtnActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  roleSelectLabel: {
    color: '#9ca3af',
    fontSize: 8,
    fontWeight: 'bold',
  },
  roleSelectLabelActive: {
    color: '#38bdf8',
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  formBtn: {
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
  },
});
