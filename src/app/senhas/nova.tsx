import { Header } from "@/src/components/header";
import { addPassword, getPasswordById, updatePassword } from "@/src/lib/passwords-realm";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Realm from "realm";

export default function NovaSenhaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingId = typeof params.id === "string" ? params.id : undefined;
  const [nome, setNome] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [showSenha, setShowSenha] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    if (editingId) {
      getPasswordById(new Realm.BSON.ObjectId(editingId)).then((current) => {
        if (current) {
          setNome(current.titulo ?? "");
          setLogin(current.usuario ?? "");
          setSenha(current.senha ?? "");
        }
      }).catch(() => {});
    }
  }, [editingId]);

  async function handleSave() {
    try {
      if (!nome.trim() || !login.trim() || !senha) {
        Alert.alert("Campos obrigatórios", "Preencha Nome, Login e Senha.");
        return;
      }

      setSaving(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (editingId) {
        await updatePassword(new Realm.BSON.ObjectId(editingId), {
          titulo: nome.trim(),
          usuario: login.trim(),
          senha,
        });
      } else {
        await addPassword({
          titulo: nome.trim(),
          usuario: login.trim(),
          senha,
        });
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Sucesso", "Senha cadastrada com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error(e);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Não foi possível salvar a senha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <Header title={editingId ? "Editar senha" : "Nova senha"} />

      <View className="flex-1 px-4 pt-6">
        <View className="mb-6 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full border border-slate-800"
          >
            <Ionicons name="arrow-back" size={18} color="#e2e8f0" />
          </Pressable>

          <Text className="text-lg font-semibold text-white">
            Cadastro de nova senha
          </Text>
        </View>

        <View className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-slate-300">
              Nome
            </Text>
            <TextInput
              value={nome}
              onChangeText={setNome}
              placeholder="Ex.: Serviço"
              placeholderTextColor="#64748b"
              className="h-12 rounded-xl border border-slate-800 bg-slate-950 px-4 text-white"
              returnKeyType="next"
              autoCapitalize="sentences"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-slate-300">
              Login
            </Text>
            <TextInput
              value={login}
              onChangeText={setLogin}
              placeholder="login ou e-mail"
              placeholderTextColor="#64748b"
              className="h-12 rounded-xl border border-slate-800 bg-slate-950 px-4 text-white"
              returnKeyType="next"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-2">
            <Text className="mb-2 text-sm font-medium text-slate-300">
              Senha
            </Text>
            <View className="h-12 flex-row items-center rounded-xl border border-slate-800 bg-slate-950 px-2">
              <TextInput
                value={senha}
                onChangeText={setSenha}
                placeholder="••••••••"
                placeholderTextColor="#64748b"
                className="flex-1 px-2 text-white"
                secureTextEntry={!showSenha}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  showSenha ? "Ocultar senha" : "Mostrar senha"
                }
                onPress={() => setShowSenha((v) => !v)}
                hitSlop={12}
                className="h-9 w-9 items-center justify-center rounded-full"
              >
                <Ionicons
                  name={showSenha ? "eye-off" : "eye"}
                  size={20}
                  color="#e2e8f0"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            disabled={saving || !nome.trim() || !login.trim() || !senha}
            onPress={handleSave}
            className={`mt-4 items-center rounded-xl px-4 py-3 ${saving || !nome.trim() || !login.trim() || !senha ? "bg-slate-700" : "bg-blue-600"}`}
          >
            <Text className="text-base font-semibold text-white">
              {saving ? "Salvando..." : "Cadastrar"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
