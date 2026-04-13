import { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { emailValidator } from '../../src/core/validation';
import { Typography } from '../../src/presentation/components/common/Typography';

export default observer(function LoginScreen() {
  const router = useRouter();
  const authViewModel = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    authViewModel.clearError();
  }, [authViewModel]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailValidation = emailValidator.validate(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = async () => {
    authViewModel.clearError();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await authViewModel.login(email.trim(), password);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const isLoading = authViewModel.isLoading || isSubmitting;

  return (
    <View className="flex-1 bg-bg-primary">
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerClassName="flex-grow justify-center p-8" 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="mb-12 mt-10">
            <View className="w-20 h-20 rounded-2xl bg-bg-card items-center justify-center mb-6 overflow-hidden border border-border-subtle">
              <Image 
                source={require('../../assets/icon.png')} 
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            <Typography variant="metric" weight="bold" className="mb-2">Bienvenido</Typography>
            <Typography variant="h3" color="secondary">Inicia sesión en Scalper Today</Typography>
          </View>

          {/* Form */}
          <View className="mb-8">
            {/* Email Input */}
            <View className="mb-5">
              <View className={`flex-row items-center bg-bg-card border-2 rounded-2xl px-5 h-16 gap-3 ${errors.email ? 'border-semantic-danger bg-semantic-danger/10' : 'border-border-DEFAULT focus:border-brand-primary'}`}>
                <Mail size={22} color={errors.email ? '#FF453A' : '#A1A1AA'} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] text-text-primary font-medium"
                  placeholder="Correo electrónico"
                  placeholderTextColor="#71717A"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  accessibilityLabel="Correo electrónico"
                />
              </View>
              {errors.email && (
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">{errors.email}</Typography>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <View className={`flex-row items-center bg-bg-card border-2 rounded-2xl px-5 h-16 gap-3 ${errors.password ? 'border-semantic-danger bg-semantic-danger/10' : 'border-border-DEFAULT focus:border-brand-primary'}`}>
                <Lock size={22} color={errors.password ? '#FF453A' : '#A1A1AA'} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] text-text-primary font-medium"
                  placeholder="Contraseña"
                  placeholderTextColor="#71717A"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  accessibilityLabel="Contraseña"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  {showPassword ? (
                    <EyeOff size={22} color="#A1A1AA" strokeWidth={2} />
                  ) : (
                    <Eye size={22} color="#A1A1AA" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">{errors.password}</Typography>
              )}
            </View>

            {/* API Error */}
            {authViewModel.error && (
              <View className="flex-row items-center bg-semantic-danger/10 p-4 rounded-2xl gap-3 mb-6 border border-semantic-danger/20">
                <AlertCircle size={20} color="#FF453A" strokeWidth={2} />
                <Typography variant="body" color="danger" weight="semibold" className="flex-1">{authViewModel.error}</Typography>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              className={`h-16 rounded-full items-center justify-center ${isLoading ? 'bg-brand-primary/50' : 'bg-brand-primary'}`}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" weight="bold" className="text-text-primary">Iniciar Sesión</Typography>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-auto py-6 gap-2">
            <Typography variant="body" color="secondary">¿No tienes cuenta?</Typography>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity disabled={isLoading} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Typography variant="body" weight="bold" className="text-text-primary">
                  Crear cuenta
                </Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});
