import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  contentClassName?: string;
}

export function Card({
  children,
  accentColor,
  className = '',
  contentClassName = '',
  ...props
}: CardProps) {
  return (
    <View
      className={`bg-[#18181B] rounded-2xl overflow-hidden ${className}`}
      {...props as any}
    >
      {accentColor && (
        <View className="absolute top-0 left-0 bottom-0 w-1 z-10" style={{ backgroundColor: accentColor }} />
      )}
      <View className={`flex-1 p-5 ${contentClassName}`}>
        {children}
      </View>
    </View>
  );
}
