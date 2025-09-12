import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
    
  };
  
  return (
    <SafeAreaView className="flex flex-1">
      <Text>Profile</Text>

      <View className="px-6 mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 rounded-2xl p-4 shadow-sm"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Cerrar Sesion
            </Text>
          </View>  
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}