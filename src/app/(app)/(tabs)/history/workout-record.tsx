import { client } from "@/lib/studio-app-gym/client";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { defineQuery } from "groq";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from "react-native";
import exercise from "studio-app-gym/schemaTypes/exercise";

export const getWorkoutRecordQuery = defineQuery(`
  *[_type == "workout" && _id == $workoutId] [0] {
    _id,
    date,
    durationInSeconds,
    exercises[] {
      exercise->{
        _id,
        nombre,
        descripcion
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
  }
`);

export default function WorkoutRecord() {
    const {workoutId} = useLocalSearchParams()
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [workout, setWorkout] = useState<any>(null)

useEffect(() => {
  if (!workoutId) return

  const fetchWorkout = async () => {
    try {
      const results = await client.fetch(getWorkoutRecordQuery, { workoutId })
      setWorkout(results)
    } catch (error) {
      console.error("Error cargando el entrenamiento:", error)
    } finally {
      setLoading(false)
    }
  }
  fetchWorkout()
}, [workoutId])

const formatDate= (dateString?: string) => {
  if(!dateString) return "Fecha Desconocida"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

const formatDuration = (seconds?: number) => {
  if(!seconds) return "La duracion no se encuentra disponible"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

const formatTime = (dateString?: string) => {
  if(!dateString) return "Hora Desconocida"
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTotalSets = () =>{
  return (
    workout?.exercises?.reduce((total, exercise) => {
      return total + (exercise.sets?.length || 0)
    }, 0 || 0)
  )
}


const getTotalVolume = () => {
  const result = workout?.exercises?.reduce(
    (acc, exercise) => {
      const exerciseVolume = exercise.sets?.reduce((setAcc, set) => {
        if (set.weight && set.reps) {
          // Update unit from the last valid set
          acc.unit = set.weightUnit || "lbs"
          return setAcc + (set.weight * set.reps)
        }
        return setAcc
      }, 0) || 0
      
      return {
        volume: acc.volume + exerciseVolume,
        unit: acc.unit
      }
    },
    { volume: 0, unit: "lbs" }
  )
  
  return result || { volume: 0, unit: "lbs" }
}

if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500">Cargando entrenamientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

if (!workout) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center"> {/* justify-center en lugar de jutsify-center */}
        <Ionicons name = "alert-circle-outline" size={65} color="#EF4444"/>
        <Text className="text-xl font-semibold text-gray-900 mt-4">
          No se ha encontrado el entrenamiento.
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Este entrenamiento no se ha podido encontrar.
        </Text>
        <TouchableOpacity
        onPress={() => router.back()}
        className="bg-blue-600 px-6 py-3 rounded-lg mt-6">
          <Text className="text-white font-medium">
            Vuelve
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const { volume, unit } = getTotalVolume()

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Resumen del entrenamiento */}
        <View className="bg-white p-6 border-b border-gray-300">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-gray-900">
            Resumen del entrenamiento
          </Text>
          <TouchableOpacity
          //onPress={handleDeleteWorkout}
          disabled={deleting}
          className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center">
            {deleting ? (
              <ActivityIndicator size="small" color="#FFFFFF"/>
            ) : (
              <>
              <Ionicons name="trash-bin-outline" size={16} color="#FFFFFF"/>
              <Text className="text-white font-medium ml-2"> Borrar </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {/* La fecha del entrenamiento */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="calendar-outline" size={20} color="#6B7280"/>
          <Text className="text-gray-700 ml-3 font-medium">
            {formatDate(workout.date)} a las {formatTime(workout.date)}
          </Text>
        </View>
          {/* La duracion del entrenamiento */}
          <View className="flex-row items-center mb-3">
          <Ionicons name="time-outline" size={20} color="#6B7280"/>
          <Text className="text-gray-700 ml-3 font-medium">
            {formatDuration(workout.durationInSeconds)}
          </Text>
          {/* Los ejercicios realizados */}
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="fitness-outline" size={20} color="#6B7280"/>
          <Text className="text-gray-700 ml-3 font-medium">
            {workout.exercises?.length || 0} Ejercicios
          </Text>
        </View>
          {/* El numero de sets hechos */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="bar-chart-outline" size={20} color="#6B7280"/>
          <Text className="text-gray-700 ml-3 font-medium">
            {getTotalSets()} series totales
          </Text>
        </View>
        {/* El volumen de entreno */}
        {volume > 0 && (
          <View className="flex-row items-center mb-3">
          <Ionicons name="barbell-outline" size={20} color="#6B7280"/>
          <Text className="text-gray-700 ml-3 font-medium">
            {volume.toLocaleString()} {unit} de Volumen Total
          </Text>
        </View>
        )}
        </View>

        {/* Lista de Ejercicios */}
        <View className="space-y-4 p-6 gap-4">
          {workout.exercises?.map((exerciseData, index) => {
            return <View key={exerciseData._key}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* El encabezado de los Ejercicios */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {exerciseData.exercise?.nombre || "Ejercicio Desconocido"}
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {exerciseData.sets?.length || 0} sets completados
                  </Text>
                  </View>
                  <View className="bg-blue-100 rounded-2xl w-8 h-8 items-center justify-center">
                    <Text className="text-blue-600 font-bold">{index+1}</Text>
                  </View>
                </View>
              
            </View>
          })}
        </View>
        
        </ScrollView>
    </SafeAreaView>
  )
}