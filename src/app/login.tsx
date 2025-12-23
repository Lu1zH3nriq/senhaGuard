import { signIn, signUp } from "@/src/lib/auth";
import { Href, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSignIn() {
    try {
      if (!email || !password) {
        Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
        return;
      }
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/senhas" as Href);
    } catch (e: any) {
      Alert.alert("Login falhou", e?.message ?? "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    try {
      if (!email || !password) {
        Alert.alert("Campos obrigatórios", "Informe e-mail e senha.");
        return;
      }
      setLoading(true);
      await signUp(email.trim(), password);
      router.replace("/senhas" as Href);
    } catch (e: any) {
      Alert.alert("Cadastro falhou", e?.message ?? "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0b1b3a]">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-8 text-3xl font-bold text-white">Entrar</Text>

        <View className="w-full max-w-xs gap-3">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            placeholderTextColor="#64748b"
            className="h-12 rounded-xl border border-slate-800 bg-slate-950 px-4 text-white"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor="#64748b"
            className="h-12 rounded-xl border border-slate-800 bg-slate-950 px-4 text-white"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Pressable
            disabled={loading}
            onPress={handleSignIn}
            className={`items-center rounded-full px-6 py-4 ${loading ? "bg-slate-700" : "bg-blue-500"}`}
          >
            <Text className="text-center text-lg font-semibold text-white">{loading ? "Entrando..." : "Entrar"}</Text>
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={handleSignUp}
            className={`items-center rounded-full px-6 py-4 ${loading ? "bg-slate-700" : "bg-slate-800"}`}
          >
            <Text className="text-center text-lg font-semibold text-white">Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
