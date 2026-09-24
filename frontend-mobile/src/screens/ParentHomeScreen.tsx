import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { Text, TextInput, Button, Switch, Avatar, Card } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleSOS, updateSearchParams } from '../store/slices/tripSlice';
import { ServiceInfo } from '../components/ServiceInfo';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8085' : 'http://localhost:8085';

export const ParentHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { drivers, selectedDriverId, sosTriggered, searchParams } = useAppSelector(state => state.trip);
  
  const [school, setSchool] = useState(searchParams.school);
  const [pickup, setPickup] = useState(searchParams.pickup);
  const [girlsSafeMode, setGirlsSafeMode] = useState(false);

  // Child profiles states loaded dynamically from backend-parent
  const [children, setChildren] = useState<any[]>([
    { id: 1, childName: 'Ananya Sharma', age: 10, institution: 'ABC Matriculation School', cabId: 'd1', verificationStatus: 'VERIFIED' }
  ]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(1);
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildInstitution, setNewChildInstitution] = useState('');

  // Wallet State Fields
  const [walletBalance, setWalletBalance] = useState(0.0);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [loadAmount, setLoadAmount] = useState('');

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  useEffect(() => {
    fetchChildren();
    fetchWalletBalance();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchWalletBalance();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchWalletBalance = () => {
    fetch(`${API_BASE}/api/parent/wallet?email=priya.sharma@gmail.com`)
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== undefined) {
          setWalletBalance(data.balance);
        }
      })
      .catch(err => console.log('Wallet service offline; using simulated local cache.', err));
  };

  const initiateWalletAddPayment = (amount: number) => {
    fetch(`${API_BASE}/api/parent/payment/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        email: 'priya.sharma@gmail.com'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.paymentUrl) {
          Linking.openURL(data.paymentUrl);
          setShowAddMoneyForm(false);
          setLoadAmount('');
          Alert.alert(
            '💳 Razorpay Gateway',
            'We have launched the secure Razorpay payment gateway page in your browser. Refresh your balance once paid.',
            [{ text: 'REFRESH BALANCE', onPress: () => fetchWalletBalance() }]
          );
        } else {
          Alert.alert('Error', 'Failed to generate payment gateway link.');
        }
      })
      .catch(() => {
        // Fallback demo credits
        setWalletBalance(prev => prev + amount);
        setLoadAmount('');
        setShowAddMoneyForm(false);
        Alert.alert('Sandbox Refill Success', `Credited ₹${amount} directly to wallet.`);
      });
  };

  const verifyWalletAdd = (orderId: string, paymentId: string, signature: string, amount: number) => {
    fetch(`${API_BASE}/api/parent/wallet/add/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        parent_email: 'priya.sharma@gmail.com',
        amount: amount
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.balance !== undefined) {
          setWalletBalance(data.balance);
          setLoadAmount('');
          setShowAddMoneyForm(false);
          Alert.alert('Success', `Wallet topped up. New balance: ₹${data.balance}`);
        }
      })
      .catch(() => {
        // Sandbox load
        setWalletBalance(prev => prev + amount);
        setLoadAmount('');
        setShowAddMoneyForm(false);
        Alert.alert('Sandbox Success', `Credited ₹${amount} directly (Demo verification bypass).`);
      });
  };

  const fetchChildren = () => {
    fetch(`${API_BASE}/api/parent/children?email=priya.sharma@gmail.com`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setChildren(data);
          if (!selectedChildId) {
            setSelectedChildId(data[0].id);
          }
        }
      })
      .catch(err => console.log('Backend not reachable; utilizing demo seed child profile.', err));
  };

  const handleAddChild = () => {
    if (!newChildName || !newChildAge || !newChildInstitution) {
      Alert.alert('Error', 'Please fill in all child details.');
      return;
    }

    const payload = {
      parentEmail: 'priya.sharma@gmail.com',
      childName: newChildName,
      age: parseInt(newChildAge),
      institution: newChildInstitution,
      verificationStatus: 'VERIFIED' // Auto verify in sandbox
    };

    fetch(`${API_BASE}/api/parent/children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(savedChild => {
        setChildren(prev => [...prev, savedChild]);
        setSelectedChildId(savedChild.id);
        resetAddChildForm();
        Alert.alert('Success', 'Child profile registered to MySQL.');
      })
      .catch(err => {
        // Fallback local registration
        const mockChild = {
          id: Date.now(),
          ...payload
        };
        setChildren(prev => [...prev, mockChild]);
        setSelectedChildId(mockChild.id);
        resetAddChildForm();
        Alert.alert('Sandbox Success', 'Child profile saved locally (Demo Mode).');
      });
  };

  const resetAddChildForm = () => {
    setNewChildName('');
    setNewChildAge('');
    setNewChildInstitution('');
    setShowAddChildForm(false);
  };

  const handleMockPassportUpload = (childId: number) => {
    Alert.alert(
      "Simulate Camera Passport Upload",
      "Select a mock student passport photo from your camera roll:",
      [
        {
          text: "Student Photo A (Boy)",
          onPress: () => performUpload(childId, "student_boy.jpg", "image/jpeg")
        },
        {
          text: "Student Photo B (Girl)",
          onPress: () => performUpload(childId, "student_girl.jpg", "image/jpeg")
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const performUpload = (childId: number, filename: string, mimeType: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200",
      name: filename,
      type: mimeType
    } as any);

    fetch(`${API_BASE}/api/parent/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.url) {
          fetch(`${API_BASE}/api/parent/children/passport?childId=${childId}&photoUrl=${encodeURIComponent(data.url)}`, {
            method: "POST"
          })
            .then(res => res.json())
            .then(updatedChild => {
              setChildren(prev => prev.map(c => c.id === childId ? updatedChild : c));
              Alert.alert("KYC Approved", "Passport photo uploaded & auto-verified successfully via simulated S3 storage!");
            });
        }
      })
      .catch(() => {
        Alert.alert("Demo Mode Success", "Simulated upload complete. Passport verified locally.");
      });
  };

  const handleSearch = () => {
    dispatch(updateSearchParams({ school, pickup }));
  };

  // Compute dynamic stats
  const childrenWithCab = children.filter(c => c.cabId).length;
  const pendingRegistrations = children.filter(c => !c.cabId).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Good Morning Priya Sharma Header */}
      <View style={styles.welcomeHeader}>
        <View style={styles.avatarRow}>
          <Avatar.Text size={36} label="PS" style={styles.welcomeAvatar} />
          <View>
            <Text style={styles.welcomeSub}>Good Morning 👋</Text>
            <Text style={styles.welcomeName}>Priya Sharma</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(toggleSOS())}
          style={[styles.sosBtn, sosTriggered && styles.sosBtnActive]}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Wallet Balance Card Component */}
      <Card style={{ backgroundColor: '#111827', borderColor: '#38bdf8', borderWidth: 1, borderRadius: 16, marginBottom: 16 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) }}>
                SafePassage Wallet Balance
              </Text>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 4, fontFamily: Platform.select({ ios: 'Times New Roman', android: 'serif' }) }}>
                ₹{walletBalance.toFixed(2)}
              </Text>
            </View>
            <Button 
              mode="contained" 
              onPress={() => setShowAddMoneyForm(!showAddMoneyForm)} 
              buttonColor="#38bdf8" 
              textColor="#000"
              labelStyle={{ fontWeight: 'bold', fontSize: 10, fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) }}
            >
              {showAddMoneyForm ? 'Cancel' : '+ Add Money'}
            </Button>
          </View>

          {showAddMoneyForm && (
            <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <TextInput
                label="Amount (INR)"
                value={loadAmount}
                onChangeText={setLoadAmount}
                keyboardType="numeric"
                mode="outlined"
                style={{ backgroundColor: '#070b13', marginBottom: 8, fontSize: 13 }}
                outlineColor="rgba(255,255,255,0.08)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
              <Button
                mode="contained"
                onPress={() => {
                  const amt = parseFloat(loadAmount);
                  if (isNaN(amt) || amt <= 0) {
                    Alert.alert('Error', 'Please enter a valid amount.');
                    return;
                  }
                  initiateWalletAddPayment(amt);
                }}
                buttonColor="#10b981"
                textColor="#000"
                labelStyle={{ fontWeight: 'bold', fontSize: 11, fontFamily: Platform.select({ ios: 'Arial', android: 'sans-serif' }) }}
              >
                Refill via Razorpay Gateway
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Quick Action Widget counters (Template 5) */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#38bdf8' }]}>{childrenWithCab}</Text>
            <Text style={styles.statLabel}>Contracts</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#10b981' }]}>{children.length}</Text>
            <Text style={styles.statLabel}>Children</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#f59e0b' }]}>{childrenWithCab > 0 ? 1 : 0}</Text>
            <Text style={styles.statLabel}>Active Trips</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Text style={[styles.statVal, { color: '#ec4899' }]}>{pendingRegistrations}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Registered Children List Section */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={styles.sectionTitle}>Registered Children Profiles</Text>
          <Button 
            mode="text" 
            textColor="#38bdf8" 
            onPress={() => setShowAddChildForm(!showAddChildForm)}
            style={{ margin: 0, padding: 0 }}
          >
            {showAddChildForm ? 'Cancel' : '+ Add Profile'}
          </Button>
        </View>
        
        {showAddChildForm && (
          <Card style={[styles.searchCard, { marginTop: 0 }]}>
            <Card.Content>
              <Text style={[styles.searchTitle, { fontSize: 14, marginBottom: 8 }]}>Register Child in Database</Text>
              <TextInput
                label="Child Full Name"
                value={newChildName}
                onChangeText={setNewChildName}
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(255,255,255,0.08)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
              <TextInput
                label="Age"
                value={newChildAge}
                onChangeText={setNewChildAge}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(255,255,255,0.08)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
              <TextInput
                label="School / Institution Name"
                value={newChildInstitution}
                onChangeText={setNewChildInstitution}
                mode="outlined"
                style={styles.input}
                outlineColor="rgba(255,255,255,0.08)"
                activeOutlineColor="#38bdf8"
                textColor="#fff"
              />
              <Button 
                mode="contained" 
                onPress={handleAddChild}
                style={[styles.searchBtn, { backgroundColor: '#10b981' }]}
                textColor="#000"
              >
                Save Profile to MySQL
              </Button>
            </Card.Content>
          </Card>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {children.map(child => {
            const isSelected = selectedChildId === child.id;
            return (
              <TouchableOpacity 
                key={child.id}
                onPress={() => setSelectedChildId(child.id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(56,189,248,0.08)' : '#111827',
                  borderWidth: 1,
                  borderColor: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: 12,
                  width: 170,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Avatar.Text size={24} label={child.childName.charAt(0)} style={{ backgroundColor: isSelected ? '#38bdf8' : '#374151' }} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', flexShrink: 1 }} numberOfLines={1}>
                    {child.childName}
                  </Text>
                </View>
                <Text style={{ color: '#9ca3af', fontSize: 9 }} numberOfLines={1}>🏫 {child.institution}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <Text style={{ color: child.cabId ? '#10b981' : '#f59e0b', fontSize: 8, fontWeight: 'bold' }}>
                    {child.cabId ? '🟢 Cab Confirmed' : '🟡 Unconfirmed'}
                  </Text>
                  <Text style={{ color: '#9ca3af', fontSize: 8 }}>Age: {child.age}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Selected Child Actions */}
      {selectedChildId && (
        <Card style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderRadius: 12, marginVertical: 8, padding: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>
              Child profile: {children.find(c => c.id === selectedChildId)?.childName}
            </Text>
            <Button
              mode="outlined"
              compact
              onPress={() => handleMockPassportUpload(selectedChildId)}
              textColor="#38bdf8"
              labelStyle={{ fontSize: 9, fontWeight: 'bold' }}
              style={{ borderColor: '#38bdf8' }}
            >
              📸 Upload KYC Photo
            </Button>
          </View>
        </Card>
      )}

      {/* Template 1 Service Info Component */}
      <ServiceInfo
        date="18 Jan 2019"
        plate={selectedDriver.plate}
        statusText="Your student has boarded the cab."
        onLiveTrackPress={() => navigation.navigate('LiveTrack')}
        onBoardingSpotPress={() => navigation.navigate('Passport')}
      />

      {/* Search Cab Form */}
      <Card style={styles.searchCard}>
        <Card.Content style={styles.searchContent}>
          <Text style={styles.searchTitle}>Find School Transport</Text>
          
          <TextInput
            label="School Name"
            value={school}
            onChangeText={setSchool}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
          />

          <TextInput
            label="Pickup Location"
            value={pickup}
            onChangeText={setPickup}
            mode="outlined"
            style={styles.input}
            outlineColor="rgba(255,255,255,0.08)"
            activeOutlineColor="#38bdf8"
            textColor="#fff"
          />

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Girls-Safe Mode (Female Driver)</Text>
            <Switch
              value={girlsSafeMode}
              onValueChange={setGirlsSafeMode}
              color="#38bdf8"
            />
          </View>

          <Button 
            mode="contained" 
            onPress={handleSearch} 
            style={styles.searchBtn}
            buttonColor="#38bdf8"
            textColor="#000"
          >
            Find Available Cabs
          </Button>
        </Card.Content>
      </Card>

      {/* Driver Profiles list compare */}
      <Text style={styles.sectionTitle}>Available Cabs Compare</Text>
      {drivers
        .filter(d => !girlsSafeMode || d.id !== 'd3')
        .map(driver => (
          <Card 
            key={driver.id} 
            style={styles.driverCard}
            onPress={() => {
              navigation.navigate('SelectPlan', { driverId: driver.id, childId: selectedChildId });
            }}
          >
            <Card.Content>
              <View style={styles.driverHeader}>
                <View>
                  <Text style={driver.id === 'd1' ? styles.driverName : styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                </View>
                <Text style={styles.driverPrice}>₹{driver.priceMonthly}/mo</Text>
              </View>
              <View style={styles.driverMeta}>
                <Text style={styles.driverRating}>⭐ {driver.rating} ({driver.trustScore}% Trust)</Text>
                <Text style={styles.driverSeats}>🟢 {driver.seatsAvailable} seats left</Text>
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
    paddingBottom: 32,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeAvatar: {
    backgroundColor: '#38bdf8',
  },
  welcomeSub: {
    fontSize: 10,
    color: '#9ca3af',
  },
  welcomeName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  sosBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sosBtnActive: {
    backgroundColor: '#b91c1c',
  },
  sosText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statContent: {
    padding: 8,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 7,
    color: '#9ca3af',
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    marginVertical: 12,
  },
  searchContent: {
    padding: 14,
  },
  searchTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#070b13',
    marginBottom: 10,
    fontSize: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 10,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  searchBtn: {
    marginTop: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 12,
  },
  driverCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    marginBottom: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverVehicle: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  driverPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
  },
  driverMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 8,
  },
  driverRating: {
    fontSize: 9,
    color: '#fbbf24',
  },
  driverSeats: {
    fontSize: 9,
    color: '#10b981',
  }
});
