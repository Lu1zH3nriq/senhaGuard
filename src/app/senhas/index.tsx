import { Header } from "@/src/components/header";
import { removePassword, usePasswords } from "@/src/lib/passwords-realm";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link, useRouter } from "expo-router";
import * as React from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SenhasScreen() {
  const router = useRouter();
  const passwords = usePasswords();
  const [showMap, setShowMap] = React.useState<Record<string, boolean>>({});



  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <Header
        title="Minhas senhas"
        onActionPress={() => router.push("/senhas/nova" as Href)}
        actionIconName="add"
      />

      <FlatList
        data={passwords}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <View className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-white">{item.titulo}</Text>
              <View className="flex-row items-center gap-3">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showMap[item.id] ? "Ocultar senha" : "Mostrar senha"}
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center rounded-md bg-slate-800"
                  onPress={() => setShowMap((m) => ({ ...m, [item._id.toString()]: !m[item._id.toString()] }))}
                >
                  <Ionicons name={showMap[item.id] ? "eye-off" : "eye"} size={16} color="#e2e8f0" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Editar senha"
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center rounded-md bg-slate-800"
                  onPress={() => router.push({ pathname: "/senhas/nova", params: { id: item._id.toString() } } as Href)}
                >
                  <Ionicons name="pencil" size={16} color="#e2e8f0" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Excluir senha"
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center rounded-md bg-red-600"
                  onPress={() => {
                    const title = item.titulo;
                    Alert.alert(
                      "Excluir senha",
                      `Deseja realmente excluir \"${title}\"?`,
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Excluir",
                          style: "destructive",
                          onPress: () => {
                            removePassword(item._id as any);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash" size={16} color="white" />
                </Pressable>
              </View>
            </View>
            <Text className="text-sm text-slate-300">{item.usuario}</Text>
            {item.senha ? (
              <Text className="text-sm text-slate-300">
                {showMap[item._id.toString()] ? item.senha : "••••••••"}
              </Text>
            ) : null}
            {item.url ? (
              <Text className="text-xs text-slate-400">{item.url}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={(
          <View className="mt-16 items-center gap-3">
            <Ionicons name="lock-closed" size={48} color="#64748b" />
            <Text className="text-base text-slate-300">Nenhuma senha cadastrada ainda.</Text>
            <Link href={"/senhas/nova" as Href} asChild>
              <Pressable className="flex-row items-center gap-2 rounded-full bg-blue-500 px-4 py-2">
                <Ionicons name="add" size={18} color="white" />
                <Text className="text-sm font-semibold text-white">Cadastrar nova</Text>
              </Pressable>
            </Link>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
