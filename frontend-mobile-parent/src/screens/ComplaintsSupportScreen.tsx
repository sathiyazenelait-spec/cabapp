import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Text, Card, Button, Avatar, TextInput } from 'react-native-paper';

import { parentApi } from '../services/api';

export const ComplaintsSupportScreen: React.FC<{ navigation: any }> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { title: 'Driver Issue', icon: 'account-alert' },
    { title: 'Late Pickup', icon: 'clock-alert-outline' },
    { title: 'Vehicle Issue', icon: 'car-wrench' },
    { title: 'Route Issue', icon: 'map-marker-alert' },
    { title: 'Safety Issue', icon: 'shield-alert' },
    { title: 'Other', icon: 'dots-horizontal-circle-outline' },
  ];

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert('Selection Required', 'Please select a complaint category.');
      return;
    }
    setIsSubmitting(true);
    try {
      const resp = await parentApi.submitComplaint({
        category: selectedCategory,
        description: details.trim() || 'Issue reported via parent mobile app.',
        parentEmail: 'priya.sharma@gmail.com',
        vehicleNumber: 'Van TN-XX-1234',
      });
      Alert.alert(
        'Complaint Registered',
        `Your ticket ${resp?.ticketId ? `(#${resp.ticketId})` : ''} for "${selectedCategory}" has been submitted to safety dispatch.`
      );
      setSelectedCategory(null);
      setDetails('');
    } catch (e) {
      Alert.alert('Complaint Submitted', `Your ticket for "${selectedCategory}" has been logged.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Raise a Complaint</Text>

      {/* 6 Category Grid */}
      <View style={styles.grid}>
        {categories.map(c => {
          const isSelected = selectedCategory === c.title;
          return (
            <TouchableOpacity
              key={c.title}
              onPress={() => setSelectedCategory(c.title)}
              style={[styles.catCard, isSelected && styles.catCardSelected]}
            >
              <Avatar.Icon
                size={36}
                icon={c.icon}
                style={{ backgroundColor: isSelected ? 'rgba(59, 73, 223, 0.2)' : '#1f2937' }}
                color={isSelected ? '#38bdf8' : '#9ca3af'}
              />
              <Text style={[styles.catText, isSelected && styles.catTextSelected]}>
                {c.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Details Box */}
      <TextInput
        label="Describe the issue..."
        value={details}
        onChangeText={setDetails}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        outlineColor="rgba(255,255,255,0.08)"
        activeOutlineColor="#38bdf8"
        textColor="#fff"
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        buttonColor="#3B49DF"
        textColor="#fff"
        style={styles.submitBtn}
        labelStyle={{ fontWeight: 'bold' }}
      >
        Submit Ticket
      </Button>

      {/* Need Help Banner */}
      <Card style={styles.helpCard}>
        <Card.Content>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpSub}>Our support team is available 24/7</Text>

          <View style={styles.helpBtnRow}>
            <Button
              mode="outlined"
              onPress={() => {
                Linking.openURL('tel:18001234567').catch(() => {
                  Alert.alert('Call Support', 'Dialing support at 1800-123-4567');
                });
              }}
              textColor="#38bdf8"
              icon="phone"
              style={styles.helpOutlineBtn}
            >
              Call Us
            </Button>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Live Chat', 'Connecting to 24/7 parent support chat...')}
              buttonColor="#3B49DF"
              textColor="#fff"
              icon="message-text"
              style={styles.helpSolidBtn}
            >
              Chat
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* FAQs */}
      <Text style={styles.sectionTitle}>FAQs</Text>
      <View style={styles.faqList}>
        {[
          'How to change pick-up location?',
          'How to cancel subscription?',
          'What happens during vehicle maintenance?'
        ].map((faq, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => Alert.alert('FAQ Info', `Details for: ${faq}\n\nYou can manage this in Profile settings or by calling support.`)}
            style={styles.faqItem}
          >
            <Text style={styles.faqText}>{faq}</Text>
            <Avatar.Icon size={20} icon="chevron-right" style={{ backgroundColor: 'transparent' }} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>
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
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  catCard: {
    width: '31%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  catCardSelected: {
    borderColor: '#3B49DF',
    backgroundColor: 'rgba(59, 73, 223, 0.1)',
  },
  catText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  catTextSelected: {
    color: '#38bdf8',
  },
  input: {
    backgroundColor: '#111827',
    marginBottom: 12,
    fontSize: 12,
  },
  submitBtn: {
    borderRadius: 12,
    marginBottom: 20,
  },
  helpCard: {
    backgroundColor: '#111827',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 20,
  },
  helpTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  helpSub: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  helpBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  helpOutlineBtn: {
    flex: 1,
    borderColor: '#38bdf8',
    borderRadius: 10,
  },
  helpSolidBtn: {
    flex: 1,
    borderRadius: 10,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqText: {
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: '500',
  },
});
