import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback } from 'react';

/**
 * Applies a status bar style while a screen is focused.
 *
 * A native stack keeps previous screens mounted, so rendering a <StatusBar>
 * per screen would not re-apply on back navigation. Binding to focus does.
 */
export function useStatusBarStyle(style: 'light' | 'dark') {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style, true);
    }, [style]),
  );
}
