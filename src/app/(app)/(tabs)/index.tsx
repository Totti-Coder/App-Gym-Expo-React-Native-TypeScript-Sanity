import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { formatDuration } from "lib/utils";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GetWorkoutsQueryResult } from "@/lib/studio-app-gym/types";
import { getWorkoutsQuery } from "./history";
import { client } from "@/lib/studio-app-gym/client";
import exercise from "studio-app-gym/schemaTypes/exercise";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;

    try {
      const results = await client.fetch(getWorkoutsQuery, { userId: user.id });
      setWorkouts(results);
    } catch (error) {
      console.error("Error cargando los entrenamientos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  // Calculo de estadisticas (Se mantiene sin cambios)
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.durationInSeconds || 0),
    0
  );
  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

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

  const getTotalSets = (workout: GetWorkoutsQueryResult[number]) => {
    return workout.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0);
    }, 0);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Cargando el perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Encabezado */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-lg text-gray-600">Bievenido de vuelta!</Text>
          <Text className="text-3xl font-bold text-gray-900 mt-2">
            {user?.firstName || "Atleta"}
          </Text>
        </View>

        {/* Estadisticas */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-2xl font-semibold text-gray-900 mb-4">
              Mis Estadisticas
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-600">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Total de{"\n"}Entrenamientos
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Tiempo{"\n"}Total
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600">
                  {averageDuration > 0 ? formatDuration(averageDuration) : "0m"}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Duracion{"\n"} Media
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
