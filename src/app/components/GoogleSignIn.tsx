import React, { useCallback, useEffect, useState } from 'react'
import { View, Platform, TouchableOpacity, Text, Alert } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'

// Hook para precalentar navegador solo en móvil
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      void WebBrowser.warmUpAsync()
      return () => {
        void WebBrowser.coolDownAsync()
      }
    }
  }, [])
}

// Completa sesiones pendientes solo en móvil
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession()
}

export default function GoogleSignIn() {
  useWarmUpBrowser()
  const { startSSOFlow } = useSSO()
  const [isLoading, setIsLoading] = useState(false)

  // Función para manejar el popup en web
  const handlePopupAuth = useCallback(async () => {
    console.log('🪟 Iniciando autenticación con popup')
    
    try {
      // Configurar las dimensiones y posición del popup
      const width = 500
      const height = 650
      const left = (window.screen.width - width) / 2
      const top = (window.screen.height - height) / 2
      
      const popupFeatures = [
        `width=${width}`,
        `height=${height}`,
        `left=${left}`,
        `top=${top}`,
        'scrollbars=yes',
        'resizable=yes',
        'status=no',
        'toolbar=no',
        'menubar=no',
        'location=no',
        'directories=no'
      ].join(',')

      // Crear una URL de callback única
      const callbackUrl = `${window.location.origin}/auth-callback`
      console.log('🔗 Callback URL:', callbackUrl)

      // Iniciar el flujo SSO
      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: callbackUrl,
      })

      console.log('🔵 Resultado del SSO:', result)

      if (result?.createdSessionId && result?.setActive) {
        // Activar la sesión
        await result.setActive({
          session: result.createdSessionId,
        })

        console.log('✅ Sesión activada correctamente')
        
        // Recargar la página principal para reflejar el login
        setTimeout(() => {
          window.location.reload()
        }, 500)

        return true
      } else if (result?.signIn || result?.signUp) {
        console.log('⚠️ Se requieren pasos adicionales')
        Alert.alert('Información', 'Se necesitan completar pasos adicionales para el registro')
        return false
      }

      throw new Error('No se recibió una respuesta válida del servidor')

    } catch (error) {
      console.error('❌ Error en popup auth:', error)
      throw error
    }
  }, [startSSOFlow])

  // Función específica para WEB con popup
  const handleWebSignIn = useCallback(async () => {
    console.log('🌐 Iniciando Google Sign-In para WEB con popup')
    setIsLoading(true)
    
    try {
      if (!startSSOFlow) {
        throw new Error('SSO no está configurado correctamente')
      }

      // Verificar si los popups están bloqueados
      const testPopup = window.open('', '_blank', 'width=1,height=1')
      if (!testPopup) {
        throw new Error('Los popups están bloqueados. Por favor, permite popups para este sitio.')
      }
      testPopup.close()

      // Ejecutar la autenticación con popup
      const success = await handlePopupAuth()
      
      if (success) {
        console.log('✅ Autenticación completada exitosamente')
      }

    } catch (error) {
      console.error('❌ Error en web sign-in:', error)
      
      let errorMessage = 'Error desconocido'
      
      if (error?.message?.includes('popup')) {
        errorMessage = 'Los popups están bloqueados. Habilita popups para este sitio e inténtalo de nuevo.'
      } else if (error?.message?.includes('redirect')) {
        errorMessage = 'Error de redirección. Verifica la configuración de URLs en Clerk.'
      } else if (error?.message?.includes('network')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.'
      } else if (error?.message?.includes('SSO')) {
        errorMessage = 'Error de configuración SSO. Verifica la configuración de Clerk.'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      Alert.alert(
        'Error de Autenticación', 
        errorMessage + '\n\nConsejo: Asegúrate de que los popups estén habilitados para este sitio.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [handlePopupAuth, startSSOFlow])

  // Función específica para MOBILE (sin cambios)
  const handleMobileSignIn = useCallback(async () => {
    console.log('📱 Iniciando Google Sign-In para MOBILE')
    setIsLoading(true)
    
    try {
      const redirectUrl = AuthSession.makeRedirectUri()
      console.log('📱 Mobile redirect URL:', redirectUrl)
      
      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      })
      
      console.log('📱 Resultado mobile:', result)
      
      if (result?.createdSessionId && result?.setActive) {
        await result.setActive({
          session: result.createdSessionId,
        })
        console.log('✅ Sesión móvil activada')
        Alert.alert('¡Éxito!', 'Sesión iniciada correctamente')
      }
      
    } catch (error) {
      console.error('❌ Error en mobile sign-in:', error)
      Alert.alert('Error', error?.message || 'Error en autenticación móvil')
    } finally {
      setIsLoading(false)
    }
  }, [startSSOFlow])

  // Función principal que decide según la plataforma
  const onPress = useCallback(async () => {
    console.log('🚀 Iniciando proceso de autenticación')
    console.log('🔍 Plataforma detectada:', Platform.OS)
    
    // Esta parte del código maneja ambas plataformas
    if (Platform.OS === 'web') {
      await handleWebSignIn() // Popup para web
    } else {
      await handleMobileSignIn() // Deep link para móvil
    }
  }, [handleWebSignIn, handleMobileSignIn])

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={{
        backgroundColor: isLoading ? '#f5f5f5' : 'white',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        opacity: isLoading ? 0.7 : 1,
        // Asegurar que el botón sea completamente clickeable
        minHeight: 56,
        justifyContent: 'center',
      }}
      activeOpacity={0.8}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Ionicons 
          name="logo-google" 
          size={20} 
          color={isLoading ? '#9ca3af' : '#4285F4'} 
        />
        <Text style={{ 
          color: isLoading ? '#9ca3af' : '#374151', 
          fontWeight: '600', 
          fontSize: 16, 
          marginLeft: 12 
        }}>
          {isLoading ? 'Abriendo ventana...' : 'Inicia sesión con Google'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}