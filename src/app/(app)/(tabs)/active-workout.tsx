// Es la pantalla donde registras tu entrenamiento en tiempo real: añades ejercicios, registras series, pesos y repeticiones, y marcas cuando completas cada serie.
import {
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useWorkoutStore, WorkoutSet } from "store/workout-store";
import { useStopwatch } from "react-timer-hook";
import { Ionicons } from "@expo/vector-icons";
import ExerciseSelectionModal from "@/app/components/ExerciseSelectionModal";
import { useRouter } from "expo-router";


export default function ActiveWorkout() {
  const [showExerciseSelection, setShowExerciseSelection] = useState(false);
  const {
    workoutExercises,
    setWorkoutExercises,
    resetWorkout,
    weightUnit,
    setWeightUnit,
  } = useWorkoutStore();

  const router = useRouter();

  // Cronometro automatico
  const { seconds, minutes, hours, reset } = useStopwatch({ autoStart: true });

  // Formateo del tiempo
  const getWorkoutDuration = () => {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Cancela el entrenamiento
  const cancelWorkout = () => {
    if (Platform.OS === "web") {
      // En Web utilizo confirm
      const confirmed = window.confirm(
        "¿Estás seguro de que quieres eliminar el entrenamiento?"
      );
      if (confirmed) {
        resetWorkout(); // Limpia el entrenamiento
        reset(); // Resetea el cronometro
        if (window.history.length > 1) {
          router.back(); // Vuelve atras
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
              resetWorkout();
              reset();
              if (router.canGoBack()) {
                router.back();
              }
            },
          },
        ]
      );
    }
  };

  // Para agregar un ejercicio
  const addExercise = () => {
    setShowExerciseSelection(true);
  };

  // Para eliminar un ejercicio
  const deleteExercise = (id: string) => {};

  // Para agregar una nueva serie
  const addNewSet = (exerciseId: string) => {
    const newSet: WorkoutSet = {
      id: Math.random().toString(),
      reps: "",
      weight: "",
      weightUnit: weightUnit,
      isCompleted: false,
    };

    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight",
    value: string
  ) => {
    setWorkoutExercises((exercises) =>
      // Recorre TODOS los ejercicios
      exercises.map(
        (exercise) =>
          //¿Es este el ejercicio que busco?
          exercise.id === exerciseId
            ? {
                // SÍ → Creo una copia del ejercicio y modifico sus sets
                ...exercise,
                sets: exercise.sets.map(
                  (set) =>
                    // ¿Es este el set que busco?
                    set.id === setId
                      ? { ...set, [field]: value } // SÍ → Actualizo el campo
                      : set // NO → Dejo el set sin cambios
                ),
              }
            : exercise // NO → Dejo el ejercicio sin cambios
      )
    );
  };

  // Marcar series como completadas
  const toggleSetCompletion = (exerciseId: string, setId: string) => {
    setWorkoutExercises((exercises) =>
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId
                  ? { ...set, isCompleted: !set.isCompleted }
                  : set
              ),
            }
          : exercise
      )
    );
  };

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
        {/* Título y cronómetro */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-semibold">
              Entrenamiento en Vivo
            </Text>
            <Text className="text-gray-300">{getWorkoutDuration()}</Text>
          </View>

          {/* Botones de unidad de peso */}
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
            <Ionicons name="barbell-outline" size={48} color="#9CA3AF" />
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
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 mt-4">
            {workoutExercises.map((exercise) => (
              <View key={exercise.id} className="mb-8">
                {/* Encabezado del Ejercicio */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/exercise-detail",
                      params: {
                        id: exercise.sanityId,
                      },
                    })
                  }
                  className="bg-blue-50 rounded-2xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-2">
                        {exercise.name}
                      </Text>
                      <Text className="text-gray-600">
                        {exercise.sets.length} series{" "}
                        {exercise.sets.filter((set) => set.isCompleted).length}{" "}
                        completadas
                      </Text>
                    </View>

                    {/* Boton de eliminar el ejercicio */}
                    <TouchableOpacity
                      onPress={() => deleteExercise(exercise.id)}
                      className="w-9 h-9 rounded-xl items-center justify-center bg-red-400 ml-3"
                    >
                      <Ionicons name="trash" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Las series de los ejercicios */}
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-3">
                  <Text className="text-base font-bold text-gray-900 mb-3">
                    Series
                  </Text>
                  {exercise.sets.length === 0 ? (
                    <Text className="text-gray-600 text-center py-4">
                      No hay series. Añade tu serie abajo.
                    </Text>
                  ) : (
                    exercise.sets.map((set, setIndex) => (
                      <View
                        key={set.id}
                        className={`py-3 px-3 mb-2 rounded-lg border ${
                          set.isCompleted
                            ? "bg-green-200 border-green-300"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {/* Primera linea */}
                        <View className="flex-row items-center justify-between">
                          <Text className="text-gray-800 font-medium w-8">
                            {setIndex + 1}
                          </Text>

                          {/* Input de las repeticiones */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-600 mb-1">
                              Repeticiones
                            </Text>
                            <TextInput
                              value={set.reps}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "reps", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? "bg-gray-200 border-gray-300 text-gray-500"
                                  : "bg-white border-gray-300"
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>
                          {/* Input del Peso */}
                          <View className="flex-1 mx-2">
                            <Text className="text-xs text-gray-600 mb-1">
                              Peso ({weightUnit === "kg" ? "kg" : "lbs"})
                            </Text>
                            <TextInput
                              value={set.weight}
                              onChangeText={(value) =>
                                updateSet(exercise.id, set.id, "weight", value)
                              }
                              placeholder="0"
                              keyboardType="numeric"
                              className={`border rounded-lg px-3 py-2 text-center ${
                                set.isCompleted
                                  ? "bg-gray-200 border-gray-300 text-gray-500"
                                  : "bg-white border-gray-300"
                              }`}
                              editable={!set.isCompleted}
                            />
                          </View>

                          {/* Boton de completado */}
                          <TouchableOpacity
                            onPress={() =>
                              toggleSetCompletion(exercise.id, set.id)
                            }
                            className={`w-10 h-10 rounded-xl items-center justify-center mx-1 ${
                              set.isCompleted ? "bg-green-600" : "bg-gray-200"
                            }`}
                          >
                            <Ionicons
                              name={
                                set.isCompleted
                                  ? "checkmark"
                                  : "checkmark-outline"
                              }
                              size={20}
                              color={set.isCompleted ? "white" : "#9CA3AF"}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}

                  {/* Boton para agregar series */}
                  <TouchableOpacity
                    onPress={() => addNewSet(exercise.id)}
                    className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg py-3 items-center mt-2"
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="add"
                        size={15}
                        color="#3b82f6"
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-blue-600 font-medium">
                        Añade una serie
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
                  style={{ marginRight: 8 }}
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
        onClose={() => setShowExerciseSelection(false)}
      ></ExerciseSelectionModal>
    </View>
  );
}
