import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'nativewind';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'metric';
  color?: 'primary' | 'secondary' | 'muted' | 'brand' | 'danger' | 'success' | 'warning';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function Typography({
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  className = '',
  children,
  ...props
}: TypographyProps) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme !== 'light';
  const baseClasses = 'font-sans tracking-tight';
  
  const variants = {
    metric: 'text-5xl leading-none font-variant-tabular-nums', // Huge numbers with tabular spacing
    h1: 'text-3xl leading-tight',
    h2: 'text-[22px] leading-snug',
    h3: 'text-[19px] leading-snug',
    body: 'text-[17px] leading-relaxed', // iOS Standard body
    caption: 'text-[15px]', // Increased for readability
    label: 'text-[13px] tracking-widest uppercase',
  };

  const colors = {
    primary: isDarkMode ? 'text-text-primary' : 'text-[#18181B]',
    secondary: isDarkMode ? 'text-[#A1A1AA]' : 'text-[#475569]',
    muted: isDarkMode ? 'text-[#52525B]' : 'text-[#64748B]',
    brand: 'text-[#3B82F6]', // iOS Blue
    danger: 'text-[#FF453A]', // Bright Neon Red
    success: 'text-[#34D399]', // Bright Neon Green
    warning: isDarkMode ? 'text-[#FBBF24]' : 'text-[#92400E]',
  };

  const weights = {
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const finalClassName = `${baseClasses} ${variants[variant]} ${colors[color]} ${weights[weight]} ${aligns[align]} ${className}`;

  return (
    <Text className={finalClassName.trim().replace(/\s+/g, ' ')} {...props}>
      {children}
    </Text>
  );
}
