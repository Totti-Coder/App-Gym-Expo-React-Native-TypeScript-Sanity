import { Text, View, StatusBar, Platform, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from "react-native"
import React, { useState } from "react"
import { useWorkoutStore } from "store/workout-store"
import { useStopwatch } from "react-timer-hook"
import { Ionicons } from "@expo/vector-icons"
import ExerciseSelectionModal from "@/app/components/ExerciseSelectionModal"
import { useRouter } from "expo-router"

export default function ActiveWorkout() {
  const [showExerciseSelection, setShowExerciseSelection] = useState(false)
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore()

  const router = useRouter()

  const { seconds, minutes, hours, reset } = useStopwatch({ autoStart: true })

  const getWorkoutDuration = () => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  
const cancelWorkout = () => {
  if (Platform.OS === "web") {
    // En Web utilizo confirm
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar el entrenamiento?")
    if (confirmed) {
      resetWorkout()
      reset()
      if (window.history.length > 1) {
        router.back()
      }
    }
  } else {
    // Para iOS/Android utilizo Alert
    Alert.alert(
      "Elimina el entreno",
      "¿Estás seguro de que quieres eliminar el entrenamiento?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Finalizar entrenamiento",
          onPress: () => {
            resetWorkout()
            reset()
            if (router.canGoBack()) {
              router.back()
            }
          },
        },
      ]
    )
  }
}


const addExercise = () => {
  setShowExerciseSelection(true)
}

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#1F2937" />

      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? 55 : StatusBar.currentHeight || 0,
        }}
      />
        {/* Encabezado */}
        <View className="bg-gray-800 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-semibold">
                Entrenamiento en Vivo
              </Text>
              <Text className="text-gray-300">{getWorkoutDuration()}</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded ${
                    weightUnit === "lbs" ? "bg-blue-600" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "lbs" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
                
              </View>
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("kg")}
                  className={`px-3 py-1 rounded ${
                    weightUnit === "kg" ? "bg-green-600" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "kg" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    kg
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botón cancelar */}
              <TouchableOpacity
                onPress={cancelWorkout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                <Text className="text-white font-medium text-sm">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* El contenido principal*/}
        <View className="flex-1 bg-white">
          {/* El progreso del entrenamiento */}
          <View className="px-6 mt-4">
            <Text className="text-center text-gray-600 mb-2">
              {workoutExercises.length} Ejercicios
            </Text>
          </View>
          {/* Formato para cuando no hay ejercicios */}
          {workoutExercises.length === 0 && (
            <View className="bg-gray-50 rounded-2xl p-8 items-center mx-6">
              <Ionicons name="barbell-outline" size={48} color="#9CA3AF"/>
              <Text className="text-gray-600 text-lg text-center mt-4 font-medium">
                No hay ejercicios
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Empieza por añadir tus ejercicios abajo!
              </Text>
              </View>
          )}

          {/* Todos los ejercicios*/}
          <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1">
            <ScrollView className="flex-1 px-6 mt-4">
              {workoutExercises.map((exercise) => (
                <View key={exercise.id} className="mb-8">
                  {/* Encabezado del Ejercicio */}
                </View>
              ))}

              {/* Boton de agregar ejercicios*/}
              <TouchableOpacity
              onPress={addExercise}
              className="bg-blue-600 rounded-2xl py-4 items-center mb-8 active:bg-blue-700"
              activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <Ionicons
                  name="add"
                  size={20}
                  color="white"
                  style={{marginRight: 8}}
                  />
                  <Text className="text-white font-semibold text-lg">
                    Añade un ejercicio
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>

        <ExerciseSelectionModal
        visible={showExerciseSelection}
        onClose={() => setShowExerciseSelection(false)}>
        
        </ExerciseSelectionModal>
    </View>
  )
}
