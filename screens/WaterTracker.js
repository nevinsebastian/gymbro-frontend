import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function WaterTracker() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTrack = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/track/water', { amount: Number(amount) });
      setMessage('Water tracked!');
      setAmount('');
    } catch (e) {
      setMessage('Failed to track water');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Water</Text>
      <TextInput
        style={styles.input}
        placeholder="How much water (ml)?"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
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
