import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
    title: string;
    onActionPress?: () => void;
    actionIconName?: keyof typeof Ionicons.glyphMap;
};

export function Header({
    title,
    onActionPress,
    actionIconName = "add",
}: HeaderProps) {
    return (
        <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-xl font-semibold text-white">{title}</Text>

            {onActionPress ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Adicionar"
                    onPress={onActionPress}
                    hitSlop={12}
                    className="h-10 w-10 items-center justify-center rounded-full bg-blue-500"
                >
                    <Ionicons name={actionIconName} size={22} color="white" />
                </Pressable>
            ) : (
                <View className="h-10 w-10" />
            )}
        </View>
    );
}