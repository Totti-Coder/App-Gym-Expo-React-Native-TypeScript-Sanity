import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";

function Workout() {
  const router = useRouter();
  // Funcion que nos redirije a la pantalla de active-workout
  const startWorkout = () => {
    router.push("/active-workout");
  };
 return (
  <SafeAreaView className="flex-1 bg-gray-50">
    <StatusBar barStyle="dark-content" />

    {/* Pantalla principal de la seccion: Entrenamiento */}
    <View className="flex-1 px-6">
      {/* Encabezado */}
      <View className="pt-8 pb-6">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          ¿Preparado para Entrenar?
        </Text>
        <Text className="text-lg text-gray-600">
          Empieza tu sesión de entrenamiento
        </Text>
      </View>

      {/* Carta generica para crear el entrenamiento */}
      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        {/* Fila con icono, texto y chip */}
        <View className="flex-row items-center justify-between mb-4">
          {/* Icono */}
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
            <Ionicons name="fitness" size={24} color="#3B82F6" />
          </View>

          {/* Texto */}
          <View className="flex-1">
            <Text className="text-xl font-semibold text-gray-900 mb-1">
              Crea tu entrenamiento
            </Text>
            <Text className="text-gray-500">
              Empieza tu sesión de entrenamiento
            </Text>
          </View>

          {/* Chip Preparado */}
          <View className="bg-green-100 px-3 py-1 rounded-full ml-2">
            <Text className="text-green-700 font-medium text-sm">
              ¿Preparado?
            </Text>
          </View>
        </View>

        {/* Botón de comienzo dentro de la tarjeta */}
        <TouchableOpacity
          onPress={startWorkout}
          className="bg-blue-600 rounded-2xl py-3 items-center active:bg-blue-700"
          activeOpacity={0.9}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="play"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Empieza el Entrenamiento
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);
}

export default Workout;
