import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { MovieProvider } from './src/context/MovieContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MovieProvider>
          <AppNavigator />
          <StatusBar style="dark" />
        </MovieProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
