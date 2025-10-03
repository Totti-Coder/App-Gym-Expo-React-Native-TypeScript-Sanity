import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import { GetWorkoutsQueryResult } from "@/lib/studio-app-gym/types";
import { client } from "@/lib/studio-app-gym/client";
import { getWorkoutsQuery } from "../history";


export default function ProfilePage() {
  const { signOut } = useAuth();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser() // Obtenemos el objeto user de Clerk

  const fetchWorkouts = async () => {
    if(!user?.id) return

    try{
      const results = await client.fetch(getWorkoutsQuery, {userId: user.id})
      setWorkouts(results)
    } catch (error) {
      console.error("Error cargando los entrenamientos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkouts()
  }, [user?.id])

  // Calculo de estadisticas (Se mantiene sin cambios)
  const totalWorkouts = workouts.length
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.durationInSeconds || 0),
    0
  )
  const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0


  // Calculo de los dias desde que empezo el usuario
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date()
  const daysSinceJoining = Math.floor(
    // Fecha actual en milisegundos menos la fecha de registro del usuario en milisegundos y luego se divide entre los milisegundos de un dia
    (new Date().getTime() - joinDate.getTime()) / 86400000)

  const formatJoinDate = (date: Date) => {
    // Obtengo la fecha
    const dateString = date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric"
    });
    // Convierte la primera letra a mayúscula y concatena el resto de la cadena.
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
}

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  if (loading){
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6"/>
          <Text className="text-gray-500 mt-4">Cargando el perfil...</Text>
        </View>
      </SafeAreaView>
    )
  }
  
  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView>
      {/* Encabezado */}
      <View className="px-6 pt-8 pb-6">
        <Text className="text-2xl font-bold text-gray-900">Mi Perfil</Text>
        <Text className="text-base text-gray-600 mt-1">
          Controla tu cuenta y tus estadisticas
        </Text>
      </View>

      {/* Informacion del usuario*/}
      <View className="px-6 mb-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          
          <View className="flex-row items-center mb-4">
            {/* Imagen de perfil */}
            <View className="w-16 h-16 rounded-full items-center justify-center mr-4">
              <Image
              source={{
                uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
              }}
              className="rounded-full"
              style={{ width: 64, height: 64}}/>
            </View>
            
            {/* Nombre y Correo */}
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                    {user?.fullName || user?.firstName || "Usuario"}
                </Text>
                <Text className="text-sm text-gray-500">
                    {user?.emailAddresses[0]?.emailAddress}
                </Text>
            </View>
          </View>

          {/* Fecha de Registro y Días activo */}
          <View className="pt-3 border-t border-gray-100 mt-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                  Miembro desde:
              </Text>
              <Text className="text-lg font-bold text-blue-600">
                  {formatJoinDate(joinDate)}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                  {`Llevas ${daysSinceJoining} días activo en la aplicación.`}
              </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas (Puedes añadir esta sección si quieres mostrar el resto de cálculos) */}
      <View className="px-6 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">Tus Estadísticas</Text>
        <View className="flex-row justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <StatItem value={totalWorkouts} label="Entrenamientos" valueColor="text-blue-600"/>
            <StatItem value={Math.ceil(totalDuration / 60)} label="Min. Totales" valueColor="text-green-500" />
            <StatItem value={Math.ceil(averageDuration / 60)} label="Min. Promedio" valueColor="text-purple-600"/>
        </View>
      </View>

      {/* Nombre y Correo */}
      <View className="px-6 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Configuraciones
        </Text>


        {/* Configuraciones de la cuenta */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person-outline" size={20} color="#3B82F6"/>
              </View>
              <Text className="text-gray-900 font-medium">Edita tu perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280"/>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="notifications-outline" size={20} color="#10b981"/>
              </View>
              <Text className="text-gray-900 font-medium">Notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280"/>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="settings-outline" size={20} color="#8B5CF6"/>
              </View>
              <Text className="text-gray-900 font-medium">Preferencias</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280"/>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="help-circle-outline" size={20} color="#F59E0B"/>
              </View>
              <Text className="text-gray-900 font-medium">Ayuda & Soporte Tecnico</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280"/>
          </TouchableOpacity>
        </View>
        
      </View>
      


      <View className="px-6 mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-600 rounded-2xl p-4 shadow-sm"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Cerrar Sesion
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para mostrar las estadísticas de forma ordenada
const StatItem = ({ value, label, valueColor }: { value: number; label: string; valueColor: string }) => (
    <View className="items-center w-1/3">
        {/* Usamos el color pasado por prop */}
        <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
        <Text className="text-sm text-gray-500">{label}</Text>
    </View>
);