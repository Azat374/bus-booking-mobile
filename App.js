import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./i18n";
const App = () => {
  return (
    <SafeAreaProvider>
      
        <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
