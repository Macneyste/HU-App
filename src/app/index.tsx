import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2 } from 'lucide-react-native';
import { useAuthStore } from '../store/useAuthStore';

export default function IndexScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(drawer)/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={{ flex: 1, backgroundColor: '#002147', alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 171, 0, 0.15)',
          borderWidth: 2,
          borderColor: '#FFAB00',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Building2 size={46} color="#FFAB00" />
      </View>
      <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: 1 }}>
        HORMUUD UNIVERSITY
      </Text>
      <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4, letterSpacing: 0.5 }}>
        Mobile Campus Portal
      </Text>
      <ActivityIndicator size="small" color="#FFAB00" style={{ marginTop: 24 }} />
    </View>
  );
}
