import React, { useEffect } from 'react';
import { DimensionValue, ViewProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

export interface SkeletonProps extends ViewProps {
  className?: string;
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({ className = '', style, width, height, borderRadius, ...props }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius }, style, animatedStyle]}
      className={`bg-[#27272A] rounded-2xl ${className}`}
      {...props}
    />
  );
}
