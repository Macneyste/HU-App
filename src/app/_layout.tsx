/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Hormuud University (HU) Mobile Application
 *  Root Application Layout & Global Providers
 *
 *  Providers:
 *   - TanStack Query v5 (React Query)
 *   - GestureHandlerRootView (Reanimated gestures)
 *   - SafeAreaProvider
 *   - Auth Hydration check
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import '../global.css';

// Create a single TanStack Query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(() => useAuthStore.persist.hasHydrated());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  // Wait for the encrypted persisted session before applying auth redirects.
  useEffect(() => {
    const unsubscribeHydrate = useAuthStore.persist.onHydrate(() => setIsReady(false));
    const unsubscribeFinish = useAuthStore.persist.onFinishHydration(() => setIsReady(true));

    setIsReady(useAuthStore.persist.hasHydrated());

    return () => {
      unsubscribeHydrate();
      unsubscribeFinish();
    };
  }, []);

  // Auth routing guard
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if unauthenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to dashboard if logged in
      router.replace('/(drawer)/(tabs)');
    }
  }, [isAuthenticated, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#002147', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFAB00" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
