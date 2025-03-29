


import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import BusDetailScreen from '../screens/busDetail/BusDetailScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import PassengerDetailsScreen from '../screens/PassengerDetailsScreen.js';
import PaymentScreen from '../screens/PaymentScreen';
import BookingPaymentScreen from '../screens/BookingPaymentScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} />
        <Stack.Screen name="BusDetail" component={BusDetailScreen} />
        <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
        <Stack.Screen name="BookingSummary" component={BookingPaymentScreen} />
        {/*<Stack.Screen name="PassengerDetails" component={PassengerDetailsScreen} />*/}
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;