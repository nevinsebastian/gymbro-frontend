import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView 
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function FoodTracker({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [food, setFood] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTrack = async () => {
    if (!food.trim()) {
      Alert.alert('Error', 'Please enter food details');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await api.post('/track/food', { 
        meal: food,
        calories: 0, // You can add calorie input later
        protein: 0,  // You can add protein input later
        mealType: 'snack'
      });
      setMessage('Food tracked successfully!');
      setFood('');
    } catch (e) {
      setMessage('Failed to track food');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Log Food</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Track Your Food</Text>
        <TextInput
          style={styles.input}
          placeholder="What did you eat? (e.g., Chicken breast with rice)"
          value={food}
          onChangeText={setFood}
          multiline
          numberOfLines={3}
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.trackButton} onPress={handleTrack}>
            <Text style={styles.trackButtonText}>Track Food</Text>
          </TouchableOpacity>
        )}
        
        {message ? (
          <View style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  trackButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  messageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});
