import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LaunchScreen } from './src/components/LaunchScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

// Hold the native splash until the typeface is ready, so the first frame is
// never rendered in a fallback system font.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 220, fade: true });

/**
 * Signal Desk — a three-screen prototype for scanning fictional
 * insider-activity records. Fully offline: it reads a hand-written local array
 * and makes no network requests of any kind.
 */
export default function App() {
  const [introDone, setIntroDone] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // Hand off as soon as the typeface is ready; waiting for a layout pass here
  // is what made the native splash sit still for an extra beat.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // If the font fails to load we still render rather than hang on the splash.
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.canvas }}>
          <StatusBar style="light" />
          <AppNavigator />
          {!introDone && <LaunchScreen onDone={() => setIntroDone(true)} />}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
