import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CheckCircle, ArrowLeft, ArrowRight, BellRing } from 'lucide-react-native';
import { AlertType } from '../../../domain/entities/AlertType';
import { AlertCondition } from '../../../domain/entities/AlertCondition';
import { Typography } from '../common/Typography';
import { colors } from '../../theme/tokens';
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepConditions } from './steps/StepConditions';
import { StepConfirmation } from './steps/StepConfirmation';

interface CreateAlertModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, conditions: AlertCondition[], pushEnabled: boolean) => void;
  availableCountries: string[];
}

export function CreateAlertModal({ visible, onClose, onCreate, availableCountries }: CreateAlertModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%', '90%'], []);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<AlertType[]>([]);
  const [conditionValues, setConditionValues] = useState<Record<AlertType, string>>({} as Record<AlertType, string>);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
      resetForm();
    }
  }, [onClose]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedTypes([]);
    setConditionValues({} as Record<AlertType, string>);
    setPushEnabled(true);
    setStep(1);
  };

  const toggleType = (type: AlertType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSetConditionValue = (type: AlertType, value: string) => {
    setConditionValues({ ...conditionValues, [type]: value });
  };

  const handleCreate = () => {
    const conditions: AlertCondition[] = selectedTypes.map(type => ({
      alertType: type,
      value: conditionValues[type] || null,
    }));
    onCreate(name, description, conditions, pushEnabled);
    bottomSheetModalRef.current?.dismiss();
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) {
      if (selectedTypes.length === 0) return false;
      if (selectedTypes.includes('specific_country') && !conditionValues['specific_country']) return false;
      if (selectedTypes.includes('specific_currency') && !conditionValues['specific_currency']) return false;
      return true;
    }
    return true;
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  const STEP_TITLES = ['Nueva Alerta', 'Condiciones', 'Confirmación'];
  const STEP_SUBTITLES = ['Información básica', 'Configura cuándo quieres que te avisemos', 'Revisa tu alerta'];

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.bg.modal }}
      handleIndicatorStyle={{ backgroundColor: colors.border.indicator }}
    >
      <BottomSheetView className="flex-1">
        <View className="px-6 pb-4 pt-2">
          <View className="overflow-hidden rounded-[28px] border px-5 pb-5 pt-5" style={{ backgroundColor: '#0C1320', borderColor: '#1E293B' }}>
            <View className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2563EB]/15" />
            <View className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-[#F59E0B]/10" />

            <View className="mb-4 flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Typography variant="caption" weight="bold" className="mb-2 uppercase tracking-[0.28em] text-[#BFDBFE]">
                  Asistente de creación
                </Typography>
                <Typography variant="h2" weight="bold" className="text-text-primary">
                  {STEP_TITLES[step - 1]}
                </Typography>
                <Typography variant="caption" color="secondary" className="mt-2">
                  {STEP_SUBTITLES[step - 1]}
                </Typography>
              </View>

              <View className="h-12 w-12 items-center justify-center rounded-[18px]" style={{ backgroundColor: colors.brand.primary }}>
                <BellRing size={20} color={colors.white} strokeWidth={2.4} />
              </View>
            </View>

            <ProgressBar currentStep={step} />
          </View>
        </View>

        <ScrollView className="flex-1 px-6">
          {step === 1 && (
            <StepBasicInfo
              name={name}
              description={description}
              onNameChange={setName}
              onDescriptionChange={setDescription}
            />
          )}

          {step === 2 && (
            <StepConditions
              selectedTypes={selectedTypes}
              conditionValues={conditionValues}
              availableCountries={availableCountries}
              onToggleType={toggleType}
              onSetConditionValue={handleSetConditionValue}
            />
          )}

          {step === 3 && (
            <StepConfirmation
              name={name}
              selectedCount={selectedTypes.length}
              pushEnabled={pushEnabled}
              onPushEnabledChange={setPushEnabled}
            />
          )}
        </ScrollView>

        <View className="flex-row border-t p-6 pb-10" style={{ borderTopColor: colors.bg.modalCard }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              className="mr-3 h-14 items-center justify-center rounded-[20px] px-6"
              style={{ backgroundColor: colors.bg.modalCard }}
            >
              <ArrowLeft size={20} color={colors.text.icon} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={!canProceed()}
            onPress={() => step < 3 ? setStep(step + 1) : handleCreate()}
            className="flex-1 h-14 flex-row items-center justify-center gap-2 rounded-[20px]"
            style={{ backgroundColor: canProceed() ? colors.brand.primary : colors.bg.modalCard }}
          >
            <Typography variant="body" weight="bold" style={{ color: canProceed() ? colors.text.primary : colors.text.muted }}>
              {step < 3 ? 'Siguiente' : 'Confirmar y Crear'}
            </Typography>
            {step < 3 && <ArrowRight size={20} color={canProceed() ? colors.white : colors.text.muted} />}
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <View className="flex-row items-center justify-center px-2 pt-2">
      {[1, 2, 3].map((s) => (
        <View key={s} className="flex-row items-center">
          <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: s <= currentStep ? colors.brand.primary : colors.bg.modalCard }}>
            {s < currentStep ? (
              <CheckCircle size={16} color={colors.white} />
            ) : (
              <Typography variant="caption" weight="bold" style={{ color: s <= currentStep ? colors.text.primary : colors.text.muted }}>{s}</Typography>
            )}
          </View>
          {s < 3 && <View className="mx-2 h-1 w-12 rounded-full" style={{ backgroundColor: s < currentStep ? colors.brand.primary : colors.bg.modalCard }} />}
        </View>
      ))}
    </View>
  );
}
