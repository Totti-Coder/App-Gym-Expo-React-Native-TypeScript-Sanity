import { client } from "@/lib/studio-app-gym/client";
import { GetWorkoutsQueryResult, Workout } from "@/lib/studio-app-gym/types";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fixCurrentParams } from "expo-router/build/fork/getPathFromState-forks";
import { defineQuery } from "groq";
import { formatDuration } from "lib/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


export const getWorkoutsQuery = defineQuery(`
  *[_type == "workout" && userId == $userId] | order(date desc) {
    _id,
    date,
    durationInSeconds,
    exercises[] {
    exercise->{
        _id,
        nombre
        },
      sets[] {
        reps,
        weight,
        weightUnit,
        _type,
        _key,
      },
        _type,
        _key
    }
  }`);

export default function HistoryPage() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh } = useLocalSearchParams();
  const router = useRouter();

   //Funcion que sirve para obtener los datos de un usuario en especifico
  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const result = await client.fetch(getWorkoutsQuery, { userId: user.id });
      setWorkouts(result);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      console.log("user.id:", user.id); // Para ver por consola el usuario y comprobar que se hace correctamente el fetch al servidor de sanity
      fetchWorkouts();
    }
  }, [user?.id]);
  // Cuando se actualice la pagina te redirecciona a dicha ruta
  useEffect(() => {
    if (refresh === "true") {
      fetchWorkouts();
      router.replace("/(app)/(tabs)/history");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

   //Funcion para obtener la fecha exacta del entreno
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "short", // lun, mar,,mier...
        month: "short", // enero, febrero...
        day: "numeric", // 1,2,3...
      });
    }
  };

  const formatWorkoutDuration = (seconds?: number) => {
    if (!seconds) return "Esta duracion no esta recogida";
    return formatDuration(seconds);
  };

const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
  return (
    workout.exercises?.reduce((total, exercise) =>{
      return total + (exercise.sets?.length || 0)
    }, 0) || 0
  )
}

  //Funcion de cargado del historial
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Historial de entrenos
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500">Cargando entrenamientos...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Encabezado / Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Historial De Entrenamientos
        </Text>
        <Text className="text-gray-600 mt-1">
          {workouts.length} entreno{workouts.length !== 1 ? "s" : ""} completado
        </Text>
      </View>

      {/* Lista de Entrenamientos */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 25 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      > 
        {workouts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="barbell-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No hay entrenamientos
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Tus entrenamientos completados apareceran aqui
            </Text>
          </View>
        ) : (
          //Muestro por pantalla en caso de que todo vaya correctamente la lista de entrenos
          <View className="space-y-4 gap-4">
            {workouts.map((workout) => (
              <TouchableOpacity
                key={workout._id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: "/history/workout-record",
                    params: {
                      workoutId: workout._id,
                    },
                  });
                }}
              >
                {/* Historial del Workout */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {formatDate(workout.date || "")}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="time-outline" size={16} color="#6B7280"/>
                      <Text className="text-gray-600 ml-2">
                        {formatWorkoutDuration(workout.durationInSeconds)}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                    <Ionicons name="fitness-outline" size={24} color="#3B82F6"/>
                  </View>
                </View>

                {/* Estadisticas del workout */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-sm font-medium text-gray-700">
                        {workout.exercises?.length || 0} Ejercicios
                      </Text>
                    </View>
                    <View className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-700">
                        {getTotalSets(workout)} Sets
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
