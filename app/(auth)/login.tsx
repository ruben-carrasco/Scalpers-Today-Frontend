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
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Link, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { emailValidator } from '../../src/core/validation';
import { Typography } from '../../src/presentation/components/common/Typography';

WebBrowser.maybeCompleteAuthSession();

const googleAuthConfig = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const platformGoogleClientId = Platform.select({
  ios: googleAuthConfig.iosClientId,
  android: googleAuthConfig.androidClientId,
  default: googleAuthConfig.webClientId,
});
const hasGoogleClientId = Boolean(platformGoogleClientId);
const safeGoogleAuthConfig = {
  iosClientId: googleAuthConfig.iosClientId ?? 'missing-ios-google-client-id',
  androidClientId: googleAuthConfig.androidClientId ?? 'missing-android-google-client-id',
  webClientId: googleAuthConfig.webClientId ?? 'missing-web-google-client-id',
};

export default observer(function LoginScreen() {
  const router = useRouter();
  const authViewModel = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleRequest, , promptGoogleSignIn] = Google.useIdTokenAuthRequest({
    ...safeGoogleAuthConfig,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });

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
    if (isSubmitting || authViewModel.isLoading) {
      return;
    }

    authViewModel.clearError();
    setGoogleError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const success = await authViewModel.login(email.trim(), password);
    if (success) {
      router.replace('/(tabs)');
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    if (isLoading || !googleRequest || !hasGoogleClientId) {
      return;
    }

    authViewModel.clearError();
    setGoogleError(null);
    setIsGoogleSubmitting(true);

    try {
      const result = await promptGoogleSignIn();

      if (result.type === 'cancel' || result.type === 'dismiss') {
        return;
      }

      if (result.type !== 'success') {
        setGoogleError('No se pudo completar el inicio de sesión con Google.');
        return;
      }

      const idToken = result.params?.id_token;
      if (!idToken) {
        setGoogleError('Google no devolvió una credencial válida. Intenta de nuevo.');
        return;
      }

      const success = await authViewModel.loginWithGoogle(idToken);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch {
      setGoogleError('No se pudo abrir Google. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setIsGoogleSubmitting(false);
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

  const isLoading = authViewModel.isLoading || isSubmitting || isGoogleSubmitting;
  const isGoogleDisabled = isLoading || !googleRequest || !hasGoogleClientId;

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

            {googleError && (
              <View className="flex-row items-center bg-semantic-danger/10 p-4 rounded-2xl gap-3 mb-6 border border-semantic-danger/20">
                <AlertCircle size={20} color="#FF453A" strokeWidth={2} />
                <Typography variant="body" color="danger" weight="semibold" className="flex-1">{googleError}</Typography>
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

            <View className="flex-row items-center gap-4 my-6">
              <View className="h-px flex-1 bg-border-subtle" />
              <Typography variant="caption" color="muted" weight="semibold">O continúa con</Typography>
              <View className="h-px flex-1 bg-border-subtle" />
            </View>

            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isGoogleDisabled}
              activeOpacity={0.85}
              className={`h-16 rounded-full border border-border-subtle bg-bg-card flex-row items-center justify-center gap-3 ${isGoogleDisabled ? 'opacity-50' : 'opacity-100'}`}
              accessibilityRole="button"
              accessibilityLabel="Iniciar sesión con Google"
            >
              {isGoogleSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <View className="w-8 h-8 rounded-full bg-text-primary items-center justify-center">
                    <Typography variant="body" weight="bold" className="text-bg-primary">G</Typography>
                  </View>
                  <Typography variant="body" weight="bold" className="text-text-primary">
                    Iniciar sesión con Google
                  </Typography>
                </>
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
