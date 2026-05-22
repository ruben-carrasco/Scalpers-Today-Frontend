import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Circle,
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

const getPasswordStrength = (pwd: string): { level: number; label: string; color: string; bgClass: string } => {
  if (!pwd) return { level: 0, label: '', color: '#A1A1AA', bgClass: 'bg-bg-elevated' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { level: 1, label: 'Débil', color: '#FF453A', bgClass: 'bg-semantic-danger' };
  if (score <= 4) return { level: 2, label: 'Media', color: '#FBBF24', bgClass: 'bg-semantic-warning' };
  return { level: 3, label: 'Fuerte', color: '#34D399', bgClass: 'bg-semantic-success' };
};

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
  const [showResetForm, setShowResetForm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordValidation = useMemo(() => passwordValidator.validate(password), [password]);

  useEffect(() => {
    authViewModel.clearError();
  }, [authViewModel]);

  useEffect(() => {
    if (typeof params.token === 'string' && params.token.length > 0) {
      setToken(params.token);
      setHasRequestedReset(true);
      setShowResetForm(true);
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
        secondaryText: '#334155',
        tertiaryText: '#475569',
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

    if (!/^\d{6}$/.test(token.trim())) {
      newErrors.token = 'Introduce el código de 6 dígitos';
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
      setShowResetForm(false);
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
          <Typography variant="body" className="text-center mb-8" style={{ color: isDarkMode ? '#D4D4D8' : palette.secondaryText }}>
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

  if (hasRequestedReset && !showResetForm) {
    return (
      <View className="flex-1 px-8 justify-center" style={{ backgroundColor: palette.bg }}>
        <StatusBar barStyle={palette.statusBar} />
        <View
          className="rounded-3xl p-6 border"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-5"
            style={{ backgroundColor: palette.successBg }}
          >
            <Mail size={32} color="#34D399" strokeWidth={2.4} />
          </View>
          <Typography
            variant="h1"
            weight="bold"
            className="mb-3"
            style={{ color: palette.inputText }}
          >
            Solicitud enviada
          </Typography>
          <Typography variant="body" className="mb-6" style={{ color: isDarkMode ? '#D4D4D8' : palette.secondaryText }}>
            Código enviado si el email existe.
          </Typography>
          <TouchableOpacity
            onPress={() => setShowResetForm(true)}
            className="h-14 rounded-full bg-brand-primary items-center justify-center px-8 mb-4"
            accessibilityRole="button"
            accessibilityLabel="Introducir código"
          >
            <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
              Introducir código
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            className="h-12 rounded-full items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio de sesión"
          >
            <Typography variant="body" weight="bold" style={{ color: palette.inputText }}>
              Volver al inicio de sesión
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
              {hasRequestedReset && showResetForm ? 'Introduce el código' : 'Restablecer contraseña'}
            </Typography>
            <Typography variant="h3" style={{ color: isDarkMode ? '#D4D4D8' : palette.secondaryText }}>
              {hasRequestedReset && showResetForm
                ? 'Introduce el código recibido y define una nueva contraseña.'
                : 'Introduce tu email para recibir un código de verificación.'}
            </Typography>
          </View>

          <View className="mb-8">
            {!hasRequestedReset && (
              <>
                <View className="mb-5">
                  <View
                    className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                    style={{
                      backgroundColor: errors.email ? 'rgba(255,69,58,0.10)' : palette.card,
                      borderColor: errors.email ? '#FF453A' : palette.border,
                    }}
                  >
                    <Mail
                      size={22}
                      color={errors.email ? '#FF453A' : palette.icon}
                      strokeWidth={2}
                    />
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
                    <Typography
                      variant="caption"
                      color="danger"
                      weight="semibold"
                      className="mt-2 ml-2"
                    >
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
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
                      Enviar instrucciones
                    </Typography>
                  )}
                </TouchableOpacity>
              </>
            )}

            {hasRequestedReset && showResetForm && (
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
                      placeholder="Código de 6 dígitos"
                      placeholderTextColor={palette.muted}
                      value={token}
                      onChangeText={(text) => {
                        setToken(text.replace(/\D/g, '').slice(0, 6));
                        clearFieldError('token');
                      }}
                      keyboardType="number-pad"
                      maxLength={6}
                      editable={!isLoading}
                      accessibilityLabel="Código de restablecimiento"
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
                      autoCapitalize="none"
                      autoCorrect={false}
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

                  {password.length > 0 && (
                    <View className="mt-4 mx-2">
                      <View className="flex-row items-center gap-3 mb-3">
                        <View className="flex-row gap-2 flex-1">
                          {[1, 2, 3].map((dot) => (
                            <View
                              key={dot}
                              className={`flex-1 h-1.5 rounded-full ${dot <= passwordStrength.level ? passwordStrength.bgClass : 'bg-bg-elevated'}`}
                            />
                          ))}
                        </View>
                        <Typography variant="caption" weight="bold" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </Typography>
                      </View>
                      <View className="gap-2">
                        {passwordValidation.requirements.map((req, index) => (
                          <View key={index} className="flex-row items-center gap-2">
                            {req.met ? (
                              <CheckCircle size={16} color="#34D399" strokeWidth={2.5} />
                            ) : (
                              <Circle size={16} color={isDarkMode ? '#52525B' : '#94A3B8'} strokeWidth={2.5} />
                            )}
                            <Typography
                              variant="caption"
                              weight={req.met ? 'semibold' : 'medium'}
                              style={{ color: req.met ? '#34D399' : isDarkMode ? '#A1A1AA' : palette.tertiaryText }}
                            >
                              {req.label}
                            </Typography>
                          </View>
                        ))}
                      </View>
                    </View>
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
                      autoCapitalize="none"
                      autoCorrect={false}
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
                  {!errors.confirmPassword && confirmPassword.length > 0 && password === confirmPassword && (
                    <View className="flex-row items-center gap-2 mt-3 ml-2">
                      <CheckCircle size={16} color="#34D399" strokeWidth={2.5} />
                      <Typography variant="caption" weight="bold" style={{ color: isDarkMode ? '#34D399' : '#15803D' }}>
                        Las contraseñas coinciden
                      </Typography>
                    </View>
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
