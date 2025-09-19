import { View, Text, Modal, StatusBar, TouchableOpacity, TextInput, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "store/workout-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ExerciseCard from "./ExerciseCard";
import { Ejercicio } from "studio-app-gym/sanity.types";
import { client } from "@/lib/studio-app-gym/client";
import { exercisesQuery } from "../(app)/(tabs)/exercises";


interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ExerciseSelectionModal({
  visible,
  onClose,
}: ExerciseSelectionModalProps) {
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
 // Carga los datos
  const fetchExercises = async () => {
    try{
      const exercises = await client.fetch(exercisesQuery)
      setExercises(exercises)
      setFilteredExercises(exercises)

    }catch (error){
      console.error("Error cargando los ejercicios:", error)
    }
  }
  // Cargar ejercicios cuando el modal se abre
  useEffect(() => {
    if (visible) {
      fetchExercises()
    }
  }, [visible])

  //Funcion para seleccionar el ejercicio
  const handleExercisePress = (exercise: Ejercicio) => {
    addExerciseToWorkout({name: exercise.nombre, sanityId: exercise._id})
    onClose()
  }
// Funcion de Refresh
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchExercises()
    setRefreshing(false)
  }
  return (
    
    <Modal
    visible={visible}
    animationType="slide"
    presentationStyle="pageSheet" // Solo iOs y abajo para web(ESC) y para android
    onRequestClose={onClose}> 
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content"/>

          {/* Encabezado */}
          <View className="bg-white px-4 pt-4 pb-6 shadow-sm border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Agrega un ejercicio
            </Text>
            <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center">
              <Ionicons name="close" size={24} color="#6B7280"/>
            </TouchableOpacity>
            </View>
            <Text className="text-gray-600 mb-4">
              Haz click para agregar nuevos ejercicios
            </Text>
            {/* Barra de busqueda */}
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <Ionicons name="search" size={20} color="#6B7280"/>
              <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Busca el ejercicio..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery} />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle-outline" size={21} color="#6B7280"/>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista de ejercicios */}
          <FlatList
          data={filteredExercises}
          renderItem={({item}) => (
            <ExerciseCard
            item={item}
            onPress={() => handleExercisePress(item)}
            showChevron={false}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
          }}
          refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
            />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="fitness-outline" size={64} color="#d1d5db"/>
                <Text className="text-lg font-semibold text-gray-400 mt-4">
                  {searchQuery ? "No hay ejercicios" : "Cargando los ejercicios..."}
                </Text>
                <Text className="text-sm text-gray-400 mt-2">
                  {searchQuery
                  ? "Intenta ajustar tu busqueda"
                : "Por favor, espere un momento"
                }
                </Text>
              </View>
            }
          />
        </SafeAreaView>
    </Modal>
  );
}