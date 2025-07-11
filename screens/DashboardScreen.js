import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await api.get('/track/streak');
        setStreak(res.data);
      } catch (e) {
        setError('Failed to load streak');
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to GymBro!</Text>
      {loading ? <ActivityIndicator /> : error ? <Text style={styles.error}>{error}</Text> : (
        <>
          <Text style={styles.streak}>Current Streak: {streak?.streak || 0} days</Text>
          {/* Add more summary info here if available */}
        </>
      )}
      <Button title="Track Food" onPress={() => navigation.navigate('FoodTracker')} />
      <Button title="Track Water" onPress={() => navigation.navigate('WaterTracker')} />
      <Button title="Track Sleep" onPress={() => navigation.navigate('SleepTracker')} />
      <Button title="Track Workout" onPress={() => navigation.navigate('WorkoutTracker')} />
      <Button title="Track Junk Food" onPress={() => navigation.navigate('JunkTracker')} />
      <View style={{ marginTop: 24 }}>
        <Button title="Logout" color="#d9534f" onPress={logout} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  streak: { fontSize: 20, marginBottom: 24 },
  error: { color: 'red', marginBottom: 12 },
});
