import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle, Circle, ArrowUpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useAuthViewModel } from '../../src/presentation/hooks';
import { passwordValidator, emailValidator } from '../../src/core/validation';
import { Typography } from '../../src/presentation/components/common/Typography';
import { useThemeMode } from '../../src/presentation/theme/ThemeModeContext';

interface FormErrors {
  name?: string;
  email?: string;
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

export default observer(function RegisterScreen() {
  const router = useRouter();
  const authViewModel = useAuthViewModel();
  const { isDarkMode } = useThemeMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    if (key.length === 1 && key.toUpperCase() === key && key.toLowerCase() !== key) {
      const isShift = (e as any).nativeEvent.shiftKey;
      if (isShift === false) {
        setCapsLockActive(true);
      } else if (isShift === true) {
        setCapsLockActive(false);
      }
    } else if (key.length === 1 && key.toLowerCase() === key && key.toUpperCase() !== key) {
      setCapsLockActive(false);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordValidation = useMemo(() => passwordValidator.validate(password), [password]);

  useEffect(() => {
    authViewModel.clearError();
  }, [authViewModel]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'El nombre es requerido';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailValidation = emailValidator.validate(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      const validation = passwordValidator.validate(password);
      if (!validation.isValid) {
        newErrors.password = validation.errors[0];
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (isSubmitting || authViewModel.isLoading) {
      return;
    }

    authViewModel.clearError();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const success = await authViewModel.register(
      email.trim(),
      password,
      name.trim(),
      'es',
      'usd'
    );
    if (success) {
      router.replace('/(tabs)');
    }

    setIsSubmitting(false);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = authViewModel.isLoading || isSubmitting;
  const palette = isDarkMode
    ? {
        bg: '#000000',
        statusBar: 'light-content' as const,
        card: '#18181B',
        border: '#27272A',
        inputText: '#FFFFFF',
        muted: '#94A3B8',
        icon: '#A1A1AA',
      }
    : {
        bg: '#F4F4F5',
        statusBar: 'dark-content' as const,
        card: '#FFFFFF',
        border: '#E4E4E7',
        inputText: '#0F172A',
        muted: '#94A3B8',
        icon: '#64748B',
      };

  return (
    <View className="flex-1" style={{ backgroundColor: palette.bg }}>
      <StatusBar barStyle={palette.statusBar} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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

          {/* Header Section */}
          <View className="mb-10">
            <Typography variant="metric" weight="bold" className="mb-2" style={{ color: palette.inputText }}>
              Crear Cuenta
            </Typography>
            <Typography variant="h3" color="secondary">Completa tus datos para comenzar</Typography>
          </View>

          {/* Form */}
          <View className="mb-8">
            {/* Name Input */}
            <View className="mb-5">
              <View
                className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                style={{
                  backgroundColor: errors.name ? 'rgba(255,69,58,0.10)' : palette.card,
                  borderColor: errors.name ? '#FF453A' : palette.border,
                }}
              >
                <User size={22} color={errors.name ? '#FF453A' : palette.icon} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] font-medium"
                  style={{ color: palette.inputText }}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={palette.muted}
                  value={name}
                  onChangeText={(text) => { setName(text); clearFieldError('name'); }}
                  autoCapitalize="words"
                  editable={!isLoading}
                  accessibilityLabel="Nombre completo"
                />
              </View>
              {errors.name && (
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">{errors.name}</Typography>
              )}
            </View>

            {/* Email Input */}
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
                  onChangeText={(text) => { setEmail(text); clearFieldError('email'); }}
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
            <View className="mb-5">
              <View
                className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                style={{
                  backgroundColor: errors.password ? 'rgba(255,69,58,0.10)' : palette.card,
                  borderColor: errors.password ? '#FF453A' : palette.border,
                }}
              >
                <Lock size={22} color={errors.password ? '#FF453A' : palette.icon} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] font-medium"
                  style={{ color: palette.inputText }}
                  placeholder="Contraseña"
                  placeholderTextColor={palette.muted}
                  value={password}
                  onChangeText={(text) => { setPassword(text); clearFieldError('password'); }}
                  onKeyPress={handleKeyPress}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  accessibilityLabel="Contraseña"
                />
                {capsLockActive && (
                  <View className="mr-2">
                    <ArrowUpCircle size={20} color="#FBBF24" strokeWidth={2.5} />
                  </View>
                )}
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
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">{errors.password}</Typography>
              )}

              {/* Password Strength & Requirements */}
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
                        <Typography variant="caption" weight={req.met ? "semibold" : "medium"} style={{ color: req.met ? '#34D399' : isDarkMode ? '#A1A1AA' : '#64748B' }}>
                          {req.label}
                        </Typography>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-8">
              <View
                className="flex-row items-center border-2 rounded-2xl px-5 h-16 gap-3"
                style={{
                  backgroundColor: errors.confirmPassword ? 'rgba(255,69,58,0.10)' : palette.card,
                  borderColor: errors.confirmPassword ? '#FF453A' : palette.border,
                }}
              >
                <Lock size={22} color={errors.confirmPassword ? '#FF453A' : palette.icon} strokeWidth={2} />
                <TextInput
                  className="flex-1 text-[17px] font-medium"
                  style={{ color: palette.inputText }}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor={palette.muted}
                  value={confirmPassword}
                  onChangeText={(text) => { setConfirmPassword(text); clearFieldError('confirmPassword'); }}
                  onKeyPress={handleKeyPress}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  accessibilityLabel="Confirmar contraseña"
                />
                {capsLockActive && (
                  <View className="mr-2">
                    <ArrowUpCircle size={20} color="#FBBF24" strokeWidth={2.5} />
                  </View>
                )}
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
                <Typography variant="caption" color="danger" weight="semibold" className="mt-2 ml-2">{errors.confirmPassword}</Typography>
              )}
              {!errors.confirmPassword && confirmPassword.length > 0 && password === confirmPassword && (
                <View className="flex-row items-center gap-2 mt-3 ml-2">
                  <CheckCircle size={16} color="#34D399" strokeWidth={2.5} />
                  <Typography variant="caption" weight="bold" className="text-semantic-success">Las contraseñas coinciden</Typography>
                </View>
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
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
              className={`h-16 rounded-full items-center justify-center ${isLoading ? 'bg-brand-primary/50' : 'bg-brand-primary'}`}
              accessibilityRole="button"
              accessibilityLabel="Crear cuenta"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Typography variant="body" weight="bold" style={{ color: '#FFFFFF' }}>
                  Crear Cuenta
                </Typography>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
});
