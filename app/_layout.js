import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { AccessibilityProvider } from '../src/context/AccessibilityContext';
import AccessibilityToolbar from '../src/components/common/AccessibilityToolbar';

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile/setup" />
        </Stack>
        <AccessibilityToolbar />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
