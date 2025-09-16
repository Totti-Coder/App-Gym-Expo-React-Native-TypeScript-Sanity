import { Stack } from "expo-router";

function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="workout-record"
      options={{
        headerShown: true,
        headerTitle: "Historial De Entrenamientos",
        headerBackTitle: "Volver"
      }}/>
    </Stack>
  );
}

export default Layout;
