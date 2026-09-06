import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarDays, LayoutDashboard, UserRound, WalletCards } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, shadows } from '../../../theme';

function TabIcon({ Icon, color, focused }: { Icon: LucideIcon; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconShell, focused && styles.iconShellActive]}>
      <Icon size={21} color={color} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 7),
          paddingTop: 7,
          ...shadows.card,
        },
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={LayoutDashboard} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={CalendarDays} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={WalletCards} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={UserRound} color={String(color)} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconShell: { width: 38, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconShellActive: { backgroundColor: '#EAF0F6' },
  label: { fontSize: 11, fontWeight: '700', marginTop: 1 },
});
