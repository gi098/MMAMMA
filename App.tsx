import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { BookProvider } from './src/context/BookContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookProvider>
          <AppNavigator />
          <StatusBar style="dark" />
        </BookProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
