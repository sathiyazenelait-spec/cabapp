import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TextInput, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, Chip, Divider } from 'react-native-paper';
import { studentWorkApi, singleTripApi } from '../services/api';

type ModuleMode = 'STUDENT' | 'PROFESSIONAL';
type StudentScreenTab = 'HOME' | 'FIND' | 'SINGLE_TRIP' | 'ROUTES' | 'DETAILS' | 'SUBSCRIPTION' | 'CONFIRMATION' | 'TRACKING' | 'PAYMENTS' | 'PROFILE';
type ProScreenTab = 'HOME' | 'FIND' | 'SINGLE_TRIP' | 'ROUTES' | 'SUBSCRIPTION' | 'TRACKING' | 'ATTENDANCE' | 'HISTORY' | 'PROFILE';

export const StudentProfessionalScreen: React.FC = () => {
  const [moduleMode, setModuleMode] = useState<ModuleMode>('STUDENT');
  
  // Student Module State
  const [studentTab, setStudentTab] = useState<StudentScreenTab>('HOME');
  const [studentSearchCollege, setStudentSearchCollege] = useState('ABC Engineering College');
  const [studentSearchPickup, setStudentSearchPickup] = useState('Kattur');
  const [studentSearchTime, setStudentSearchTime] = useState('8:00 AM - 9:00 AM');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [studentSubPlan, setStudentSubPlan] = useState<'Monthly' | 'Weekly' | 'Quarterly'>('Monthly');

  // Professional Module State
  const [proTab, setProTab] = useState<ProScreenTab>('HOME');
  const [proSearchCompany, setProSearchCompany] = useState('ABC Technologies (IT Park)');
  const [proSearchPickup, setProSearchPickup] = useState('Kattur');
  const [proAttendanceFilter, setProAttendanceFilter] = useState<'Boarded' | 'Pending' | 'Absent'>('Boarded');

  // Dynamic Single Trip State (2 KM = ₹35 Pricing Rule)
  const [singlePickup, setSinglePickup] = useState('Mehta Nagar Anna Arch Gate');
  const [singleDrop, setSingleDrop] = useState('Green Valley Campus / IT Park');
  const [singleDistance, setSingleDistance] = useState(2.0);
  const [singleFare, setSingleFare] = useState(35);
  const [singleVehicleType, setSingleVehicleType] = useState<'VAN' | 'CAB' | 'AUTO'>('VAN');
  const [singleTripStatus, setSingleTripStatus] = useState<'IDLE' | 'DISPATCHING' | 'ACCEPTED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'>('IDLE');
  const [singleBoardingOtp, setSingleBoardingOtp] = useState('8492');
  const [singleDropOtp, setSingleDropOtp] = useState('7429');
  const [isRazorpayModalVisible, setIsRazorpayModalVisible] = useState(false);
  const [razorpayPaid, setRazorpayPaid] = useState(false);

  const handleDistanceChange = (dist: number) => {
    setSingleDistance(dist);
    if (dist <= 2.0) {
      setSingleFare(35);
    } else {
      setSingleFare(35 + Math.round((dist - 2.0) * 14));
    }
  };

  const handleRequestSingleTrip = async () => {
    setSingleTripStatus('DISPATCHING');
    try {
      const res = await singleTripApi.requestTrip({
        passengerName: moduleMode === 'STUDENT' ? 'Priya S (Student)' : 'Aravind (Working Pro)',
        passengerEmail: moduleMode === 'STUDENT' ? 'priya.s@abcuniv.edu' : 'aravind@safepassage.ai',
        passengerPhone: '+91 98401 22334',
        pickupAddress: singlePickup,
        dropAddress: singleDrop,
        distanceKm: singleDistance,
        fare: singleFare,
      });
      if (res && res.boardingOtp) {
        setSingleBoardingOtp(res.boardingOtp);
      }
      if (res && res.dropOtp) {
        setSingleDropOtp(res.dropOtp);
      }
    } catch (e) {}

    setTimeout(() => {
      setSingleTripStatus('ACCEPTED');
      Alert.alert('Cab Assigned 🚖', `Driver Kumar Swamy (TN 01 AB 1234) accepted your ride!\nDistance: ${singleDistance} km • Fare: ₹${singleFare}`);
    }, 2000);
  };

  // Student routes data
  const [studentRoutes, setStudentRoutes] = useState<any[]>([
    {
      id: 'sr1',
      title: 'Van TN-XX-5678',
      type: '7 Seater • AC',
      rating: 4.6,
      reviews: 124,
      price: 1800,
      seatsLeft: 2,
      driver: 'Rajesh Kumar',
      from: 'Kattur',
      to: 'ABC College',
      time: '7:40 AM - 8:15 AM',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'sr2',
      title: 'Van TN-XX-9012',
      type: '12 Seater • Non-AC',
      rating: 4.4,
      reviews: 86,
      price: 1500,
      seatsLeft: 5,
      driver: 'Suresh',
      from: 'Lawspet',
      to: 'ABC College',
      time: '7:50 AM - 8:25 AM',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'sr3',
      title: 'Car TN-XX-3456',
      type: '4 Seater • AC',
      rating: 4.2,
      reviews: 65,
      price: 2200,
      seatsLeft: 1,
      driver: 'Karthik',
      from: 'Ariyankuppam',
      to: 'ABC College',
      time: '8:00 AM - 8:40 AM',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  // Professional routes data
  const [proRoutes, setProRoutes] = useState<any[]>([
    {
      id: 'pr1',
      title: 'Van TN-XX-7890',
      type: '7 Seater • AC',
      rating: 4.7,
      reviews: 98,
      price: 3200,
      seatsLeft: 2,
      driver: 'Selvam',
      from: 'Kattur',
      to: 'IT Park, Chennai',
      time: '7:30 AM - 8:15 AM',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 'pr2',
      title: 'Car TN-XX-4478',
      type: '5 Seater • AC',
      rating: 4.9,
      reviews: 72,
      price: 3500,
      seatsLeft: 1,
      driver: 'Karthik',
      from: 'Lawspet',
      to: 'IT Park',
      time: '7:15 AM - 8:15 AM',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=200'
    }
  ]);

  // Attendance log data
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([
    { id: 'att1', date: '15 Apr 2025', route: 'Kattur → IT Park', vehicle: 'Van TN-XX-7890', driver: 'Selvam', timing: '8:00 AM - 8:15 AM', status: 'BOARDED', punctuality: 'On Time' },
    { id: 'att2', date: '14 Apr 2025', route: 'Lawspet → IT Park', vehicle: 'Van TN-XX-2234', driver: 'Ramesh', timing: '7:50 AM - 8:20 AM', status: 'BOARDED', punctuality: 'On Time' },
  ]);

  useEffect(() => {
    studentWorkApi.getStudentRoutes(studentSearchCollege, studentSearchPickup).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id || 'sr1',
          title: d.vehicle || 'Van TN-XX-5678',
          type: d.vehicleType || '7 Seater • AC',
          rating: d.rating || 4.6,
          reviews: d.reviewCount || 100,
          price: d.priceMonthly || 1800,
          seatsLeft: d.availableSeats || 2,
          driver: d.driver || 'Rajesh Kumar',
          from: studentSearchPickup,
          to: studentSearchCollege,
          time: d.timing || '7:40 AM - 8:15 AM',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200',
        }));
        setStudentRoutes(mapped);
      }
    }).catch(() => {});

    studentWorkApi.getProfessionalRoutes(proSearchCompany, proSearchPickup).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((d: any) => ({
          id: d.id || 'pr1',
          title: d.vehicle || 'Van TN-XX-7890',
          type: d.vehicleType || '7 Seater • AC',
          rating: d.rating || 4.7,
          reviews: d.reviewCount || 90,
          price: d.priceMonthly || 3200,
          seatsLeft: d.availableSeats || 2,
          driver: d.driver || 'Selvam',
          from: proSearchPickup,
          to: proSearchCompany,
          time: d.timing || '7:30 AM - 8:15 AM',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200',
        }));
        setProRoutes(mapped);
      }
    }).catch(() => {});

    studentWorkApi.getAttendanceLogs('aravind@safepassage.ai').then(logs => {
      if (Array.isArray(logs) && logs.length > 0) {
        setAttendanceLogs(logs);
      }
    }).catch(() => {});
  }, []);

  const handleBookStudentSeat = async () => {
    try {
      await studentWorkApi.bookSeat('student@safepassage.ai', selectedRoute?.id || 'sr1', studentSubPlan);
    } catch (e) {
      console.log('Book student seat in demo mode');
    }
    setStudentTab('CONFIRMATION');
  };

  const attendanceRecords = [
    { id: 'att1', date: '15 Apr 2026', time: '8:00 AM - 8:15 AM', route: 'Kattur -> IT Park', vehicle: 'Van TN-XX-7890 • Selvam', status: 'Boarded', onTime: true },
    { id: 'att2', date: '14 Apr 2026', time: '7:50 AM - 8:20 AM', route: 'Lawspet -> IT Park', vehicle: 'Van TN-XX-2234 • Ramesh', status: 'Boarded', onTime: true },
    { id: 'att3', date: '11 Apr 2026', time: '8:10 AM - 8:40 AM', route: 'Ariyankuppam -> IT Park', vehicle: 'Car TN-XX-4478 • Karthik', status: 'Boarded', onTime: false }
  ];

  // ==========================================
  // STUDENT SUB-VIEWS
  // ==========================================

  const renderStudentHome = () => (
    <View>
      {/* Student Profile Top Banner */}
      <View style={styles.topProfileBar}>
        <View style={styles.profileInfoRow}>
          <Avatar.Image size={46} source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' }} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.welcomeGreeting}>Hello, Priya S 🎓</Text>
            <Text style={styles.subGreeting}>ABC Engineering College • 2nd Year - CSE</Text>
          </View>
        </View>
        <IconButton icon="bell-outline" iconColor="#38bdf8" size={22} onPress={() => Alert.alert('Notifications', 'No new alerts.')} />
      </View>

      {/* Current Ride Live Card */}
      <Card style={styles.currentRideCard}>
        <Card.Content>
          <View style={styles.rideCardHeader}>
            <View>
              <Text style={styles.rideBadgeLabel}>CURRENT RIDE</Text>
              <Text style={styles.rideRouteText}>Kattur ➔ ABC College</Text>
            </View>
            <Chip style={styles.onRouteChip} textStyle={styles.onRouteText}>On Route</Chip>
          </View>
          <Divider style={styles.innerDivider} />
          <View style={styles.rideMetaRow}>
            <View>
              <Text style={styles.metaLabel}>VEHICLE NO</Text>
              <Text style={styles.metaVal}>TN-XX-5678</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>DRIVER</Text>
              <Text style={styles.metaVal}>Rajesh Kumar</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>ETA</Text>
              <Text style={[styles.metaVal, { color: '#38bdf8' }]}>12 min</Text>
            </View>
          </View>
          <Button 
            mode="contained" 
            style={[styles.actionBtn, { marginTop: 14 }]} 
            buttonColor="#2563eb"
            icon="crosshairs-gps"
            onPress={() => setStudentTab('TRACKING')}
          >
            Live GPS Tracking
          </Button>
        </Card.Content>
      </Card>

      {/* Grid Quick Navigation (Screens 2-9) */}
      <Text style={styles.gridSectionHeader}>Commuter Services</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity style={[styles.gridBtn, { borderColor: '#38bdf860', backgroundColor: '#38bdf810' }]} onPress={() => setStudentTab('SINGLE_TRIP')}>
          <IconButton icon="lightning-bolt" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={[styles.gridBtnTitle, { color: '#38bdf8', fontWeight: 'bold' }]}>⚡ Single Trip (₹35)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setStudentTab('FIND')}>
          <IconButton icon="magnify" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Find Transport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setStudentTab('ROUTES')}>
          <IconButton icon="bus" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Available Routes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setStudentTab('SUBSCRIPTION')}>
          <IconButton icon="ticket-percent" iconColor="#10b981" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Subscriptions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setStudentTab('TRACKING')}>
          <IconButton icon="map-marker-radius" iconColor="#f59e0b" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Live Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setStudentTab('PAYMENTS')}>
          <IconButton icon="credit-card-check" iconColor="#8b5cf6" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Payments</Text>
        </TouchableOpacity>
      </View>

      {/* Safety Banner */}
      <Card style={styles.safetyBannerCard}>
        <Card.Content>
          <Text style={styles.safetyBannerTitle}>Safe Rides, Bright Future</Text>
          <Text style={styles.safetyBannerSub}>Verified Drivers • GPS Tracking • SOS 24/7 Support</Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentFind = () => (
    <View>
      <Text style={styles.pageTitle}>Find Transport</Text>
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>COLLEGE / INSTITUTION</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={studentSearchCollege} 
              onChangeText={setStudentSearchCollege} 
            />
          </View>
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>PICKUP LOCATION</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={studentSearchPickup} 
              onChangeText={setStudentSearchPickup} 
            />
          </View>
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>PREFERRED TIME</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={studentSearchTime} 
              onChangeText={setStudentSearchTime} 
            />
          </View>
          <Button 
            mode="contained" 
            buttonColor="#2563eb" 
            style={{ marginTop: 16, borderRadius: 8 }}
            onPress={() => setStudentTab('ROUTES')}
          >
            Search Transport
          </Button>
        </Card.Content>
      </Card>

      <Text style={[styles.gridSectionHeader, { marginTop: 20 }]}>Recent Searches</Text>
      <Card style={styles.cardBox}>
        <Card.Content>
          <TouchableOpacity onPress={() => setStudentTab('ROUTES')}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kattur ➔ ABC College</Text>
            <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>Today, 8:00 AM</Text>
          </TouchableOpacity>
          <Divider style={styles.innerDivider} />
          <TouchableOpacity onPress={() => setStudentTab('ROUTES')}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lawspet ➔ ABC College</Text>
            <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>Yesterday, 8:00 AM</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentRoutes = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('FIND')} />
        <Text style={styles.pageTitle}>Available Routes</Text>
      </View>
      {studentRoutes.map(route => (
        <Card key={route.id} style={[styles.cardBox, { marginBottom: 14 }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{route.title}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{route.type} • ★ {route.rating} ({route.reviews})</Text>
                <Text style={{ color: '#38bdf8', fontSize: 12, marginTop: 4 }}>{route.from} ➔ {route.to}</Text>
                <Text style={{ color: '#6b7280', fontSize: 11 }}>{route.time}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>₹{route.price}<Text style={{ fontSize: 10, color: '#9ca3af' }}>/mo</Text></Text>
                <Chip style={{ backgroundColor: '#10b98115', marginTop: 4 }} textStyle={{ color: '#10b981', fontSize: 9 }}>{route.seatsLeft} seats left</Chip>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <Text style={{ color: '#9ca3af', fontSize: 11 }}>Driver: {route.driver} (Verified)</Text>
              <Button 
                mode="contained" 
                buttonColor="#2563eb" 
                style={{ borderRadius: 6, height: 32, justifyContent: 'center' }} 
                labelStyle={{ fontSize: 11 }}
                onPress={() => {
                  setSelectedRoute(route);
                  setStudentTab('DETAILS');
                }}
              >
                View Details
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  const renderStudentDetails = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('ROUTES')} />
        <Text style={styles.pageTitle}>Route Details</Text>
      </View>
      <Card style={styles.cardBox}>
        <Card.Content>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold' }}>Van TN-XX-5678</Text>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>7 Seater • AC • ★ 4.6 (124 reviews)</Text>
          
          <Divider style={styles.innerDivider} />
          <Text style={styles.fieldLabel}>ROUTE STOPS</Text>
          <Text style={{ color: '#38bdf8', fontSize: 13, marginTop: 4 }}>Kattur ➔ Lawspet ➔ Ariyankuppam ➔ ABC College</Text>
          <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>Operating Hours: 7:40 AM - 8:15 AM</Text>

          <Divider style={styles.innerDivider} />
          <Text style={styles.fieldLabel}>AMENITIES</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {['AC', 'GPS Tracking', 'Safe & Verified', 'CCTV'].map((a, i) => (
              <Chip key={i} style={{ backgroundColor: '#1e293b' }} textStyle={{ color: '#38bdf8', fontSize: 10 }}>{a}</Chip>
            ))}
          </View>

          <Button 
            mode="contained" 
            buttonColor="#2563eb" 
            style={{ marginTop: 20, borderRadius: 8 }}
            onPress={() => setStudentTab('SUBSCRIPTION')}
          >
            Select Subscription Plan
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentSubscription = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('DETAILS')} />
        <Text style={styles.pageTitle}>Subscription Plan</Text>
      </View>
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {(['Monthly', 'Weekly', 'Quarterly'] as const).map(p => (
              <Button 
                key={p} 
                mode={studentSubPlan === p ? 'contained' : 'outlined'} 
                buttonColor={studentSubPlan === p ? '#2563eb' : 'transparent'}
                textColor={studentSubPlan === p ? '#fff' : '#9ca3af'}
                style={{ flex: 1, borderRadius: 6 }}
                onPress={() => setStudentSubPlan(p)}
              >
                {p}
              </Button>
            ))}
          </View>

          <View style={{ backgroundColor: '#070b13', padding: 16, borderRadius: 8 }}>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>{studentSubPlan} Plan</Text>
            <Text style={{ color: '#10b981', fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>
              ₹{studentSubPlan === 'Monthly' ? '1,800' : studentSubPlan === 'Weekly' ? '500' : '5,000'}
              <Text style={{ fontSize: 12, color: '#9ca3af' }}> /period</Text>
            </Text>
            <Text style={{ color: '#fff', fontSize: 12, marginTop: 8 }}>✓ 5 days per week (Mon - Fri)</Text>
            <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>✓ Flexible cancellation</Text>
            <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>✓ Live tracking & push notifications</Text>
            <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>✓ 24/7 Priority student support</Text>
          </View>

          <Button 
            mode="contained" 
            buttonColor="#10b981" 
            textColor="#0f172a" 
            style={{ marginTop: 18, borderRadius: 8 }}
            onPress={handleBookStudentSeat}
          >
            Subscribe Now
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentConfirmation = () => (
    <View>
      <Card style={[styles.cardBox, { alignItems: 'center' }]}>
        <Card.Content style={{ alignItems: 'center' }}>
          <IconButton icon="check-circle" iconColor="#10b981" size={54} />
          <Text style={{ color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>Subscription Successful!</Text>
          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
            Your student transport subscription has been activated for ABC Engineering College.
          </Text>

          <View style={{ backgroundColor: '#070b13', width: '100%', padding: 14, borderRadius: 8, marginTop: 16 }}>
            <Text style={{ color: '#9ca3af', fontSize: 11 }}>ROUTE</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kattur ➔ ABC College</Text>
            <Divider style={styles.innerDivider} />
            <Text style={{ color: '#9ca3af', fontSize: 11 }}>VEHICLE</Text>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Van TN-XX-5678</Text>
            <Divider style={styles.innerDivider} />
            <Text style={{ color: '#9ca3af', fontSize: 11 }}>ACTIVE PERIOD</Text>
            <Text style={{ color: '#38bdf8', fontWeight: 'bold' }}>15 Apr 2026 - 14 May 2026</Text>
          </View>

          <Button 
            mode="contained" 
            buttonColor="#2563eb" 
            style={{ width: '100%', marginTop: 16, borderRadius: 8 }}
            onPress={() => setStudentTab('TRACKING')}
          >
            View Live Tracking
          </Button>
          <Button 
            mode="text" 
            textColor="#9ca3af" 
            style={{ marginTop: 8 }}
            onPress={() => setStudentTab('HOME')}
          >
            Go to Home
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentTracking = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('HOME')} />
        <Text style={styles.pageTitle}>Live Vehicle Tracking</Text>
      </View>
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Van TN-XX-5678</Text>
              <Text style={{ color: '#38bdf8', fontSize: 12 }}>ETA: 12 min (Arriving at 8:10 AM)</Text>
            </View>
            <Chip style={styles.onRouteChip} textStyle={styles.onRouteText}>On Route</Chip>
          </View>

          {/* Map Simulation Box */}
          <View style={styles.mapBox}>
            <IconButton icon="map-marker-radius" iconColor="#38bdf8" size={36} />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Kattur ➔ 2.4 km away ➔ ABC College</Text>
            <Text style={{ color: '#9ca3af', fontSize: 10, marginTop: 2 }}>GPS Signal: High Accuracy • Speed: 34 km/h</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar.Image size={38} source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' }} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Rajesh Kumar</Text>
                <Text style={{ color: '#9ca3af', fontSize: 11 }}>Driver • ★ 4.6</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Button mode="contained-tonal" icon="phone" onPress={() => Alert.alert('Calling Driver', 'Calling Rajesh Kumar at +91 98765 43210')} style={{ borderRadius: 6 }}>Call</Button>
              <Button mode="contained-tonal" icon="share-variant" onPress={() => Alert.alert('Share Location', 'Tracking link copied!')} style={{ borderRadius: 6 }}>Share</Button>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentPayments = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('HOME')} />
        <Text style={styles.pageTitle}>Student Payments</Text>
      </View>
      <Card style={styles.cardBox}>
        <Card.Content>
          <Text style={styles.fieldLabel}>CURRENT ACTIVE PLAN</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Monthly College Pass</Text>
              <Text style={{ color: '#9ca3af', fontSize: 11 }}>Valid until 14 May 2026</Text>
            </View>
            <Text style={{ color: '#10b981', fontSize: 18, fontWeight: 'bold' }}>₹1,800</Text>
          </View>
          <Divider style={styles.innerDivider} />
          <Text style={styles.fieldLabel}>PAYMENT HISTORY</Text>
          {[
            { date: '15 Apr 2026', amount: '₹1,800', status: 'Paid', method: 'UPI' },
            { date: '15 Mar 2026', amount: '₹1,800', status: 'Paid', method: 'Net Banking' },
            { date: '15 Feb 2026', amount: '₹1,800', status: 'Paid', method: 'UPI' }
          ].map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <View>
                <Text style={{ color: '#fff', fontWeight: '600' }}>{item.date}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 10 }}>{item.method}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.amount}</Text>
                <Chip style={{ backgroundColor: '#10b98115', height: 20 }} textStyle={{ color: '#10b981', fontSize: 8 }}>{item.status}</Chip>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </View>
  );

  const renderStudentProfile = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setStudentTab('HOME')} />
        <Text style={styles.pageTitle}>Profile & Settings</Text>
      </View>
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Avatar.Image size={64} source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120' }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 8 }}>Priya S</Text>
            <Text style={{ color: '#9ca3af', fontSize: 11 }}>priya.s@abcuniv.edu • +91 98765 43210</Text>
          </View>

          {[
            { icon: 'account-outline', label: 'My Student Profile' },
            { icon: 'bell-outline', label: 'Notification Settings' },
            { icon: 'shield-check-outline', label: 'Safety & Emergency Contacts' },
            { icon: 'help-circle-outline', label: 'Help & Support' },
            { icon: 'information-outline', label: 'About SchoolCab App' }
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.settingItem} onPress={() => Alert.alert(item.label, 'Setting details opened.')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon={item.icon} iconColor="#38bdf8" size={20} style={{ margin: 0, marginRight: 8 }} />
                <Text style={{ color: '#fff', fontSize: 13 }}>{item.label}</Text>
              </View>
              <IconButton icon="chevron-right" iconColor="#6b7280" size={18} />
            </TouchableOpacity>
          ))}

          <Button mode="outlined" textColor="#ef4444" style={{ marginTop: 16, borderColor: '#ef444450' }} onPress={() => Alert.alert('Logout', 'Logged out successfully.')}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  // ==========================================
  // WORKING PROFESSIONAL SUB-VIEWS
  // ==========================================

  const renderProHome = () => (
    <View>
      <View style={styles.topProfileBar}>
        <View style={styles.profileInfoRow}>
          <Avatar.Image size={46} source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' }} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.welcomeGreeting}>Good Morning, Aravind 💼</Text>
            <Text style={styles.subGreeting}>ABC Technologies • Software Engineer</Text>
          </View>
        </View>
        <IconButton icon="bell-outline" iconColor="#38bdf8" size={22} onPress={() => Alert.alert('Notifications', 'No new alerts.')} />
      </View>

      <Card style={styles.currentRideCard}>
        <Card.Content>
          <View style={styles.rideCardHeader}>
            <View>
              <Text style={styles.rideBadgeLabel}>TODAY'S COMMUTE</Text>
              <Text style={styles.rideRouteText}>Kattur ➔ IT Park, Chennai</Text>
            </View>
            <Chip style={styles.onRouteChip} textStyle={styles.onRouteText}>On Route</Chip>
          </View>
          <Divider style={styles.innerDivider} />
          <View style={styles.rideMetaRow}>
            <View>
              <Text style={styles.metaLabel}>VEHICLE NO</Text>
              <Text style={styles.metaVal}>TN-XX-7890</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>DRIVER</Text>
              <Text style={styles.metaVal}>Selvam</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>ETA</Text>
              <Text style={[styles.metaVal, { color: '#38bdf8' }]}>15 min</Text>
            </View>
          </View>
          <Button 
            mode="contained" 
            style={[styles.actionBtn, { marginTop: 14 }]} 
            buttonColor="#2563eb"
            icon="crosshairs-gps"
            onPress={() => setProTab('TRACKING')}
          >
            Live Tracking
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.gridSectionHeader}>Corporate Services</Text>
      <View style={styles.quickGrid}>
        <TouchableOpacity style={[styles.gridBtn, { borderColor: '#38bdf860', backgroundColor: '#38bdf810' }]} onPress={() => setProTab('SINGLE_TRIP')}>
          <IconButton icon="lightning-bolt" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={[styles.gridBtnTitle, { color: '#38bdf8', fontWeight: 'bold' }]}>⚡ Single Trip (₹35)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setProTab('FIND')}>
          <IconButton icon="briefcase-search" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Find Transport</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setProTab('ROUTES')}>
          <IconButton icon="routes" iconColor="#38bdf8" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Available Routes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setProTab('ATTENDANCE')}>
          <IconButton icon="clipboard-check" iconColor="#10b981" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Attendance Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setProTab('TRACKING')}>
          <IconButton icon="map-marker-radius" iconColor="#f59e0b" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Live Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => setProTab('HISTORY')}>
          <IconButton icon="history" iconColor="#8b5cf6" size={24} style={styles.gridIcon} />
          <Text style={styles.gridBtnTitle}>Trip History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProFind = () => (
    <View>
      <Text style={styles.pageTitle}>Find Work Transport</Text>
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>OFFICE / COMPANY</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={proSearchCompany} 
              onChangeText={setProSearchCompany} 
            />
          </View>
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>PICKUP LOCATION</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={proSearchPickup} 
              onChangeText={setProSearchPickup} 
            />
          </View>
          <Button 
            mode="contained" 
            buttonColor="#2563eb" 
            style={{ marginTop: 16, borderRadius: 8 }}
            onPress={() => setProTab('ROUTES')}
          >
            Search Work Routes
          </Button>
        </Card.Content>
      </Card>
    </View>
  );

  const renderProRoutes = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton icon="arrow-left" iconColor="#fff" size={22} onPress={() => setProTab('FIND')} />
        <Text style={styles.pageTitle}>Available Corporate Routes</Text>
      </View>
      {proRoutes.map(route => (
        <Card key={route.id} style={[styles.cardBox, { marginBottom: 14 }]}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{route.title}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>{route.type} • ★ {route.rating} ({route.reviews})</Text>
                <Text style={{ color: '#38bdf8', fontSize: 12, marginTop: 4 }}>{route.from} ➔ {route.to}</Text>
                <Text style={{ color: '#6b7280', fontSize: 11 }}>{route.time}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#10b981', fontSize: 16, fontWeight: 'bold' }}>₹{route.price}<Text style={{ fontSize: 10, color: '#9ca3af' }}>/mo</Text></Text>
                <Chip style={{ backgroundColor: '#10b98115', marginTop: 4 }} textStyle={{ color: '#10b981', fontSize: 9 }}>{route.seatsLeft} seats left</Chip>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <Text style={{ color: '#9ca3af', fontSize: 11 }}>Driver: {route.driver} (Verified)</Text>
              <Button 
                mode="contained" 
                buttonColor="#2563eb" 
                style={{ borderRadius: 6, height: 32, justifyContent: 'center' }} 
                labelStyle={{ fontSize: 11 }}
                onPress={() => setProTab('SUBSCRIPTION')}
              >
                View Plan
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  // ==========================================
  // ON-DEMAND SINGLE TRIP VIEW (2 KM = ₹35)
  // ==========================================

  const renderSingleTripView = () => (
    <View>
      <View style={styles.headerWithBack}>
        <IconButton 
          icon="arrow-left" 
          iconColor="#fff" 
          size={22} 
          onPress={() => moduleMode === 'STUDENT' ? setStudentTab('HOME') : setProTab('HOME')} 
        />
        <View>
          <Text style={styles.pageTitle}>Single Trip • Instant Ride</Text>
          <Text style={{ color: '#10b981', fontSize: 10, fontWeight: 'bold' }}>⚡ Guaranteed ₹35 for first 2.0 km</Text>
        </View>
      </View>

      {/* Pickup & Destination Form */}
      <Card style={styles.cardBox}>
        <Card.Content>
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>📍 PICKUP POINT</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={singlePickup} 
              onChangeText={setSinglePickup} 
              placeholder="e.g. Mehta Nagar Anna Arch Gate"
              placeholderTextColor="#6b7280"
            />
          </View>
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.fieldLabel}>🏫 DESTINATION / DROP LOCATION</Text>
            <TextInput 
              style={styles.inputStyle} 
              value={singleDrop} 
              onChangeText={setSingleDrop} 
              placeholder="e.g. Green Valley Campus / IT Park"
              placeholderTextColor="#6b7280"
            />
          </View>

          {/* Distance Selector with ₹35 Pricing Rule */}
          <Text style={[styles.fieldLabel, { marginTop: 16, marginBottom: 8 }]}>SELECT ESTIMATED DISTANCE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {[
              { dist: 1.5, label: '1.5 km (₹35)' },
              { dist: 2.0, label: '2.0 km (₹35 Base)' },
              { dist: 3.5, label: '3.5 km (₹56)' },
              { dist: 5.0, label: '5.0 km (₹77)' },
              { dist: 8.0, label: '8.0 km (₹119)' },
            ].map((item) => (
              <TouchableOpacity
                key={item.dist}
                onPress={() => handleDistanceChange(item.dist)}
                style={[
                  styles.distChip,
                  singleDistance === item.dist && styles.distChipActive
                ]}
              >
                <Text style={[styles.distChipText, singleDistance === item.dist && styles.distChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vehicle Type Selector */}
          <Text style={[styles.fieldLabel, { marginTop: 16, marginBottom: 8 }]}>VEHICLE TYPE</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { type: 'VAN', name: 'Van (7 Seater AC)', icon: 'van-utility' },
              { type: 'CAB', name: 'Cab (Sedan AC)', icon: 'car' },
              { type: 'AUTO', name: 'Eco Shuttle', icon: 'moped' },
            ].map(v => (
              <TouchableOpacity
                key={v.type}
                onPress={() => setSingleVehicleType(v.type as any)}
                style={[
                  styles.vehicleTypeCard,
                  singleVehicleType === v.type && styles.vehicleTypeCardActive
                ]}
              >
                <IconButton icon={v.icon} iconColor={singleVehicleType === v.type ? '#38bdf8' : '#9ca3af'} size={20} style={{ margin: 0 }} />
                <Text style={[styles.vehicleTypeName, singleVehicleType === v.type && styles.vehicleTypeNameActive]}>{v.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transparent Dynamic Fare Breakdown */}
          <View style={styles.fareBreakdownBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: 'bold' }}>TOTAL TRIP FARE</Text>
                <Text style={{ color: '#10b981', fontSize: 24, fontWeight: 'bold' }}>₹{singleFare}.00</Text>
              </View>
              <Chip style={{ backgroundColor: '#10b98120' }} textStyle={{ color: '#10b981', fontSize: 9, fontWeight: 'bold' }}>
                ₹35 for 2.0 km Verified
              </Chip>
            </View>
            <Divider style={styles.innerDivider} />
            <Text style={{ color: '#94a3b8', fontSize: 10 }}>
              {singleDistance <= 2.0 
                ? '• Flat ₹35 base fare applies for rides up to 2.0 km' 
                : `• Base fare ₹35 (first 2 km) + ₹${Math.round((singleDistance - 2.0) * 14)} (${(singleDistance - 2.0).toFixed(1)} km @ ₹14/km)`}
            </Text>
          </View>

          {/* Request Button or Active Ride Status */}
          {singleTripStatus === 'IDLE' && (
            <Button
              mode="contained"
              buttonColor="#2563eb"
              textColor="#fff"
              icon="radar"
              style={{ marginTop: 16, borderRadius: 8, paddingVertical: 4 }}
              labelStyle={{ fontWeight: 'bold', fontSize: 13 }}
              onPress={handleRequestSingleTrip}
            >
              Request Single Trip • ₹{singleFare}
            </Button>
          )}

          {singleTripStatus === 'DISPATCHING' && (
            <View style={styles.dispatchingBox}>
              <Avatar.Icon size={44} icon="car-electric" style={{ backgroundColor: '#38bdf820' }} color="#38bdf8" />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>Searching Nearest Drivers...</Text>
              <Text style={{ color: '#9ca3af', fontSize: 11, textAlign: 'center', marginTop: 4 }}>
                Broadcasting dispatch alert to cabs within {singleDistance} km (45s acceptance window).
              </Text>
            </View>
          )}

          {singleTripStatus !== 'IDLE' && singleTripStatus !== 'DISPATCHING' && (
            <View style={{ marginTop: 16 }}>
              {/* Assigned Driver Card */}
              <View style={styles.assignedDriverCard}>
                <Avatar.Image size={44} source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>Kumar Swamy ⭐ 4.9</Text>
                  <Text style={{ color: '#38bdf8', fontSize: 11 }}>Force Cruiser • TN 01 AB 1234</Text>
                  <Text style={{ color: '#10b981', fontSize: 10, fontWeight: 'bold', marginTop: 2 }}>Arriving in 3 mins</Text>
                </View>
                <IconButton icon="phone" iconColor="#10b981" size={24} onPress={() => Alert.alert('Call Driver', 'Calling Kumar Swamy at +91 98401 23456')} />
              </View>

              {/* 2-Step OTP Verification Box */}
              <View style={styles.twoStepOtpCard}>
                <Text style={{ color: '#38bdf8', fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>
                  🔒 2-STEP DUAL OTP SECURITY PROTOCOL
                </Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {/* Step 1: Pickup Boarding OTP */}
                  <View style={styles.otpColumn}>
                    <Text style={styles.otpColumnLabel}>1. BOARDING OTP</Text>
                    <View style={styles.otpDigitsRow}>
                      {singleBoardingOtp.split('').map((d, i) => (
                        <View key={i} style={styles.otpSquare}>
                          <Text style={styles.otpSquareText}>{d}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.otpColumnHint}>Share with driver when cab arrives to start ride.</Text>
                  </View>

                  {/* Step 2: Drop Off Completion OTP */}
                  <View style={styles.otpColumn}>
                    <Text style={[styles.otpColumnLabel, { color: '#f59e0b' }]}>2. DROP / SAFETY OTP</Text>
                    <View style={styles.otpDigitsRow}>
                      {singleDropOtp.split('').map((d, i) => (
                        <View key={i} style={[styles.otpSquare, { borderColor: '#f59e0b' }]}>
                          <Text style={[styles.otpSquareText, { color: '#f59e0b' }]}>{d}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.otpColumnHint}>Share at destination to confirm safe arrival.</Text>
                  </View>
                </View>
              </View>

              {/* Live In-Transit HUD */}
              <View style={styles.telematicsHud}>
                <View style={styles.hudStat}>
                  <Text style={styles.hudStatLabel}>SPEED</Text>
                  <Text style={styles.hudStatVal}>36 km/h</Text>
                </View>
                <View style={styles.hudDivider} />
                <View style={styles.hudStat}>
                  <Text style={styles.hudStatLabel}>DISTANCE</Text>
                  <Text style={styles.hudStatVal}>{singleDistance} km</Text>
                </View>
                <View style={styles.hudDivider} />
                <View style={styles.hudStat}>
                  <Text style={styles.hudStatLabel}>TRIP FARE</Text>
                  <Text style={[styles.hudStatVal, { color: '#10b981' }]}>₹{singleFare}</Text>
                </View>
              </View>

              {/* Razorpay Settlement Button */}
              <Button
                mode="contained"
                buttonColor={razorpayPaid ? '#10b981' : '#3B49DF'}
                textColor="#fff"
                icon={razorpayPaid ? 'check-circle' : 'qrcode-scan'}
                style={{ marginTop: 14, borderRadius: 8, paddingVertical: 4 }}
                labelStyle={{ fontWeight: 'bold' }}
                onPress={() => setIsRazorpayModalVisible(true)}
              >
                {razorpayPaid ? 'Paid via Razorpay QR (Settled)' : `Pay ₹${singleFare} via Razorpay Dynamic QR`}
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Razorpay Dynamic UPI & QR Payment Modal */}
      <Modal
        visible={isRazorpayModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRazorpayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.razorpayModalCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar.Icon size={32} icon="shield-check" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }} color="#38bdf8" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Razorpay Smart Pay</Text>
              </View>
              <IconButton icon="close" iconColor="#9ca3af" size={20} onPress={() => setIsRazorpayModalVisible(false)} />
            </View>

            <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>
              Scan QR code with any UPI app to transfer ₹{singleFare} directly to driver wallet.
            </Text>

            {/* Stylized QR Canvas Box */}
            <View style={styles.qrCodeBox}>
              <View style={styles.qrGridPattern}>
                <IconButton icon="qrcode" iconColor="#fff" size={88} style={{ margin: 0 }} />
              </View>
              <Text style={{ color: '#38bdf8', fontSize: 13, fontWeight: 'bold', marginTop: 8 }}>
                UPI ID: safepassage.driver@icici
              </Text>
              <Text style={{ color: '#10b981', fontSize: 18, fontWeight: 'bold', marginTop: 2 }}>
                ₹{singleFare}.00
              </Text>
            </View>

            {/* Instant Payment Direct Action */}
            <Button
              mode="contained"
              buttonColor="#10b981"
              textColor="#fff"
              icon="check-decagram"
              style={{ marginTop: 14, borderRadius: 8 }}
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                setRazorpayPaid(true);
                setIsRazorpayModalVisible(false);
                Alert.alert('Payment Successful 🎉', `₹${singleFare} paid via Razorpay QR.\nAmount credited directly to Kumar Swamy's driver wallet.`);
              }}
            >
              Simulate Instant UPI QR Payment
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Global Module Switcher */}
      <View style={styles.moduleSwitcherContainer}>
        <Button 
          mode={moduleMode === 'STUDENT' ? 'contained' : 'outlined'} 
          buttonColor={moduleMode === 'STUDENT' ? '#38bdf8' : 'transparent'}
          textColor={moduleMode === 'STUDENT' ? '#070b13' : '#9ca3af'}
          style={styles.moduleSwitchBtn}
          labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
          onPress={() => setModuleMode('STUDENT')}
        >
          🎓 Student Module
        </Button>
        <Button 
          mode={moduleMode === 'PROFESSIONAL' ? 'contained' : 'outlined'} 
          buttonColor={moduleMode === 'PROFESSIONAL' ? '#38bdf8' : 'transparent'}
          textColor={moduleMode === 'PROFESSIONAL' ? '#070b13' : '#9ca3af'}
          style={styles.moduleSwitchBtn}
          labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
          onPress={() => setModuleMode('PROFESSIONAL')}
        >
          💼 Working Professional
        </Button>
      </View>

      {/* STUDENT SCREENS */}
      {moduleMode === 'STUDENT' && (
        <View>
          {studentTab === 'HOME' && renderStudentHome()}
          {studentTab === 'SINGLE_TRIP' && renderSingleTripView()}
          {studentTab === 'FIND' && renderStudentFind()}
          {studentTab === 'ROUTES' && renderStudentRoutes()}
          {studentTab === 'DETAILS' && renderStudentDetails()}
          {studentTab === 'SUBSCRIPTION' && renderStudentSubscription()}
          {studentTab === 'CONFIRMATION' && renderStudentConfirmation()}
          {studentTab === 'TRACKING' && renderStudentTracking()}
          {studentTab === 'PAYMENTS' && renderStudentPayments()}
          {studentTab === 'PROFILE' && renderStudentProfile()}
        </View>
      )}

      {/* WORKING PROFESSIONAL SCREENS */}
      {moduleMode === 'PROFESSIONAL' && (
        <View>
          {proTab === 'HOME' && renderProHome()}
          {proTab === 'SINGLE_TRIP' && renderSingleTripView()}
          {proTab === 'FIND' && renderProFind()}
          {proTab === 'ROUTES' && renderProRoutes()}
          {proTab === 'SUBSCRIPTION' && renderStudentSubscription()}
          {proTab === 'TRACKING' && renderStudentTracking()}
          {proTab === 'ATTENDANCE' && renderProAttendance()}
          {proTab === 'HISTORY' && renderStudentPayments()}
          {proTab === 'PROFILE' && renderStudentProfile()}
        </View>
      )}

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
    paddingBottom: 40,
  },
  moduleSwitcherContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    backgroundColor: '#111827',
    padding: 6,
    borderRadius: 10,
  },
  moduleSwitchBtn: {
    flex: 1,
    borderRadius: 8,
  },
  topProfileBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeGreeting: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  currentRideCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 20,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rideBadgeLabel: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rideRouteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  onRouteChip: {
    backgroundColor: '#10b98120',
    height: 24,
  },
  onRouteText: {
    color: '#10b981',
    fontSize: 9,
    fontWeight: 'bold',
  },
  innerDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  rideMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    color: '#9ca3af',
    fontSize: 9,
    fontWeight: 'bold',
  },
  metaVal: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  actionBtn: {
    borderRadius: 8,
  },
  gridSectionHeader: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  gridBtn: {
    width: '31%',
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridIcon: {
    margin: 0,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  gridBtnTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  safetyBannerCard: {
    backgroundColor: '#1e3a8a30',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf840',
  },
  safetyBannerTitle: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  safetyBannerSub: {
    color: '#9ca3af',
    fontSize: 10,
    marginTop: 4,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardBox: {
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  inputGroup: {
    backgroundColor: '#070b13',
    padding: 8,
    borderRadius: 6,
  },
  fieldLabel: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  inputStyle: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    padding: 0,
  },
  mapBox: {
    backgroundColor: '#070b13',
    height: 140,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  distChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#070b13',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  distChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
  },
  distChipText: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
  },
  distChipTextActive: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  vehicleTypeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#070b13',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  vehicleTypeCardActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  vehicleTypeName: {
    color: '#9ca3af',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  vehicleTypeNameActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fareBreakdownBox: {
    backgroundColor: '#070b13',
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  dispatchingBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#070b13',
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#38bdf840',
  },
  assignedDriverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070b13',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 12,
  },
  twoStepOtpCard: {
    backgroundColor: '#070b13',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 12,
  },
  otpColumn: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 8,
    borderRadius: 8,
  },
  otpColumnLabel: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  otpDigitsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  otpSquare: {
    flex: 1,
    height: 32,
    backgroundColor: '#070b13',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpSquareText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  otpColumnHint: {
    color: '#9ca3af',
    fontSize: 8,
    lineHeight: 11,
  },
  telematicsHud: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#070b13',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  hudStat: {
    alignItems: 'center',
  },
  hudStatLabel: {
    color: '#6b7280',
    fontSize: 9,
    fontWeight: 'bold',
  },
  hudStatVal: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 2,
  },
  hudDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  razorpayModalCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#38bdf840',
  },
  qrCodeBox: {
    alignItems: 'center',
    backgroundColor: '#070b13',
    borderRadius: 12,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  qrGridPattern: {
    backgroundColor: '#1e293b',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
});
