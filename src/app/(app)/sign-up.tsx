import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) {
      console.log("Clerk no está cargado aún");
      return;
    }

    // Validaciones básicas
    if (!emailAddress.trim()) {
      Alert.alert("Error", "Por favor ingresa tu email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Por favor ingresa tu contraseña");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("1. Creando usuario en Clerk...");

      // Proceso de Autentificacion de Dos Factores
      // Comenzando el proceso de crear cuenta usando el correo y la password recividos
      const createResult = await signUp.create({
        emailAddress,
        password,
      });

      console.log("2. Usuario creado exitosamente:", createResult.id);
      console.log("3. Preparando verificación por email...");

      // Se manda un correo al usuario para verificar su identidad
      const prepareResult = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      console.log("4. Email de verificación enviado:", prepareResult);
      console.log("5. Cambiando a pantalla de verificación...");

      // Activa la pantalla de verificacion si la password y el correo son adecuados
      setPendingVerification(true);

      console.log("6. Estado cambiado a pendingVerification:", true);
    } catch (err) {
      console.error("Error en registro:", JSON.stringify(err, null, 2));

      // Mostrar errores especificos al usuario
      let errorMessage = "Error al crear la cuenta";

      if (err.errors && err.errors.length > 0) {
        const firstError = err.errors[0];
        switch (firstError.code) {
          case "form_identifier_exists":
            errorMessage = "Este email ya está registrado";
            break;
          case "form_password_pwned":
            errorMessage =
              "Esta contraseña es muy común, elige otra más segura";
            break;
          case "form_password_too_common":
            errorMessage =
              "Esta contraseña es muy común, elige otra más segura";
            break;
          case "form_password_length_too_short":
            errorMessage = "La contraseña debe tener al menos 8 caracteres";
            break;
          default:
            errorMessage = firstError.message || "Error al crear la cuenta";
        }
      }

      Alert.alert("Error", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      Alert.alert("Error", "Por favor ingresa el código de verificación");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Verificando código...");

      // Usa el codigo que se le proporciono al usuario para verificar el correo electronico
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // Si la verificacion fue completada, implementa la sesion como activa
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        console.log("Verificación exitosa, redirigiendo...");
        router.replace("/");
      } else {
        console.error(
          "Verificación incompleta:",
          JSON.stringify(signUpAttempt, null, 2)
        );
        Alert.alert(
          "Error",
          "Verificación incompleta. Por favor intentalo de nuevo."
        );
      }
    } catch (err) {
      console.error("Error en verificación:", JSON.stringify(err, null, 2));

      let errorMessage = "Código de verificación incorrecto";
      if (err.errors && err.errors.length > 0) {
        errorMessage = err.errors[0].message || errorMessage;
      }

      Alert.alert("Error", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 px-6 justify-center">
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f3f4f6",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Verifica tu email
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#6b7280",
                  textAlign: "center",
                  marginBottom: 24,
                  lineHeight: 22,
                }}
              >
                Hemos enviado un código de verificación a{"\n"}
                <Text style={{ fontWeight: "600", color: "#111827" }}>
                  {emailAddress}
                </Text>
              </Text>

              {error ? (
                <Text
                  style={{
                    color: "#ef4444",
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Código de verificación
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center", // centra verticalmente icono y texto
                    justifyContent: "center", // centra horizontalmente
                    backgroundColor: "#f9fafb",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                  }}
                >
                  {/* Icono */}
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#6B7280"
                    style={{ marginRight: 8 }}
                  />

                  {/* Input */}
                  <TextInput
                    value={code}
                    placeholder="Ingresa el código de 6 dígitos"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                    style={{
                      fontSize: 16,
                      color: "#111827",
                      letterSpacing: 4,
                      textAlign: "center", // centra el texto del input
                      flex: 1,
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "bg-gray-400" : "bg-green-600",
                  borderRadius: 12,
                  paddingVertical: 14,
                  marginBottom: 14,
                  borderWidth: 0,
                  outlineWidth: 0,
                }}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons
                      name="checkmark-outline"
                      size={20}
                      color="white"
                    />
                  )}
                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Verificando..." : "Verificar código"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPendingVerification(false)}
                className="flex-row items-center"
              >
                <Ionicons name="arrow-back-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-2">
                  Volver al registro
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* MAIN */}
          <View className="flex-1 justify-center">
            {/* Logo */}
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#2563eb",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
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

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Únete a Gym-Tracker
              </Text>

              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#6b7280",
                    textAlign: "center",
                    lineHeight: 24,
                  }}
                >
                  Registra tus entrenamientos{"\n"}y consigue tus objetivos!
                </Text>
              </View>
            </View>

            {/* Formulario */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#f3f4f6",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: 24,
                  textAlign: "center",
                }}
              >
                Crea tu cuenta
              </Text>

              {error ? (
                <Text
                  style={{
                    color: "#ef4444",
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  {error}
                </Text>
              ) : null}

              {/* Email Input */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Email
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  }}
                >
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={setEmailAddress}
                    editable={!isLoading}
                    keyboardType="email-address"
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      color: "#111827",
                      fontSize: 16,
                      borderWidth: 0,
                      outlineWidth: 0,
                    }}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Contraseña
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6B7280"
                  />
                  <TextInput
                    value={password}
                    placeholder="Crea una contraseña"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    onChangeText={setPassword}
                    editable={!isLoading}
                    style={{
                      flex: 1,
                      marginLeft: 12,
                      color: "#111827",
                      fontSize: 16,
                      borderWidth: 0,
                      outlineWidth: 0,
                    }}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  Debe tener al menos 8 caracteres
                </Text>
              </View>

              {/* Botón de creación de cuenta */}
              <TouchableOpacity
                onPress={onSignUpPress}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
                  borderRadius: 12,
                  paddingVertical: 16,
                  marginBottom: 16,
                }}
              >
                <View className="flex-row items-center justify-center">
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons
                      name="person-add-outline"
                      size={20}
                      color="white"
                    />
                  )}
                  <Text className="text-white font-semibold text-lg ml-2">
                    {isLoading ? "Creando la cuenta..." : "Crea tu cuenta"}
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <Text className="text-xs text-gray-500 text-center -mt-1 mb-4">
                  Creando tu cuenta, estás aceptando nuestros términos de
                  servicio y política de privacidad
                </Text>
              </View>
            </View>
            {/* Sección de vuelta al inicio de sesión */}
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text>¿Ya tienes una cuenta? </Text>
              <Link href="/sign-in">
                <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                  Inicia sesión
                </Text>
              </Link>
            </View>
          </View>
          {/*Footer*/}
          <View className="pb-6">
            <Text className="text-center text-gray-500 text-sm">
              ¿Preparado para tu transformación física?
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
