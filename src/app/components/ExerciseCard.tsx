import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ejercicio } from 'studio-app-gym/sanity.types'

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
    <TouchableOpacity onPress={onPress} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-gray-100">
      <View className='w-20 h-20 bg-white rounded-xl mr-4 overflow-hidden'></View>
      <Text className="text-lg font-semibold text-gray-900">{item.nombre}</Text>
      <Text className="text-gray-500 mt-1">{item.descripcion}</Text>
      {showChevron && <Text className="text-blue-500 mt-2">{'>'}</Text>}
    </TouchableOpacity>
  )
}