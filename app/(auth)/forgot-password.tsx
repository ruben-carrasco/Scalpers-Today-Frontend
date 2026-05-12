import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { emailValidator, passwordValidator } from '../../src/core/validation';
import { Typography } from '../../src/presentation/components/common/Typography';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { useThemeMode } from '../../src/presentation/theme/ThemeModeContext';

interface FormErrors {
  email?: string;
  token?: string;
  password?: string;
  confirmPassword?: string;
}

export default observer(function ForgotPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const authViewModel = useAuthViewModel();
  const { isDarkMode } = useThemeMode();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasRequestedReset, setHasRequestedReset] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    authViewModel.clearError();
  }, [authViewModel]);

  useEffect(() => {
    if (typeof params.token === 'string' && params.token.length > 0) {
      setToken(params.token);
      setHasRequestedReset(true);
    }
  }, [params.token]);

  const palette = isDarkMode
    ? {
        bg: '#000000',
        statusBar: 'light-content' as const,
        card: '#18181B',
        border: '#27272A',
        inputText: '#FFFFFF',
        muted: '#94A3B8',
        icon: '#A1A1AA',
        successBg: 'rgba(52,211,153,0.12)',
      }
    : {
        bg: '#F4F4F5',
        statusBar: 'dark-content' as const,
        card: '#FFFFFF',
        border: '#E4E4E7',
        inputText: '#0F172A',
        muted: '#64748B',
        icon: '#64748B',
        successBg: 'rgba(16,185,129,0.12)',
      };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEmail = useCallback((): boolean => {
    const validation = emailValidator.validate(email);
    if (!validation.isValid) {
      setErrors({ email: validation.errors[0] });
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  }, [email]);

  const validatePasswordForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!token.trim()) {
      newErrors.token = 'Introduce el código o enlace de restablecimiento';
    }

    const validation = passwordValidator.validate(password);
    if (!password) {
      newErrors.password = 'La nueva contraseña es requerida';
    } else if (!validation.isValid) {
      newErrors.password = validation.errors[0];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [confirmPassword, password, token]);

  const handleRequestReset = async () => {
    if (isSubmitting || authViewModel.isLoading || !validateEmail()) {
      return;
    }

    setIsSubmitting(true);
    const resetToken = await authViewModel.requestPasswordReset(email.trim());
    if (!authViewModel.error) {
      setHasRequestedReset(true);
      if (resetToken) {
        setToken(resetToken);
      }
    }
    setIsSubmitting(false);
  };

  const handleConfirmReset = async () => {
    if (isSubmitting || authViewModel.isLoading || !validatePasswordForm()) {
      return;
    }

    setIsSubmitting(true);
    const success = await authViewModel.confirmPasswordReset(token.trim(), password);
    if (success) {
      setIsCompleted(true);
    }
    setIsSubmitting(false);
  };

  const isLoading = authViewModel.isLoading || isSubmitting;

  if (isCompleted) {
    return (
      <View className="flex-1 px-8 justify-center" style={{ backgroundColor: palette.bg }}>
        <StatusBar barStyle={palette.statusBar} />
        <View
          className="rounded-3xl p-6 border items-center"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-5"
            style={{ backgroundColor: palette.successBg }}
          >
            <CheckCircle size={34} color="#34D399" strokeWidth={2.4} />
          </View>
          <Typography
            variant="h1"
            weight="bold"
            className="text-center mb-3"
            style={{ color: palette.inputText }}
          >
            Contraseña actualizada
          </Typography>
          <Typography variant="body" color="secondary" className="text-center mb-8">
            Ya puedes iniciar sesión con tu nueva contraseña.
          </Typography>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            className="h-14 rounded-full bg-brand-primary items-center justify-center px-8 self-stretch"
            accessibilityRole="button"
            accessibilityLabel="Volver a iniciar sesión"
          >
            <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
              Volver a iniciar sesión
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: palette.bg }}>
      <StatusBar barStyle={palette.statusBar} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-8 py-16"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            className="flex-row items-center gap-2 self-start mb-8"
            onPress={() => router.back()}
            disabled={isLoading}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ArrowLeft size={24} color={palette.inputText} strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="mb-10">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-6 border"
              style={{ backgroundColor: palette.card, borderColor: palette.border }}
            >
              <KeyRound size={30} color={palette.inputText} strokeWidth={2.4} />
            </View>
            <Typography
              variant="metric"
              weight="bold"
              className="mb-2"
              style={{ color: palette.inputText }}
            >
              Restablecer contraseña
            </Typography>
            <Typography variant="h3" color="secondary">
              Introduce tu email y crea una nueva contraseña de acceso.
            </Typography>
          </View>

          <View className="mb-8">
            <View className="mb-5">
              <View
                className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                style={{
                  backgroundColor: errors.email ? 'rgba(255,69,58,0.10)' : palette.card,
                  borderColor: errors.email ? '#FF453A' : palette.border,
                }}
              >
                <Mail size={22} color={errors.email ? '#FF453A' : palette.icon} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] font-medium"
                  style={{ color: palette.inputText }}
                  placeholder="Correo electrónico"
                  placeholderTextColor={palette.muted}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearFieldError('email');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  accessibilityLabel="Correo electrónico"
                />
              </View>
              {errors.email && (
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">
                  {errors.email}
                </Typography>
              )}
            </View>

            <TouchableOpacity
              onPress={handleRequestReset}
              disabled={isLoading}
              activeOpacity={0.85}
              className={`h-14 rounded-full items-center justify-center mb-6 ${isLoading ? 'bg-brand-primary/50' : 'bg-brand-primary'}`}
              accessibilityRole="button"
              accessibilityLabel="Enviar instrucciones"
            >
              {isLoading && !hasRequestedReset ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
                  Enviar instrucciones
                </Typography>
              )}
            </TouchableOpacity>

            {hasRequestedReset && (
              <View
                className="rounded-2xl p-4 border mb-6"
                style={{ backgroundColor: palette.card, borderColor: palette.border }}
              >
                <Typography variant="body" weight="bold" className="mb-1" style={{ color: palette.inputText }}>
                  Solicitud enviada
                </Typography>
                <Typography variant="body" color="secondary">
                  Si existe una cuenta con ese email, podrás continuar con el código de
                  restablecimiento. En desarrollo se rellena automáticamente para poder probarlo.
                </Typography>
              </View>
            )}

            {hasRequestedReset && (
              <>
                <View className="mb-5">
                  <View
                    className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                    style={{
                      backgroundColor: errors.token ? 'rgba(255,69,58,0.10)' : palette.card,
                      borderColor: errors.token ? '#FF453A' : palette.border,
                    }}
                  >
                    <KeyRound
                      size={22}
                      color={errors.token ? '#FF453A' : palette.icon}
                      strokeWidth={2}
                    />
                    <TextInput
                      className="flex-1 text-[15px] font-medium"
                      style={{ color: palette.inputText }}
                      placeholder="Código o token de restablecimiento"
                      placeholderTextColor={palette.muted}
                      value={token}
                      onChangeText={(text) => {
                        setToken(text);
                        clearFieldError('token');
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                      accessibilityLabel="Token de restablecimiento"
                    />
                  </View>
                  {errors.token && (
                    <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">
                      {errors.token}
                    </Typography>
                  )}
                </View>

                <View className="mb-5">
                  <View
                    className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                    style={{
                      backgroundColor: errors.password ? 'rgba(255,69,58,0.10)' : palette.card,
                      borderColor: errors.password ? '#FF453A' : palette.border,
                    }}
                  >
                    <Lock
                      size={22}
                      color={errors.password ? '#FF453A' : palette.icon}
                      strokeWidth={2}
                    />
                    <TextInput
                      className="flex-1 text-[17px] font-medium"
                      style={{ color: palette.inputText }}
                      placeholder="Nueva contraseña"
                      placeholderTextColor={palette.muted}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        clearFieldError('password');
                      }}
                      secureTextEntry={!showPassword}
                      editable={!isLoading}
                      accessibilityLabel="Nueva contraseña"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showPassword ? (
                        <EyeOff size={22} color={palette.icon} strokeWidth={2} />
                      ) : (
                        <Eye size={22} color={palette.icon} strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">
                      {errors.password}
                    </Typography>
                  )}
                </View>

                <View className="mb-6">
                  <View
                    className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                    style={{
                      backgroundColor: errors.confirmPassword ? 'rgba(255,69,58,0.10)' : palette.card,
                      borderColor: errors.confirmPassword ? '#FF453A' : palette.border,
                    }}
                  >
                    <Lock
                      size={22}
                      color={errors.confirmPassword ? '#FF453A' : palette.icon}
                      strokeWidth={2}
                    />
                    <TextInput
                      className="flex-1 text-[17px] font-medium"
                      style={{ color: palette.inputText }}
                      placeholder="Confirmar contraseña"
                      placeholderTextColor={palette.muted}
                      value={confirmPassword}
                      onChangeText={(text) => {
                        setConfirmPassword(text);
                        clearFieldError('confirmPassword');
                      }}
                      secureTextEntry={!showConfirmPassword}
                      editable={!isLoading}
                      accessibilityLabel="Confirmar contraseña"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={22} color={palette.icon} strokeWidth={2} />
                      ) : (
                        <Eye size={22} color={palette.icon} strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">
                      {errors.confirmPassword}
                    </Typography>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleConfirmReset}
                  disabled={isLoading}
                  activeOpacity={0.85}
                  className={`h-16 rounded-full items-center justify-center ${isLoading ? 'bg-brand-primary/50' : 'bg-brand-primary'}`}
                  accessibilityRole="button"
                  accessibilityLabel="Actualizar contraseña"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
                      Actualizar contraseña
                    </Typography>
                  )}
                </TouchableOpacity>
              </>
            )}

            {authViewModel.error && (
              <View className="flex-row items-center bg-semantic-danger/10 p-4 rounded-2xl gap-3 mt-6 border border-semantic-danger/20">
                <AlertCircle size={20} color="#FF453A" strokeWidth={2} />
                <Typography variant="body" color="danger" weight="semibold" className="flex-1">
                  {authViewModel.error}
                </Typography>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});
