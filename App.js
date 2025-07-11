import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import FoodTracker from './screens/FoodTracker';
import WaterTracker from './screens/WaterTracker';
import SleepTracker from './screens/SleepTracker';
import WorkoutTracker from './screens/WorkoutTracker';
import JunkTracker from './screens/JunkTracker';
import ProfileScreen from './screens/ProfileScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

function AppNavigator() {
  const { userToken } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {userToken == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FoodTracker" component={FoodTracker} options={{ title: 'Log Food' }} />
          <Stack.Screen name="WaterTracker" component={WaterTracker} options={{ title: 'Log Water' }} />
          <Stack.Screen name="SleepTracker" component={SleepTracker} options={{ title: 'Log Sleep' }} />
          <Stack.Screen name="WorkoutTracker" component={WorkoutTracker} options={{ title: 'Log Workout' }} />
          <Stack.Screen name="JunkTracker" component={JunkTracker} options={{ title: 'Log Junk Food' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
