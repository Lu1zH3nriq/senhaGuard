import { Href, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-[#0b1b3a]">
      <StatusBar style="light" />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-8 text-3xl font-bold text-white">SenhaGuard</Text>

        <Link
          href={"/senhas" as Href}
          asChild
          className="w-full max-w-xs rounded-full bg-blue-500 px-6 py-4"
        >
          <Text className="text-center text-lg font-semibold text-white">Entrar</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
