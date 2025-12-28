import { Slot } from "expo-router";
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../styles/global.css';

export default function RootLayout() {
  useEffect(() => {
    LogBox.ignoreLogs([
      'SafeAreaView has been deprecated',
    ]);
  }, []);
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
