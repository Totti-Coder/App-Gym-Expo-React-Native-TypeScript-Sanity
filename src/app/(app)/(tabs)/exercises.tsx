import { Text, SafeAreaView, View, TextInput, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import {defineQuery} from "groq"
import { client } from '@/lib/studio-app-gym/client'
import { Ejercicio } from 'studio-app-gym/sanity.types'
import ExerciseCard from '@/app/components/ExerciseCard'

// Define the query outside the component for proper type generation
export const exercisesQuery = defineQuery(`*[_type == "Ejercicio" && isActive == true] | order(nombre asc) {
  _id,
  _rev,
  _type,
  nombre,
  descripcion,
  dificultad,
  imagen {
    asset->{
      _id,
      url
    },
    alt,
    caption
  },
  videoUrl,
  isActive,
  _createdAt,
  _updatedAt
}`)

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("")
  const [exercises, setExercises] = useState<Ejercicio[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Ejercicio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const fetchExercises = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 Iniciando fetch de ejercicios...')
      
      // Prueba con query más simple primero
      const result = await client.fetch(`*[_type == "Ejercicio"]`)
      // Ahora con la query completa
      const exercises = await client.fetch(exercisesQuery)
      
      
      setExercises(exercises)
      setFilteredExercises(exercises)
    } catch(error) {
      console.error("❌ Error al hacer fetching a los ejercicios:", error)
      setError(error.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Efecto para filtrar ejercicios cuando cambia el searchQuery
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExercises(exercises)
    } else {
      const filtered = exercises.filter(exercise =>
        //Al poner cualquier letra del nombre del ejercicio te lo busca
        exercise.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //Al poner cualquier letra del nombre de la descripcion te lo busca
        exercise.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //Al poner cualquier letra de la dificultad ejercicio te lo busca
        exercise.dificultad?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredExercises(filtered)
    }
  }, [searchQuery, exercises])

  useEffect(() => {
    fetchExercises()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchExercises()
    setRefreshing(false)
  }

  // Debug del client
  useEffect(() => {
    console.log({
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
    })
  }, [])

  const getEmptyStateMessage = () => {
    if (loading) return "Cargando ejercicios..."
    if (error) return `Error: ${error}`
    if (searchQuery && filteredExercises.length === 0) return "No se encontraron ejercicios"
    if (exercises.length === 0) return "No hay ejercicios creados en Sanity"
    return "No hay ejercicios"
  }

  const getEmptyStateSubtitle = () => {
    if (loading) return "Conectando con Sanity Studio..."
    if (error) return "Revisa tu conexión y configuración de Sanity"
    if (searchQuery && filteredExercises.length === 0) return "Intenta ajustar tu búsqueda"
    if (exercises.length === 0) return "Ve a tu Sanity Studio y crea algunos ejercicios con isActive: true"
    return ""
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Libreria de Ejercicios
        </Text>
        <Text className="text-gray-600 mt-1">
          Descubre y masteriza nuevos ejercicios ({exercises.length} total)
        </Text>

        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Buscando ejercicios..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de ejercicios */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 24}}
        renderItem={({item}) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            title="Actualizando ejercicios..."
            titleColor="#6B7280"
          />
        }
        ListEmptyComponent={
          <View className='bg-white rounded-2xl p-8 items-center'>
            <Ionicons 
              name={error ? "alert-circle-outline" : loading ? "refresh-outline" : "fitness-outline"} 
              size={64} 
              color={error ? "#EF4444" : "#9CA3AF"}
            />
            <Text className='text-xl font-semibold text-gray-900 mt-4'>
              {getEmptyStateMessage()}
            </Text>
            <Text className='text-gray-600 text-center mt-2'>
              {getEmptyStateSubtitle()}
            </Text>
            {error && (
              <TouchableOpacity 
                onPress={fetchExercises}
                className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
              >
                <Text className="text-white font-semibold">Reintentar</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  )
}