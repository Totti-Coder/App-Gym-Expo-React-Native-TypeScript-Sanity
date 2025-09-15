import { client } from "@/lib/studio-app-gym/client";
import { GetWorkoutsQueryResult, Workout } from "@/lib/studio-app-gym/types";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { defineQuery } from "groq";
import { formatDuration } from "lib/utils";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";

export const getWorkoutsQuery = defineQuery(`
  *[_type == "workout" && userId == $userId] | order(date desc) {
    _id,
    date,
    durationInSeconds,
    exercises[] {
    Ejercicio->{
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
  const { refresh } = useLocalSearchParams()
  const router = useRouter()

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
    fetchWorkouts();
  }, [user?.id]);

  //
  useEffect(() => {
    if( refresh === "true") {
      fetchWorkouts()
      router.replace("/(app)/(tabs)/history")
    }
  }, [refresh])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWorkouts()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()){
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()){
      return "Ayer"
    }else {
      return date.toLocaleDateString("es-ES", {
        weekday: "short", // lun, mar,,mier...
        month:"short", // enero, febrero...
        day:"numeric" // 1,2,3...
      })
    }
  }

  const formatWorkoutDuration = (seconds?:number) => {
    if(!seconds) return "Esta duracion no esta recogida"
    return formatDuration(seconds)
  }

  return (
    <SafeAreaView className="flex flex-1">
      <Text>History</Text>
    </SafeAreaView>
  );
}
