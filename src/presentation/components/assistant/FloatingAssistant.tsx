import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
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
  const [question, setQuestion] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const messagesScrollRef = useRef<any>(null);
  const snapPoints = useMemo(() => ['78%'], []);

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
    if (assistant.isOpen) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [assistant.isOpen]);

  useEffect(() => {
    if (!assistant.isOpen) return;

    const timeout = setTimeout(() => {
      messagesScrollRef.current?.scrollToEnd?.({ animated: true });
    }, 80);

    return () => clearTimeout(timeout);
  }, [assistant.isOpen, assistant.messages.length, assistant.isLoading]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.55}
      />
    ),
    []
  );

  const handleOpen = () => {
    assistant.open({ screen: routeToScreen(pathname) });
  };

  const handleClose = () => {
    Keyboard.dismiss();
    assistant.close();
  };

  const handleSend = useCallback(async () => {
    const clean = question.trim();
    if (!clean || assistant.isLoading) return;
    setQuestion('');
    await assistant.send(clean);
  }, [assistant, question]);

  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={Math.max(insets.bottom, 10)}>
        <View
          className="px-4 pt-3 border-t"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.bg,
          }}
        >
          <View className="flex-row items-end gap-2">
            <BottomSheetTextInput
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
      </BottomSheetFooter>
    ),
    [assistant.isLoading, handleSend, insets.bottom, palette, question]
  );

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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onDismiss={() => assistant.close()}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: palette.bg }}
        handleIndicatorStyle={{ backgroundColor: palette.border }}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
        footerComponent={renderFooter}
      >
        <BottomSheetView style={{ flex: 1, overflow: 'hidden' }}>
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

          <BottomSheetScrollView
            ref={messagesScrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 150 + Math.max(insets.bottom, 10),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            nestedScrollEnabled
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
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
});
