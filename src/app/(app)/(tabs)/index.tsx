import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  return (
    <SafeAreaView className="flex flex-1">
      <Content />
    </SafeAreaView>
  );
}

function Content() {
  return (
    <View className="px-6 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Links</Text>
        {/* Boton de empezar tu entrenamiento */}
        <TouchableOpacity
        onPress={() => router.push("/active-workout")}
        className="bg-blue-700 rounded-2xl p-6 mb-4 shadow-sm"
        activeOpacity={0.8}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-blue-400 rounded-full items-center justify-center mr-4">
                <Ionicons name="play" size={20} color="white"/>
              </View>
              <View>
                <Text className="text-white text-xl font-semibold">
                  Empieza tu entrenamiento
                </Text>
                <Text className="text-blue-200">
                  Empieza a entrenar aqui!
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="white"/>
          </View>
        </TouchableOpacity>
      
        
      </View>
  )}