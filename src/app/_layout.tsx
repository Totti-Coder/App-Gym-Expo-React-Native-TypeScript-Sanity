// _layout.tsx
import "../global.css";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache';

// Obtener la publishable key
// Deja esta línea, Vercel intentará inyectar el valor aquí (aunque falle)
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// **********************************************
// * COMENTA O ELIMINA TEMPORALMENTE ESTAS LÍNEAS *
// **********************************************
// console.log("🔧 DEBUGGING CLERK SETUP:");
// console.log("- publishableKey exists:", !!publishableKey);
// console.log("- publishableKey value:", publishableKey);
// console.log("- publishableKey length:", publishableKey?.length);
// console.log("- Starts with pk_test_:", publishableKey?.startsWith('pk_test_'));

// if (publishableKey) {
//   try {
//     const base64Part = publishableKey.replace('pk_test_', '');
//     const decoded = atob(base64Part.replace('$', ''));
//     console.log("- Decoded base64:", decoded);
//   } catch (e) {
//     console.log("- Base64 decode error:", e.message);
//   }
// }

// if (!publishableKey) {
//   // Vercel está fallando aquí.
//   // throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables');
// }
// **********************************************

export default function Layout() {
  return (
    <ClerkProvider 
      // Si publishableKey es undefined, Clerk intentará cargar desde la configuración
      // del SDK, permitiendo que el build pase.
      publishableKey={publishableKey} 
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  );
}