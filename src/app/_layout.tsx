import { subscribeAuth } from "@/src/lib/auth";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../styles/global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    LogBox.ignoreLogs([
      'SafeAreaView has been deprecated',
    ]);
  }, []);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (initializing) return;
    const inAuth = segments[0] === 'login';
    if (!user && !inAuth) {
      router.replace('/login' as any);
    }
    if (user && segments[0] === 'login') {
      router.replace('/senhas' as any);
    }
  }, [user, initializing, segments]);
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
