import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HomeScreen } from '../screens/HomeScreen';
import { ScreenerScreen } from '../screens/ScreenerScreen';
import { TradeDetailsScreen } from '../screens/TradeDetailsScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  /** `autoFocusSearch` is set when the user arrives by tapping Home's search bar. */
  Screener: { autoFocusSearch?: boolean } | undefined;
  /** Only the id travels; the screen resolves the record from local mock data. */
  TradeDetails: { tradeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.hairline,
    primary: colors.ink,
  },
};

/**
 * Each screen draws its own header, so the stack header is disabled globally and
 * the back affordance on Details is a real, labelled button.
 */
export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Screener" component={ScreenerScreen} />
        <Stack.Screen name="TradeDetails" component={TradeDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
