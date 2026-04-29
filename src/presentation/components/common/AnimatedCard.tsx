import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';

interface AnimatedCardProps {
  index: number;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  maxDelay?: number;
  entranceItemLimit?: number;
}

export function AnimatedCard({
  index,
  onPress,
  children,
  style,
  maxDelay = 600,
  entranceItemLimit = 8,
}: AnimatedCardProps) {
  const shouldAnimateEntrance = index < entranceItemLimit;
  const fadeAnim = useRef(new Animated.Value(shouldAnimateEntrance ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(shouldAnimateEntrance ? 20 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const delay = Math.min(index * 80, maxDelay);

  useEffect(() => {
    if (!shouldAnimateEntrance) {
      fadeAnim.setValue(1);
      translateY.setValue(0);
      return;
    }

    fadeAnim.setValue(0);
    translateY.setValue(20);

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 15,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, fadeAnim, shouldAnimateEntrance, translateY]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY }, { scale: scaleAnim }],
        },
        style,
      ]}
    >
      {onPress ? (
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      ) : (
        children
      )}
    </Animated.View>
  );
}
