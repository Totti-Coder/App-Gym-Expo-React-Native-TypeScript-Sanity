import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Ejercicio } from "studio-app-gym/sanity.types";
import { client, urlFor } from "@/lib/studio-app-gym/client";
import { defineQuery } from "groq";

const singleExerciseQuery = defineQuery(
  `*[_type == "Ejercicio" && _id == $id] [0]`
);

const getDifficultyColor = (dificultad: string) => {
  switch (dificultad) {
    case "principiante":
      return "bg-green-500"
    case "intermedio":
      return "bg-yellow-500"
    case "avanzado":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getDifficultyText = (dificultad: string) => {
  switch(dificultad) {
    case "principiante":
      return "Principiante"
    case "intermedio":
      return "Intermedio"
    case "avanzado":
      return "Avanzado"
    default:
      return "Desconocido"
  }
}

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exercise, setExercise] = useState<Ejercicio>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      try {
        const exerciseData = await client.fetch(singleExerciseQuery, { id });
        setExercise(exerciseData);
      } catch (error) {
        console.error("Error cargando el ejercicio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="white" />

      {/* Header with close button */}
      <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Images */}
        <View className="h-80 bg-white relative">
          {exercise?.imagen ? (
            <Image
              source={{ uri: urlFor(exercise.imagen).url() }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
              <Ionicons name="fitness" size={80} color="white" />
            </View>
          )}

          {/* Gradient overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Title & Difficulty */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {exercise?.nombre}
              </Text>
              <View
                className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
                  exercise?.dificultad
                )}`}
              >
                <Text className="text-sm font-semibold text-white">
                  {getDifficultyText(exercise?.dificultad)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">
              Descripción:
            </Text>
            <Text className="text-gray-600 leading-6 text-base">
              {exercise?.descripcion || "No se ha encontrado ninguna descripción para este ejercicio"}
            </Text>
          </View>

          {/* Video Section */}
          {exercise?.videoUrl && ( // Added conditional check
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-3">
                Video Tutorial
              </Text>
              <TouchableOpacity
                className="bg-red-500 rounded-xl p-4 flex-row items-center"
                onPress={() => Linking.openURL(exercise.videoUrl)}
              >
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                  <Ionicons name="play" size={20} color="#EF4444" />
                </View>
                <View>
                  <Text className="text-white font-semibold text-lg">
                    ¡Mira este tutorial!
                  </Text>
                  <Text className="text-red-100 text-sm">
                    Aprende la forma correctamente
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};