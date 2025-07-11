import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'goals'
  
  // Profile state
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    bodyType: 'lean',
    desiredOutcome: 'muscular'
  });
  
  // Goals state
  const [goals, setGoals] = useState({
    protein: '150',
    calories: '2000',
    water: '8',
    sleep: '8'
  });

  useEffect(() => {
    if (user) {
      setProfile({
        height: user.profile?.height?.toString() || '',
        weight: user.profile?.weight?.toString() || '',
        bodyType: user.profile?.bodyType || 'lean',
        desiredOutcome: user.profile?.desiredOutcome || 'muscular'
      });
      
      setGoals({
        protein: user.goals?.protein?.toString() || '150',
        calories: user.goals?.calories?.toString() || '2000',
        water: user.goals?.water?.toString() || '8',
        sleep: user.goals?.sleep?.toString() || '8'
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', {
        height: parseFloat(profile.height) || undefined,
        weight: parseFloat(profile.weight) || undefined,
        bodyType: profile.bodyType,
        desiredOutcome: profile.desiredOutcome
      });
      
      updateUser(response.data.user);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleGoalsSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/goals', {
        protein: parseFloat(goals.protein),
        calories: parseFloat(goals.calories),
        water: parseFloat(goals.water),
        sleep: parseFloat(goals.sleep)
      });
      
      updateUser(response.data.user);
      Alert.alert('Success', 'Goals updated successfully!');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update goals');
    } finally {
      setSaving(false);
    }
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

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={profile.height}
          onChangeText={(text) => setProfile({...profile, height: text})}
          placeholder="170"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={profile.weight}
          onChangeText={(text) => setProfile({...profile, weight: text})}
          placeholder="70"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current Body Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={profile.bodyType}
            onValueChange={(value) => setProfile({...profile, bodyType: value})}
            style={styles.picker}
          >
            <Picker.Item label="Skinny" value="skinny" />
            <Picker.Item label="Skinny Fat" value="skinny-fat" />
            <Picker.Item label="Fat" value="fat" />
            <Picker.Item label="Lean" value="lean" />
            <Picker.Item label="Muscular" value="muscular" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Desired Outcome</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={profile.desiredOutcome}
            onValueChange={(value) => setProfile({...profile, desiredOutcome: value})}
            style={styles.picker}
          >
            <Picker.Item label="Lean Bulk" value="lean-bulk" />
            <Picker.Item label="Muscular" value="muscular" />
            <Picker.Item label="Weight Loss" value="weight-loss" />
            <Picker.Item label="Maintenance" value="maintenance" />
            <Picker.Item label="Strength" value="strength" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleProfileSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderGoalsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Daily Goals</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Protein Goal (g)</Text>
        <TextInput
          style={styles.input}
          value={goals.protein}
          onChangeText={(text) => setGoals({...goals, protein: text})}
          placeholder="150"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Calorie Goal</Text>
        <TextInput
          style={styles.input}
          value={goals.calories}
          onChangeText={(text) => setGoals({...goals, calories: text})}
          placeholder="2000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Water Goal (glasses)</Text>
        <TextInput
          style={styles.input}
          value={goals.water}
          onChangeText={(text) => setGoals({...goals, water: text})}
          placeholder="8"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sleep Goal (hours)</Text>
        <TextInput
          style={styles.input}
          value={goals.sleep}
          onChangeText={(text) => setGoals({...goals, sleep: text})}
          placeholder="8"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleGoalsSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Goals</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile & Goals</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'profile' ? renderProfileTab() : renderGoalsTab()}
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
    backgroundColor: '#007AFF',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tabContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 