import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function DrawerShellLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="id-card"
        options={{
          headerShown: true,
          title: 'Digital Student ID',
        }}
      />
      <Stack.Screen
        name="library"
        options={{
          headerShown: true,
          title: 'E-Library & Resources',
        }}
      />
      <Stack.Screen
        name="grades"
        options={{ headerShown: true, title: 'Academic Results' }}
      />
      <Stack.Screen
        name="news"
        options={{ headerShown: true, title: 'Campus Announcements' }}
      />
      <Stack.Screen
        name="exam-card"
        options={{ headerShown: true, title: 'Examination Card' }}
      />
      <Stack.Screen
        name="access"
        options={{ headerShown: true, title: 'My Access Center' }}
      />
      <Stack.Screen
        name="access-denied"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
