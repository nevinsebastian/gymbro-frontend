import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [progress, setProgress] = useState(null);
  const [streaks, setStreaks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [progressRes, streaksRes] = await Promise.all([
        api.get('/auth/progress'),
        api.get('/track/streak')
      ]);
      setProgress(progressRes.data);
      setStreaks(streaksRes.data);
      setError('');
    } catch (e) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
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

  const ProgressCard = ({ title, current, goal, unit, color, icon }) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    
    return (
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{title}</Text>
          <Text style={styles.progressIcon}>{icon}</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${percentage}%`, backgroundColor: color }
            ]} 
          />
        </View>
        
        <View style={styles.progressStats}>
          <Text style={styles.progressCurrent}>
            {current}{unit}
          </Text>
          <Text style={styles.progressGoal}>
            / {goal}{unit}
          </Text>
        </View>
        
        <Text style={styles.progressPercentage}>
          {Math.round(percentage)}%
        </Text>
      </View>
    );
  };

  const QuickActionButton = ({ title, onPress, color, icon }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const StreakCard = ({ title, current, longest, icon, color }) => (
    <View style={[styles.streakCard, { borderLeftColor: color }]}>
      <Text style={styles.streakIcon}>{icon}</Text>
      <Text style={styles.streakTitle}>{title}</Text>
      <Text style={styles.streakCurrent}>{current} days</Text>
      <Text style={styles.streakLongest}>Best: {longest} days</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.name || 'GymBro'}! 💪
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Daily Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.progressGrid}>
              {progress && (
                <>
                  <ProgressCard
                    title="Calories"
                    current={progress.progress.calories.current}
                    goal={progress.progress.calories.goal}
                    unit=" cal"
                    color="#FF6B6B"
                    icon="🔥"
                  />
                  <ProgressCard
                    title="Protein"
                    current={progress.progress.protein.current}
                    goal={progress.progress.protein.goal}
                    unit="g"
                    color="#4ECDC4"
                    icon="🥩"
                  />
                  <ProgressCard
                    title="Water"
                    current={progress.progress.water.current}
                    goal={progress.progress.water.goal}
                    unit=" glasses"
                    color="#45B7D1"
                    icon="💧"
                  />
                  <ProgressCard
                    title="Sleep"
                    current={progress.progress.sleep.current}
                    goal={progress.progress.sleep.goal}
                    unit="h"
                    color="#96CEB4"
                    icon="😴"
                  />
                </>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionButton
                title="Log Food"
                onPress={() => navigation.navigate('FoodTracker')}
                color="#FF6B6B"
                icon="🍽️"
              />
              <QuickActionButton
                title="Log Water"
                onPress={() => navigation.navigate('WaterTracker')}
                color="#45B7D1"
                icon="💧"
              />
              <QuickActionButton
                title="Log Workout"
                onPress={() => navigation.navigate('WorkoutTracker')}
                color="#FFA726"
                icon="🏋️"
              />
              <QuickActionButton
                title="Log Sleep"
                onPress={() => navigation.navigate('SleepTracker')}
                color="#96CEB4"
                icon="😴"
              />
            </View>
          </View>

          {/* Streaks */}
          {streaks && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Streaks</Text>
              <View style={styles.streaksGrid}>
                <StreakCard
                  title="Food Tracking"
                  current={streaks.streaks.food.current}
                  longest={streaks.streaks.food.longest}
                  icon="🍽️"
                  color="#FF6B6B"
                />
                <StreakCard
                  title="Water Intake"
                  current={streaks.streaks.water.current}
                  longest={streaks.streaks.water.longest}
                  icon="💧"
                  color="#45B7D1"
                />
                <StreakCard
                  title="Workouts"
                  current={streaks.streaks.workout.current}
                  longest={streaks.streaks.workout.longest}
                  icon="🏋️"
                  color="#FFA726"
                />
                <StreakCard
                  title="Sleep"
                  current={streaks.streaks.sleep.current}
                  longest={streaks.streaks.sleep.longest}
                  icon="😴"
                  color="#96CEB4"
                />
              </View>
            </View>
          )}

          {/* Profile Button */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.profileButtonText}>⚙️ Profile & Goals</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  progressIcon: {
    fontSize: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  progressCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressGoal: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#999',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width - 48) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  streaksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  streakCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: (width - 48) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  streakCurrent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  streakLongest: {
    fontSize: 12,
    color: '#999',
  },
  profileButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
