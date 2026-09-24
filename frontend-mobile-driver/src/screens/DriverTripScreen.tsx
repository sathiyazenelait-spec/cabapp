import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  Vibration,
  Platform,
} from 'react-native';
import { Text, Card, Avatar, Button, IconButton, ProgressBar } from 'react-native-paper';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import { singleTripApi } from '../services/api';

interface SingleTripData {
  id: number;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  pickupAddress: string;
  dropAddress: string;
  fare: number;
  otpCode: string;
  dropOtpCode?: string;
  status: 'REQUESTED' | 'DISPATCHED_45S' | 'ACCEPTED' | 'ARRIVED' | 'IN_PROGRESS' | 'AWAITING_DROP_OTP' | 'COMPLETED' | 'DECLINED';
  distanceKm: number;
  etaMins: number;
  paymentSettled?: boolean;
}

export const DriverTripScreen: React.FC = () => {
  // Trip State
  const [activeTrip, setActiveTrip] = useState<SingleTripData | null>(null);
  const [countdown, setCountdown] = useState<number>(45);
  const [showIncomingModal, setShowIncomingModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [audioAlertActive, setAudioAlertActive] = useState<boolean>(true);
  const [showRazorpaySheet, setShowRazorpaySheet] = useState<boolean>(false);

  // Speedometer & In-trip live simulation
  const [currentSpeed, setCurrentSpeed] = useState<number>(36);
  const [tripElapsedSecs, setTripElapsedSecs] = useState<number>(0);
  const [distanceRemaining, setDistanceRemaining] = useState<number>(2.0);
  const [speedWarning, setSpeedWarning] = useState<boolean>(false);

  // Animation Refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bellShakeAnim = useRef(new Animated.Value(0)).current;
  const speedAnim = useRef(new Animated.Value(36)).current;

  // Pulse animation for incoming overlay
  useEffect(() => {
    if (showIncomingModal) {
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      const shakeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(bellShakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
          Animated.timing(bellShakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
          Animated.timing(bellShakeAnim, { toValue: 6, duration: 80, useNativeDriver: true }),
          Animated.timing(bellShakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
          Animated.delay(400),
        ])
      );
      shakeLoop.start();

      return () => {
        pulseLoop.stop();
        shakeLoop.stop();
      };
    }
  }, [showIncomingModal]);

  // 45-Second Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (showIncomingModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleDeclineTrip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showIncomingModal, countdown]);

  // In-trip simulation for speedometer and distance
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTrip && activeTrip.status === 'IN_PROGRESS') {
      interval = setInterval(() => {
        setTripElapsedSecs((prev) => prev + 1);
        setCurrentSpeed((prev) => {
          const delta = (Math.random() - 0.48) * 3;
          const nextSpeed = Math.min(48, Math.max(28, Math.round(prev + delta)));
          setSpeedWarning(nextSpeed > 42);
          return nextSpeed;
        });
        setDistanceRemaining((prev) => Math.max(0.1, parseFloat((prev - 0.02).toFixed(2))));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTrip?.status]);

  // Initialize or fetch active trip
  useEffect(() => {
    singleTripApi.getActiveTrip(1).then((trip) => {
      if (trip && trip.status !== 'COMPLETED' && trip.status !== 'DECLINED') {
        setActiveTrip(trip);
        if (trip.status === 'DISPATCHED_45S') {
          setShowIncomingModal(true);
          setCountdown(trip.countdownSeconds || 45);
        }
      }
    }).catch(() => {});
  }, []);

  // Dispatch mock incoming trip (₹35 for 2km rule)
  const triggerIncomingTrip = async () => {
    setCountdown(45);
    setOtpInput('');
    setOtpError('');
    setShowRazorpaySheet(false);
    try {
      const res = await singleTripApi.createMockTrip(1);
      if (res && res.trip) {
        setActiveTrip({
          ...res.trip,
          fare: res.trip.fare || 35,
          distanceKm: res.trip.distanceKm || 2.0,
          otpCode: res.trip.otpCode || '8492',
          dropOtpCode: res.trip.dropOtpCode || '7429',
        });
      } else {
        setActiveTrip({
          id: Date.now(),
          passengerName: 'Rohit Sharma (Professional)',
          passengerPhone: '+91 98409 88776',
          passengerEmail: 'rohit.sharma@tcs.com',
          pickupAddress: 'Apollo Hospital Gate, Greams Road',
          dropAddress: 'Loyola College, Nungambakkam',
          fare: 35,
          otpCode: '8492',
          dropOtpCode: '7429',
          status: 'DISPATCHED_45S',
          distanceKm: 2.0,
          etaMins: 8,
        });
      }
    } catch (e) {
      setActiveTrip({
        id: Date.now(),
        passengerName: 'Rohit Sharma (Professional)',
        passengerPhone: '+91 98409 88776',
        passengerEmail: 'rohit.sharma@tcs.com',
        pickupAddress: 'Apollo Hospital Gate, Greams Road',
        dropAddress: 'Loyola College, Nungambakkam',
        fare: 35,
        otpCode: '8492',
        dropOtpCode: '7429',
        status: 'DISPATCHED_45S',
        distanceKm: 2.0,
        etaMins: 8,
      });
    }
    setShowIncomingModal(true);
  };

  // Accept Trip
  const handleAcceptTrip = async () => {
    if (!activeTrip) return;
    try {
      await singleTripApi.acceptTrip(activeTrip.id, 1);
    } catch (e) {
      console.log('Accepting in demo mode', e);
    }
    setActiveTrip((prev) => (prev ? { ...prev, status: 'ACCEPTED' } : null));
    setShowIncomingModal(false);
  };

  // Decline Trip or Auto-Timeout
  const handleDeclineTrip = async (isTimeout = false) => {
    if (activeTrip) {
      try {
        await singleTripApi.declineTrip(activeTrip.id);
      } catch (e) {
        console.log('Decline in demo mode', e);
      }
    }
    setShowIncomingModal(false);
    setActiveTrip(null);
    setCountdown(45);
    if (isTimeout) {
      Alert.alert('Dispatch Expired', 'The 45-second dispatch window timed out. Trip was reassigned to the next nearest cab.');
    }
  };

  // Mark Driver Arrived at Pickup
  const handleMarkArrived = async () => {
    if (!activeTrip) return;
    try {
      await singleTripApi.markArrived(activeTrip.id);
    } catch (e) {
      console.log('Arrived in demo mode', e);
    }
    setActiveTrip((prev) => (prev ? { ...prev, status: 'ARRIVED' } : null));
  };

  // Keypad Handlers for OTP
  const handleKeypadPress = (digit: string) => {
    if (otpInput.length < 4) {
      const nextOtp = otpInput + digit;
      setOtpInput(nextOtp);
      setOtpError('');
      if (nextOtp.length === 4) {
        if (activeTrip?.status === 'ARRIVED') {
          submitPickupOtpVerification(nextOtp);
        } else if (activeTrip?.status === 'AWAITING_DROP_OTP') {
          submitDropOtpVerification(nextOtp);
        }
      }
    }
  };

  const handleKeypadBackspace = () => {
    setOtpInput((prev) => prev.slice(0, -1));
    setOtpError('');
  };

  const handleKeypadClear = () => {
    setOtpInput('');
    setOtpError('');
  };

  // Submit Boarding/Pickup OTP Verification
  const submitPickupOtpVerification = async (enteredOtp = otpInput) => {
    if (!activeTrip) return;
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await singleTripApi.verifyPickupOtp(activeTrip.id, enteredOtp);
      if (res && res.verified) {
        setActiveTrip((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
        setOtpInput('');
        Alert.alert('🟢 Passenger Boarded', 'Boarding OTP 8492 verified. Meter & speed telematics active.');
      } else {
        setOtpError('Invalid Boarding OTP. Ask passenger for their 4-digit Boarding OTP (Demo: 8492).');
      }
    } catch (err: any) {
      if (enteredOtp === '8492' || enteredOtp === activeTrip.otpCode || enteredOtp === '7429') {
        setActiveTrip((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
        setOtpInput('');
        Alert.alert('🟢 Passenger Boarded', 'Boarding OTP verified. Meter & speed telematics active.');
      } else {
        setOtpError('Invalid Boarding OTP. Demo code: 8492');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Arrived at destination -> Prompt Drop OTP
  const handleArrivedAtDestination = () => {
    setActiveTrip((prev) => (prev ? { ...prev, status: 'AWAITING_DROP_OTP' } : null));
    setOtpInput('');
    setOtpError('');
  };

  // Submit Drop-off Safety OTP Verification
  const submitDropOtpVerification = async (enteredOtp = otpInput) => {
    if (!activeTrip) return;
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await singleTripApi.verifyDropOtp(activeTrip.id, enteredOtp);
      if (res && res.verified) {
        setActiveTrip((prev) => (prev ? { ...prev, status: 'COMPLETED' } : null));
        setOtpInput('');
        setShowRazorpaySheet(true);
      } else {
        setOtpError('Invalid Drop OTP. Ask passenger for their Drop Safety OTP (Demo: 7429).');
      }
    } catch (err: any) {
      if (enteredOtp === '7429' || enteredOtp === activeTrip.dropOtpCode || enteredOtp === '8492') {
        setActiveTrip((prev) => (prev ? { ...prev, status: 'COMPLETED' } : null));
        setOtpInput('');
        setShowRazorpaySheet(true);
      } else {
        setOtpError('Invalid Drop OTP. Demo code: 7429');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Confirm Razorpay Settlement into Driver Wallet
  const handleConfirmRazorpayPayment = async () => {
    if (!activeTrip) return;
    try {
      await singleTripApi.completePayment(activeTrip.id, 'RAZORPAY_QR', `rzp_settle_${Date.now()}`);
    } catch (e) {
      console.log('Payment complete demo mode', e);
    }
    Alert.alert(
      '✅ ₹35.00 Payment Settled',
      `Payment of ₹${activeTrip.fare} successfully credited directly into your ICICI Driver Wallet (Ref: RZP-${Date.now().toString().slice(-6)}).`,
      [
        {
          text: 'OK (Ready for Next Ride)',
          onPress: () => {
            setShowRazorpaySheet(false);
            setActiveTrip(null);
            setTripElapsedSecs(0);
            setDistanceRemaining(2.0);
          },
        },
      ]
    );
  };

  // Calculate SVG Countdown Circle Parameters
  const radius = 48;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = countdown / 45;
  const strokeDashoffset = circumference - progressRatio * circumference;
  const countdownColor = countdown > 20 ? '#10b981' : countdown > 10 ? '#f59e0b' : '#ef4444';

  // Format Trip Timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.headerTitle}>
            On-Demand & Single Trip
          </Text>
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            ₹35 / 2 km Base • Dual OTP Verification • Razorpay Direct QR
          </Text>
        </View>
        <TouchableOpacity
          style={styles.dispatchSimBtn}
          onPress={triggerIncomingTrip}
          activeOpacity={0.8}
        >
          <Avatar.Icon size={24} icon="car-electric" style={{ backgroundColor: 'transparent' }} color="#10b981" />
          <Text style={styles.dispatchSimBtnText}>Test ₹35 Dispatch</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Trip Workflow Status Banner */}
        {activeTrip ? (
          <Card style={styles.tripCard}>
            <View style={styles.tripCardHeader}>
              <View style={styles.tripStatusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        activeTrip.status === 'IN_PROGRESS'
                          ? '#10b981'
                          : activeTrip.status === 'ARRIVED'
                          ? '#3b82f6'
                          : activeTrip.status === 'AWAITING_DROP_OTP'
                          ? '#f59e0b'
                          : activeTrip.status === 'COMPLETED'
                          ? '#10b981'
                          : '#f59e0b',
                    },
                  ]}
                />
                <Text style={styles.tripStatusText}>{activeTrip.status.replace(/_/g, ' ')}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.fareTag}>₹{activeTrip.fare}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 10 }}>2.0 km Base Rate</Text>
              </View>
            </View>

            {/* Passenger Info */}
            <View style={styles.passengerRow}>
              <Avatar.Text
                size={44}
                label={activeTrip.passengerName.substring(0, 2).toUpperCase()}
                style={{ backgroundColor: '#1e293b' }}
                color="#10b981"
              />
              <View style={styles.passengerDetails}>
                <Text style={styles.passengerName}>{activeTrip.passengerName}</Text>
                <Text style={styles.passengerPhone}>{activeTrip.passengerPhone}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <Text style={styles.pickupOtpHint}>Boarding OTP: <Text style={{ fontWeight: 'bold', color: '#10b981' }}>{activeTrip.otpCode || '8492'}</Text></Text>
                  <Text style={styles.pickupOtpHint}>Drop OTP: <Text style={{ fontWeight: 'bold', color: '#f59e0b' }}>{activeTrip.dropOtpCode || '7429'}</Text></Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.callPassengerBtn}
                onPress={() => Alert.alert('Calling Passenger', `Dialing ${activeTrip.passengerPhone}...`)}
              >
                <Avatar.Icon size={28} icon="phone" style={{ backgroundColor: 'transparent' }} color="#10b981" />
              </TouchableOpacity>
            </View>

            {/* Route Addresses */}
            <View style={styles.routeContainer}>
              <View style={styles.routeTimeline}>
                <View style={[styles.timelineDot, { backgroundColor: '#10b981' }]} />
                <View style={styles.timelineLine} />
                <View style={[styles.timelineDot, { backgroundColor: '#ef4444' }]} />
              </View>
              <View style={styles.routeAddresses}>
                <View style={styles.addressBox}>
                  <Text style={styles.addressLabel}>PICKUP</Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {activeTrip.pickupAddress}
                  </Text>
                </View>
                <View style={[styles.addressBox, { marginTop: 12 }]}>
                  <Text style={styles.addressLabel}>DROP-OFF</Text>
                  <Text style={styles.addressText} numberOfLines={2}>
                    {activeTrip.dropAddress}
                  </Text>
                </View>
              </View>
            </View>

            {/* Step 1: Arrived at Pickup action */}
            {activeTrip.status === 'ACCEPTED' && (
              <View style={styles.actionContainer}>
                <Button
                  mode="contained"
                  icon="map-marker-check"
                  buttonColor="#3b82f6"
                  textColor="#ffffff"
                  style={styles.actionBtn}
                  onPress={handleMarkArrived}
                >
                  I HAVE ARRIVED AT PICKUP
                </Button>
              </View>
            )}

            {/* Step 2: Keypad for Boarding OTP when ARRIVED */}
            {activeTrip.status === 'ARRIVED' && (
              <View style={styles.otpSection}>
                <View style={styles.otpHeader}>
                  <Avatar.Icon size={32} icon="key-variant" style={{ backgroundColor: 'transparent' }} color="#10b981" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.otpTitle}>Enter 4-Digit Passenger Boarding OTP</Text>
                    <Text style={styles.otpSubtitle}>Ask passenger for pickup code to start ride (Demo: 8492)</Text>
                  </View>
                </View>

                {/* 4 Digit PIN Boxes */}
                <View style={styles.pinBoxesContainer}>
                  {[0, 1, 2, 3].map((index) => {
                    const digit = otpInput[index] || '';
                    return (
                      <View
                        key={index}
                        style={[
                          styles.pinBox,
                          digit ? styles.pinBoxFilled : null,
                          otpInput.length === index ? styles.pinBoxActive : null,
                        ]}
                      >
                        <Text style={styles.pinDigit}>{digit}</Text>
                      </View>
                    );
                  })}
                </View>

                {otpError ? <Text style={styles.otpErrorText}>{otpError}</Text> : null}

                {/* Custom Digital Keypad */}
                <View style={styles.keypadContainer}>
                  <View style={styles.keypadRow}>
                    {['1', '2', '3'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    {['4', '5', '6'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    {['7', '8', '9'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity
                      style={[styles.keypadKey, styles.keypadUtilityKey]}
                      onPress={handleKeypadClear}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.keypadUtilityText}>CLEAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.keypadKey}
                      onPress={() => handleKeypadPress('0')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.keypadKeyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.keypadKey, styles.keypadUtilityKey]}
                      onPress={handleKeypadBackspace}
                      activeOpacity={0.7}
                    >
                      <Avatar.Icon size={24} icon="backspace-outline" color="#94a3b8" style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  mode="contained"
                  buttonColor="#10b981"
                  textColor="#070b13"
                  loading={isVerifyingOtp}
                  disabled={otpInput.length < 4 || isVerifyingOtp}
                  style={{ marginTop: 14, borderRadius: 10, paddingVertical: 4 }}
                  onPress={() => submitPickupOtpVerification()}
                >
                  VERIFY BOARDING OTP & START TRIP
                </Button>
              </View>
            )}

            {/* Step 3: LIVE SPEEDOMETER & IN-PROGRESS HUD */}
            {activeTrip.status === 'IN_PROGRESS' && (
              <View style={styles.speedometerContainer}>
                <View style={styles.speedHeader}>
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveBlinker} />
                    <Text style={styles.liveText}>TRIP IN PROGRESS</Text>
                  </View>
                  <Text style={styles.timerText}>⏱️ {formatTime(tripElapsedSecs)}</Text>
                </View>

                {/* Speedometer Dial HUD */}
                <View style={styles.dialHUD}>
                  <Svg width="180" height="110" viewBox="0 0 200 120">
                    <Path
                      d="M 20 110 A 80 80 0 0 1 180 110"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    <Path
                      d="M 20 110 A 80 80 0 0 1 180 110"
                      fill="none"
                      stroke={speedWarning ? '#ef4444' : '#10b981'}
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (Math.min(currentSpeed, 60) / 60) * 251.2}
                    />
                    <SvgText
                      x="100"
                      y="92"
                      fill="#ffffff"
                      fontSize="36"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {currentSpeed}
                    </SvgText>
                    <SvgText
                      x="100"
                      y="112"
                      fill="#94a3b8"
                      fontSize="12"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      KM/H
                    </SvgText>
                  </Svg>

                  {/* Telematics Metrics */}
                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>₹35 (2 km)</Text>
                      <Text style={styles.metricLabel}>Fare Applied</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>{distanceRemaining} km</Text>
                      <Text style={styles.metricLabel}>Remaining</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricValue, { color: speedWarning ? '#ef4444' : '#10b981' }]}>
                        {speedWarning ? 'OVER' : 'SAFE'}
                      </Text>
                      <Text style={styles.metricLabel}>Telemetry</Text>
                    </View>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={{ marginTop: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ color: '#94a3b8', fontSize: 11 }}>Route Progress</Text>
                    <Text style={{ color: '#10b981', fontSize: 11, fontWeight: 'bold' }}>
                      {Math.round(((2.0 - distanceRemaining) / 2.0) * 100)}%
                    </Text>
                  </View>
                  <ProgressBar
                    progress={Math.min(1, Math.max(0, (2.0 - distanceRemaining) / 2.0))}
                    color="#10b981"
                    style={{ height: 6, borderRadius: 3, backgroundColor: '#1e293b' }}
                  />
                </View>

                {/* Arrived at Destination -> Drop OTP Step Button */}
                <Button
                  mode="contained"
                  icon="map-marker-radius"
                  buttonColor="#f59e0b"
                  textColor="#070b13"
                  style={{ marginTop: 18, borderRadius: 10, paddingVertical: 4 }}
                  onPress={handleArrivedAtDestination}
                >
                  ARRIVED AT DESTINATION (ENTER DROP OTP)
                </Button>
              </View>
            )}

            {/* Step 4: Keypad for Drop Safety OTP when AWAITING_DROP_OTP */}
            {activeTrip.status === 'AWAITING_DROP_OTP' && (
              <View style={[styles.otpSection, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
                <View style={styles.otpHeader}>
                  <Avatar.Icon size={32} icon="shield-check" style={{ backgroundColor: 'transparent' }} color="#f59e0b" />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.otpTitle}>Enter Passenger Drop Safety OTP</Text>
                    <Text style={styles.otpSubtitle}>Ask passenger for Drop OTP to complete ride & open QR (Demo: 7429)</Text>
                  </View>
                </View>

                {/* 4 Digit PIN Boxes */}
                <View style={styles.pinBoxesContainer}>
                  {[0, 1, 2, 3].map((index) => {
                    const digit = otpInput[index] || '';
                    return (
                      <View
                        key={index}
                        style={[
                          styles.pinBox,
                          digit ? styles.pinBoxFilled : null,
                          otpInput.length === index ? { borderColor: '#f59e0b' } : null,
                        ]}
                      >
                        <Text style={styles.pinDigit}>{digit}</Text>
                      </View>
                    );
                  })}
                </View>

                {otpError ? <Text style={styles.otpErrorText}>{otpError}</Text> : null}

                {/* Custom Digital Keypad */}
                <View style={styles.keypadContainer}>
                  <View style={styles.keypadRow}>
                    {['1', '2', '3'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    {['4', '5', '6'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    {['7', '8', '9'].map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={styles.keypadKey}
                        onPress={() => handleKeypadPress(d)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.keypadKeyText}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.keypadRow}>
                    <TouchableOpacity
                      style={[styles.keypadKey, styles.keypadUtilityKey]}
                      onPress={handleKeypadClear}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.keypadUtilityText}>CLEAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.keypadKey}
                      onPress={() => handleKeypadPress('0')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.keypadKeyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.keypadKey, styles.keypadUtilityKey]}
                      onPress={handleKeypadBackspace}
                      activeOpacity={0.7}
                    >
                      <Avatar.Icon size={24} icon="backspace-outline" color="#94a3b8" style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  mode="contained"
                  buttonColor="#f59e0b"
                  textColor="#070b13"
                  loading={isVerifyingOtp}
                  disabled={otpInput.length < 4 || isVerifyingOtp}
                  style={{ marginTop: 14, borderRadius: 10, paddingVertical: 4 }}
                  onPress={() => submitDropOtpVerification()}
                >
                  VERIFY DROP OTP & OPEN RAZORPAY QR
                </Button>
              </View>
            )}

            {/* Step 5: Completed state button */}
            {activeTrip.status === 'COMPLETED' && (
              <View style={{ marginTop: 16 }}>
                <Button
                  mode="contained"
                  icon="qrcode-scan"
                  buttonColor="#3b82f6"
                  textColor="#ffffff"
                  style={{ borderRadius: 10, paddingVertical: 4 }}
                  onPress={() => setShowRazorpaySheet(true)}
                >
                  OPEN RAZORPAY UPI QR (COLLECT ₹{activeTrip.fare})
                </Button>
              </View>
            )}
          </Card>
        ) : (
          /* Empty / Idle State */
          <View style={styles.idleContainer}>
            <Avatar.Icon size={72} icon="radar" style={{ backgroundColor: '#111827' }} color="#10b981" />
            <Text style={styles.idleTitle}>Scanning for Passenger Dispatches</Text>
            <Text style={styles.idleSubtitle}>
              You are Online. When a passenger books a single trip within your geo-fence, a 45-second incoming dispatch notification will appear with dynamic ₹35 pricing.
            </Text>
            <TouchableOpacity
              style={styles.simulateDispatchAction}
              onPress={triggerIncomingTrip}
              activeOpacity={0.8}
            >
              <Avatar.Icon size={24} icon="play-circle" color="#070b13" style={{ backgroundColor: 'transparent' }} />
              <Text style={styles.simulateDispatchActionText}>SIMULATE INCOMING ₹35 (2 KM) DISPATCH</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* RAZORPAY DYNAMIC QR COLLECTION BOTTOM SHEET / MODAL */}
      {showRazorpaySheet && activeTrip && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderColor: '#3b82f6', maxWidth: 360 }]}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)', paddingBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Icon size={28} icon="bank-transfer-in" color="#3b82f6" style={{ backgroundColor: 'transparent' }} />
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14, marginLeft: 6 }}>Razorpay Direct QR</Text>
              </View>
              <View style={{ backgroundColor: 'rgba(59,130,246,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ color: '#3b82f6', fontSize: 10, fontWeight: 'bold' }}>UPI AUTO-SETTLE</Text>
              </View>
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <Text style={{ color: '#94a3b8', fontSize: 11 }}>TOTAL TRIP FARE</Text>
              <Text style={{ color: '#10b981', fontSize: 32, fontWeight: '900' }}>₹{activeTrip.fare}.00</Text>
              <Text style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>2.0 km Ride • Passenger: {activeTrip.passengerName}</Text>
            </View>

            {/* QR Code Container */}
            <View style={{ backgroundColor: '#ffffff', padding: 14, borderRadius: 16, alignItems: 'center', width: 200, height: 200, justifyContent: 'center' }}>
              {/* Simulated Razorpay dynamic QR vector */}
              <Svg width="170" height="170" viewBox="0 0 170 170">
                {/* Outer corners */}
                <Path d="M 10 10 H 50 V 50 H 10 Z" fill="#000" />
                <Path d="M 18 18 H 42 V 42 H 18 Z" fill="#fff" />
                <Path d="M 24 24 H 36 V 36 H 24 Z" fill="#000" />

                <Path d="M 120 10 H 160 V 50 H 120 Z" fill="#000" />
                <Path d="M 128 18 H 152 V 42 H 128 Z" fill="#fff" />
                <Path d="M 134 24 H 146 V 36 H 134 Z" fill="#000" />

                <Path d="M 10 120 H 50 V 160 H 10 Z" fill="#000" />
                <Path d="M 18 128 H 42 V 152 H 18 Z" fill="#fff" />
                <Path d="M 24 134 H 36 V 146 H 24 Z" fill="#000" />

                {/* Simulated Matrix Dots */}
                <Path d="M 65 15 H 75 V 25 H 65 Z" fill="#000" />
                <Path d="M 85 15 H 105 V 25 H 85 Z" fill="#000" />
                <Path d="M 65 35 H 85 V 45 H 65 Z" fill="#000" />
                <Path d="M 95 35 H 105 V 55 H 95 Z" fill="#000" />

                <Path d="M 15 65 H 35 V 85 H 15 Z" fill="#000" />
                <Path d="M 45 65 H 65 V 75 H 45 Z" fill="#000" />
                <Path d="M 75 65 H 95 V 85 H 75 Z" fill="#000" />
                <Path d="M 105 65 H 125 V 75 H 105 Z" fill="#000" />
                <Path d="M 135 65 H 155 V 85 H 135 Z" fill="#000" />

                <Path d="M 25 95 H 45 V 105 H 25 Z" fill="#000" />
                <Path d="M 55 85 H 75 V 105 H 55 Z" fill="#000" />
                <Path d="M 85 95 H 115 V 105 H 85 Z" fill="#000" />
                <Path d="M 125 95 H 145 V 115 H 125 Z" fill="#000" />

                <Path d="M 65 115 H 85 V 135 H 65 Z" fill="#000" />
                <Path d="M 95 115 H 115 V 125 H 95 Z" fill="#000" />
                <Path d="M 125 125 H 155 V 145 H 125 Z" fill="#000" />
                <Path d="M 65 145 H 95 V 155 H 65 Z" fill="#000" />
                <Path d="M 105 135 H 115 V 155 H 105 Z" fill="#000" />

                {/* Razorpay Center Emblem */}
                <Circle cx="85" cy="85" r="16" fill="#0c2340" />
                <SvgText x="85" y="89" fill="#528ff0" fontSize="10" fontWeight="bold" textAnchor="middle">₹</SvgText>
              </Svg>
            </View>

            {/* Direct Wallet Details */}
            <View style={{ backgroundColor: '#131e32', borderRadius: 10, padding: 10, width: '100%', marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>Driver VPA:</Text>
                <Text style={{ color: '#10b981', fontSize: 11, fontWeight: 'bold' }}>safepassage.driver@icici</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>Settlement Bank:</Text>
                <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '600' }}>ICICI Bank •••• 4921</Text>
              </View>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setShowRazorpaySheet(false)}
              >
                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}>LATER</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 2, backgroundColor: '#10b981', borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                onPress={handleConfirmRazorpayPayment}
              >
                <Text style={{ color: '#070b13', fontSize: 12, fontWeight: '900' }}>CONFIRM PAYMENT (₹35)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 45-SECOND INCOMING DISPATCH OVERLAY MODAL */}
      {showIncomingModal && activeTrip && (
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalCard,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            {/* Audio Alert Bar */}
            <View style={styles.audioAlertBanner}>
              <Animated.View style={{ transform: [{ rotate: bellShakeAnim.interpolate({ inputRange: [-10, 10], outputRange: ['-15deg', '15deg'] }) }] }}>
                <Avatar.Icon size={24} icon="bell-ring" style={{ backgroundColor: 'transparent' }} color="#f59e0b" />
              </Animated.View>
              <Text style={styles.audioAlertText}>INCOMING SINGLE TRIP DISPATCH</Text>
              <TouchableOpacity onPress={() => setAudioAlertActive(!audioAlertActive)}>
                <Avatar.Icon size={20} icon={audioAlertActive ? 'volume-high' : 'volume-off'} style={{ backgroundColor: 'transparent' }} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Circular 45-Second SVG Countdown */}
            <View style={styles.countdownWrapper}>
              <Svg width="120" height="120" viewBox="0 0 120 120">
                <G rotation="-90" origin="60, 60">
                  {/* Background Track */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#1e293b"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Animated Progress Circle */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={countdownColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </G>
                {/* Center Countdown Seconds */}
                <SvgText
                  x="60"
                  y="62"
                  fill="#ffffff"
                  fontSize="28"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {countdown}
                </SvgText>
                <SvgText
                  x="60"
                  y="78"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  SECS
                </SvgText>
              </Svg>
            </View>

            {/* Passenger & Fare Info */}
            <View style={styles.incomingInfoBox}>
              <View style={styles.fareRow}>
                <Text style={styles.incomingFare}>₹{activeTrip.fare}</Text>
                <View style={styles.distEtaPill}>
                  <Text style={styles.distEtaText}>{activeTrip.distanceKm} km • {activeTrip.etaMins} mins</Text>
                </View>
              </View>

              <Text style={styles.incomingPassengerName}>{activeTrip.passengerName}</Text>
              <Text style={styles.incomingAddressLabel}>PICKUP LOCATION</Text>
              <Text style={styles.incomingAddressText} numberOfLines={2}>
                📍 {activeTrip.pickupAddress}
              </Text>
              <Text style={[styles.incomingAddressLabel, { marginTop: 6 }]}>DESTINATION</Text>
              <Text style={styles.incomingAddressText} numberOfLines={2}>
                🏁 {activeTrip.dropAddress}
              </Text>
            </View>

            {/* Action Buttons: Accept & Decline */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => handleDeclineTrip(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.declineBtnText}>DECLINE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={handleAcceptTrip}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptBtnText}>ACCEPT (₹35)</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dispatchSimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dispatchSimBtnText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tripCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 12,
  },
  tripStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tripStatusText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  fareTag: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: '900',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  passengerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  passengerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  passengerPhone: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 1,
  },
  pickupOtpHint: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  callPassengerBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  routeContainer: {
    flexDirection: 'row',
    backgroundColor: '#131e32',
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
  },
  routeTimeline: {
    alignItems: 'center',
    width: 20,
    paddingVertical: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 4,
  },
  routeAddresses: {
    flex: 1,
    marginLeft: 10,
  },
  addressBox: {},
  addressLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  addressText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 16,
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 4,
  },
  otpSection: {
    backgroundColor: '#131e32',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  otpSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
  },
  pinBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 14,
    gap: 12,
  },
  pinBox: {
    width: 48,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinBoxActive: {
    borderColor: '#f59e0b',
  },
  pinBoxFilled: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  pinDigit: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  otpErrorText: {
    color: '#ef4444',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 8,
  },
  keypadContainer: {
    marginTop: 6,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  keypadKey: {
    flex: 1,
    height: 44,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  keypadKeyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keypadUtilityKey: {
    backgroundColor: '#0f172a',
  },
  keypadUtilityText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  speedometerContainer: {
    backgroundColor: '#131e32',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  speedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBlinker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  liveText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dialHUD: {
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  idleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  idleTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  idleSubtitle: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  simulateDispatchAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  simulateDispatchActionText: {
    color: '#070b13',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    padding: 18,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  audioAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  audioAlertText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  countdownWrapper: {
    marginVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingInfoBox: {
    width: '100%',
    backgroundColor: '#131e32',
    borderRadius: 12,
    padding: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  incomingFare: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: '900',
  },
  distEtaPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distEtaText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  incomingPassengerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  incomingAddressLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: 'bold',
  },
  incomingAddressText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    width: '100%',
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#070b13',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
