import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextStyle, Easing } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  style?: TextStyle;
}

export function AnimatedNumber({
  value,
  duration = 800,
  style,
}: AnimatedNumberProps) {
  const animValue = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    animValue.setValue(0);

    const listener = animValue.addListener(({ value: v }) => {
      setDisplay(Math.round(v));
    });

    Animated.timing(animValue, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => {
      animValue.removeListener(listener);
    };
  }, [animValue, duration, value]);

  return <Text style={style}>{display}</Text>;
}
