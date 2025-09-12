import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignIn from "../components/GoogleSignIn";


const { height: screenHeight } = Dimensions.get('window');

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [isLoading, setisLoading] = React.useState(false);
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

// Handle the submission of the sign-in form
const onSignInPress = async () => {
  if (!isLoaded) return;
  if (!emailAddress || !password) {
    Alert.alert("Error", "Rellena todos los campos");
    return;
  }

  setisLoading(true);
  try {
    const signInAttempt = await signIn.create({
      identifier: emailAddress,
      password,
    });

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      router.replace("/");
    } else {
      // Maneja casos donde el status no es "complete" (ej: MFA requerido)
      console.error("Sign in incomplete:", JSON.stringify(signInAttempt, null, 2));
      Alert.alert("Error", "No se pudo completar el inicio de sesión");
    }
  } catch (err) {
    console.error("Sign in error:", JSON.stringify(err, null, 2));
    
    // Extraer mensaje de error específico
    let errorMessage = "Error al iniciar sesión";
    
    if (err.errors && err.errors.length > 0) {
      // Clerk suele devolver errores en este formato
      const clerkError = err.errors[0];
      switch (clerkError.code) {
        case "form_identifier_not_found":
          errorMessage = "Email no encontrado";
          break;
        case "form_password_incorrect":
          errorMessage = "Contraseña incorrecta";
          break;
        case "form_identifier_exists":
          errorMessage = "Este email ya está registrado";
          break;
        default:
          errorMessage = clerkError.longMessage || clerkError.message || "Error al iniciar sesión";
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    Alert.alert("Error de autenticación", errorMessage);
  } finally {
    setisLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ 
            minHeight: screenHeight - 100, // Altura mínima fija
            paddingHorizontal: 24,
            paddingVertical: 20,
          }}>
            
            {/* Header section - Posición fija desde arriba */}
            <View style={{ marginTop: 40, marginBottom: 32 }}>
              {/* Logo branding */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#2563eb',
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                  }}
                >
                  <Ionicons name="fitness" size={40} color="white" />
                </View>

                <Text style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: 8,
                  textAlign: 'center'
                }}>
                  Gym-Tracker
                </Text>

                <View style={{ alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 18,
                    color: '#6b7280',
                    textAlign: 'center',
                    lineHeight: 24
                  }}>
                    Registra tus entrenamientos{'\n'}y consigue tus objetivos!
                  </Text>
                </View>
              </View>

              {/* Formulario de Inicio de Sesión */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#f3f4f6'
              }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: 24,
                  textAlign: 'center'
                }}>
                  Bienvenido
                </Text>

                {/* Email Input */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: 8
                  }}>
                    Email
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb'
                  }}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" />
                    <TextInput
                      autoCapitalize="none"
                      value={emailAddress}
                      placeholder="Correo electronico"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={setEmailAddress}
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        color: '#111827',
                        fontSize: 16,
                        borderWidth: 0, 
                        outlineWidth: 0
                      }}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: 8
                  }}>
                    Contraseña
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb'
                  }}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                    <TextInput
                      value={password}
                      placeholder="Introduce la contraseña..."
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={true}
                      onChangeText={setPassword}
                      style={{
                        flex: 1,
                        marginLeft: 12,
                        color: '#111827',
                        fontSize: 16,
                        borderWidth: 0, 
                        outlineWidth: 0
                      }}
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </View>

              {/* Sign in button */}
              <TouchableOpacity
                onPress={onSignInPress}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                  borderRadius: 12,
                  paddingVertical: 16,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2
                }}
                activeOpacity={0.8}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isLoading ? (
                    <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                    <Ionicons name="log-in-outline" size={17} color="white" />
                  )}
                  <Text style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 18,
                    marginLeft: 8
                  }}>
                    {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 16
              }}>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#e5e7eb'
                }} />
                <Text style={{
                  paddingHorizontal: 16,
                  color: '#6b7280',
                  fontSize: 14
                }}>
                  o
                </Text>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: '#e5e7eb'
                }} />
              </View>

              {/* Google Sign In Button */}
              <GoogleSignIn />

              {/* Link de registro */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16
              }}>
                <Text style={{ color: '#111827', fontSize: 16 }}>
                  No tienes cuenta?{' '}
                </Text>
                <Link href="/sign-up" asChild>
                  <TouchableOpacity>
                    <Text style={{
                      color: '#2563eb',
                      fontWeight: '600',
                      fontSize: 16
                    }}>
                      Regístrate
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Footer section - Posición fija desde abajo */}
            <View style={{
              marginTop: 'auto',
              paddingBottom: 24
            }}>
              <Text style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: 14
              }}>
                Comienza tu cambio físico
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}