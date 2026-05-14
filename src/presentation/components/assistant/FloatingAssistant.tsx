import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Modal,
  PanResponder,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Bot, Send, Sparkles, Trash2, X } from 'lucide-react-native';
import { usePathname } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../common/Typography';
import { useAssistantViewModel } from '../../hooks';
import { useThemeMode } from '../../theme/ThemeModeContext';

function routeToScreen(pathname: string): string {
  if (pathname.includes('/events')) return 'events';
  if (pathname.includes('/alerts')) return 'alerts';
  if (pathname.includes('/settings')) return 'settings';
  return 'home';
}

export const FloatingAssistant = observer(function FloatingAssistant() {
  const assistant = useAssistantViewModel();
  const { isDarkMode } = useThemeMode();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [question, setQuestion] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesScrollRef = useRef<ScrollView>(null);
  const dragY = useRef(new Animated.Value(0)).current;

  const palette = useMemo(
    () =>
      isDarkMode
        ? {
            bg: '#0A0A0B',
            card: '#18181B',
            elevated: '#27272A',
            border: '#3F3F46',
            text: '#FFFFFF',
            muted: '#A1A1AA',
            assistantBubble: '#18181B',
            userBubble: '#2563EB',
            input: '#111113',
          }
        : {
            bg: '#FFFFFF',
            card: '#F8FAFC',
            elevated: '#E2E8F0',
            border: '#CBD5E1',
            text: '#0F172A',
            muted: '#475569',
            assistantBubble: '#F1F5F9',
            userBubble: '#1D4ED8',
            input: '#FFFFFF',
          },
    [isDarkMode]
  );

  useEffect(() => {
    assistant.setContext({ screen: routeToScreen(pathname) });
  }, [assistant, pathname]);

  useEffect(() => {
    const updateKeyboardHeight = (event: { endCoordinates: { screenY: number } }) => {
      setKeyboardHeight(Math.max(0, windowHeight - event.endCoordinates.screenY));
    };

    const showSub = Keyboard.addListener('keyboardWillChangeFrame', updateKeyboardHeight);
    const didShowSub = Keyboard.addListener('keyboardDidShow', updateKeyboardHeight);
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      didShowSub.remove();
      hideSub.remove();
    };
  }, [windowHeight]);

  useEffect(() => {
    if (!assistant.isOpen) return;

    dragY.setValue(0);

    const timeout = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd?.({ animated: true });
    }, 80);

    return () => clearTimeout(timeout);
  }, [assistant.isOpen, assistant.messages.length, assistant.isLoading, dragY]);

  const handleOpen = useCallback(() => {
    assistant.open({ screen: routeToScreen(pathname) });
  }, [assistant, pathname]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    assistant.close();
  }, [assistant]);

  const dragHandlePanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          dragY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 90 || gestureState.vy > 0.9) {
            handleClose();
            return;
          }

          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [dragY, handleClose]
  );

  const panelBottomOffset = keyboardHeight > 0 ? keyboardHeight : 0;
  const panelHeight = Math.max(
    320,
    Math.min(
      windowHeight * 0.82,
      windowHeight - panelBottomOffset - insets.top - 12
    )
  );

  const handleSend = useCallback(async () => {
    const clean = question.trim();
    if (!clean || assistant.isLoading) return;
    setQuestion('');
    await assistant.send(clean);
  }, [assistant, question]);

  return (
    <>
      {!assistant.isOpen && (
        <TouchableOpacity
          onPress={handleOpen}
          activeOpacity={0.88}
          className="absolute right-5 w-16 h-16 rounded-full items-center justify-center shadow-xl"
          style={{
            bottom: insets.bottom + 84,
            backgroundColor: isDarkMode ? '#FFFFFF' : '#111827',
            shadowColor: '#000000',
            shadowOpacity: 0.22,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 9,
          }}
          accessibilityRole="button"
          accessibilityLabel="Abrir asistente de IA"
        >
          <Sparkles size={26} color={isDarkMode ? '#111827' : '#FFFFFF'} strokeWidth={2.4} />
        </TouchableOpacity>
      )}

      <Modal
        visible={assistant.isOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            accessibilityRole="button"
            accessibilityLabel="Cerrar asistente"
          />

          <View className="flex-1 justify-end">
            <Animated.View
              {...dragHandlePanResponder.panHandlers}
              style={{
                height: panelHeight,
                backgroundColor: palette.bg,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                overflow: 'hidden',
                marginBottom: panelBottomOffset,
                transform: [{ translateY: dragY }],
              }}
            >
              <View>
                <View className="items-center pt-3 pb-2">
                  <View
                    className="w-11 h-1.5 rounded-full"
                    style={{ backgroundColor: palette.border }}
                  />
                </View>

                <View
                  className="px-6 pb-4 border-b"
                  style={{ borderColor: palette.border }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-11 h-11 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: isDarkMode ? '#27272A' : '#E0F2FE' }}
                      >
                        <Bot size={23} color={isDarkMode ? '#FFFFFF' : '#0369A1'} strokeWidth={2.3} />
                      </View>
                      <View className="flex-1">
                        <Typography variant="h3" weight="bold" style={{ color: palette.text }}>
                          Asistente IA
                        </Typography>
                        <Typography variant="caption" style={{ color: palette.muted }}>
                          Conceptos, eventos y análisis de la app
                        </Typography>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        onPress={() => assistant.clear()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: palette.card }}
                        accessibilityRole="button"
                        accessibilityLabel="Limpiar chat"
                      >
                        <Trash2 size={18} color={palette.muted} strokeWidth={2.2} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleClose}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: palette.card }}
                        accessibilityRole="button"
                        accessibilityLabel="Cerrar asistente"
                      >
                        <X size={20} color={palette.text} strokeWidth={2.4} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <ScrollView
                ref={messagesScrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  paddingBottom: 12,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
                onContentSizeChange={() => {
                  if (assistant.isOpen) {
                    messagesScrollRef.current?.scrollToEnd({ animated: true });
                  }
                }}
              >
                <View style={{ gap: 14 }}>
                  {assistant.messages.map((message) => {
                    const isUser = message.role === 'user';
                    return (
                      <View
                        key={message.id}
                        className={`max-w-[86%] rounded-3xl px-4 py-3 ${isUser ? 'self-end' : 'self-start'}`}
                        style={{
                          backgroundColor: isUser ? palette.userBubble : palette.assistantBubble,
                          borderWidth: isUser ? 0 : 1,
                          borderColor: palette.border,
                        }}
                      >
                        <Typography
                          variant="body"
                          style={{ color: isUser ? '#FFFFFF' : palette.text, fontSize: 16 }}
                        >
                          {message.content}
                        </Typography>
                      </View>
                    );
                  })}

                  {assistant.isLoading && (
                    <View
                      className="self-start rounded-3xl px-4 py-3 flex-row items-center gap-3 border"
                      style={{ backgroundColor: palette.assistantBubble, borderColor: palette.border }}
                    >
                      <ActivityIndicator color={isDarkMode ? '#FFFFFF' : '#111827'} size="small" />
                      <Typography variant="caption" style={{ color: palette.muted }}>
                        Pensando...
                      </Typography>
                    </View>
                  )}

                  {assistant.error && (
                    <View
                      className="rounded-2xl px-4 py-3 border"
                      style={{ backgroundColor: 'rgba(255,69,58,0.10)', borderColor: '#FF453A' }}
                    >
                      <Typography variant="caption" color="danger" weight="semibold">
                        {assistant.error}
                      </Typography>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View
                className="px-4 pt-3 border-t"
                style={{
                  borderColor: palette.border,
                  backgroundColor: palette.bg,
                  paddingBottom: Math.max(insets.bottom, 10),
                }}
              >
                <View className="flex-row items-end gap-2">
                  <TextInput
                    value={question}
                    onChangeText={setQuestion}
                    placeholder="Pregunta sobre un evento..."
                    placeholderTextColor={palette.muted}
                    multiline
                    maxLength={600}
                    scrollEnabled
                    className="flex-1 rounded-3xl px-4 py-3 text-[16px]"
                    style={{
                      backgroundColor: palette.input,
                      borderColor: palette.border,
                      borderWidth: 1,
                      color: palette.text,
                      maxHeight: 88,
                      minHeight: 52,
                      flexShrink: 1,
                    }}
                    editable={!assistant.isLoading}
                    accessibilityLabel="Pregunta para el asistente"
                  />
                  <TouchableOpacity
                    onPress={handleSend}
                    disabled={!question.trim() || assistant.isLoading}
                    className="rounded-full items-center justify-center"
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: !question.trim() || assistant.isLoading ? palette.elevated : '#2563EB',
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Enviar pregunta"
                  >
                    <Send size={20} color="#FFFFFF" strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
                <Typography variant="caption" className="mt-2 text-center" style={{ color: palette.muted, fontSize: 12 }}>
                  Contenido educativo, no asesoramiento financiero.
                </Typography>
              </View>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </>
  );
});
