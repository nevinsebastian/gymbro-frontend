import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function SleepTracker() {
  const [hours, setHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTrack = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/track/sleep', { hours: Number(hours) });
      setMessage('Sleep tracked!');
      setHours('');
    } catch (e) {
      setMessage('Failed to track sleep');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Sleep</Text>
      <TextInput
        style={styles.input}
        placeholder="How many hours?"
        keyboardType="numeric"
        value={hours}
        onChangeText={setHours}
      />
      {loading ? <ActivityIndicator /> : <Button title="Track" onPress={handleTrack} />}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  message: { marginTop: 12, textAlign: 'center' },
});
