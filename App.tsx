import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Signal Desk — a three-screen prototype for scanning fictional insider-activity
 * demo records. The app is fully offline: it reads a hand-written local array and
 * makes no network requests of any kind.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
