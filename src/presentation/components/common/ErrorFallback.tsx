import React from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, Text } from 'react-native';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 69, 58, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 40 }}>⚠️</Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 }}>
            Algo salió mal
          </Text>
          <Text style={{ fontSize: 17, color: '#A1A1AA', textAlign: 'center', lineHeight: 24 }}>
            La aplicación encontró un error inesperado y no puede continuar.
          </Text>
        </View>

        <View style={{ backgroundColor: '#18181B', borderRadius: 16, padding: 16, marginBottom: 32, borderWidth: 1, borderColor: '#27272A' }}>
          <Text style={{ fontSize: 12, color: '#71717A', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Detalles del error
          </Text>
          <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={true}>
            <Text style={{ fontFamily: 'monospace', fontSize: 13, color: '#F4F4F5' }}>
              {error.message || 'Error desconocido'}
            </Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={resetErrorBoundary}
          activeOpacity={0.8}
          style={{ height: 56, borderRadius: 28, backgroundColor: '#3B82F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }}
        >
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' }}>
            Reiniciar Aplicación
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
