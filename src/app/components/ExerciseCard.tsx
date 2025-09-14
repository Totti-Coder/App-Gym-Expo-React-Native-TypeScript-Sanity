import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ejercicio } from 'studio-app-gym/sanity.types'
import { urlFor } from '@/lib/studio-app-gym/client'

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

interface ExerciseCardProps {
  item: Ejercicio
  onPress: () => void
  showChevron?: boolean
}

export default function ExerciseCard({
  item,
  onPress,
  showChevron = false,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      <View className='flex-row items-center'>
        {/* Imagen del ejercicio */}
        <View className='w-20 h-20 bg-gray-100 rounded-xl mr-4 overflow-hidden'>
          {item.imagen ? (
            <Image
              source={{ uri: urlFor(item.imagen).url() }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className='w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center'>
            </View>
          )}
        </View>
        
        {/* Contenido del ejercicio */}
        <View className='flex-1'>
          {/* Nombre del ejercicio */}
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {item.nombre}
          </Text>
          
          {/* Descripción */}
          <Text className="text-gray-500 text-sm mb-3 leading-5">
            {item.descripcion}
          </Text>
          
          {/* Dificultad */}
          {item.dificultad && (
            <View className='flex-row items-center'>
              <View className={`px-3 py-1 rounded-full ${getDifficultyColor(item.dificultad)}`}>
                <Text className='text-white text-xs font-medium'>
                  {getDifficultyText(item.dificultad)}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Chevron condicional */}
        {showChevron && (
          <View className='ml-2 justify-center'>
            <Text className="text-gray-400 text-xl">›</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}