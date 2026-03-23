import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '../../hooks/useHaptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  className?: string;
}

export function Button({ 
  label, 
  onPress, 
  disabled, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
    haptics.impactLight();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const baseClasses = "py-4 px-6 rounded-2xl flex-row justify-center items-center overflow-hidden";
  const widthClasses = fullWidth ? "w-full" : "self-start";
  const disabledClasses = disabled ? "opacity-50" : "";

  const variantStyles = {
    primary: "bg-brand-primary",
    secondary: "bg-white/10 border border-white/20",
    danger: "bg-semantic-danger/20 border border-semantic-danger/50",
    ghost: "bg-transparent",
  };

  const textColors = {
    primary: "text-text-primary font-semibold text-base tracking-wide",
    secondary: "text-text-primary font-medium text-base tracking-wide",
    danger: "text-semantic-dangerLight font-semibold text-base tracking-wide",
    ghost: "text-brand-primaryLight font-medium text-base tracking-wide",
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={`${baseClasses} ${widthClasses} ${variantStyles[variant]} ${disabledClasses} ${className}`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      {variant === 'primary' && !disabled ? (
        <LinearGradient
          colors={['#3B82F6', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
      ) : null}
      <Text className={`${textColors[variant]} z-10`}>{label}</Text>
    </AnimatedPressable>
  );
}
