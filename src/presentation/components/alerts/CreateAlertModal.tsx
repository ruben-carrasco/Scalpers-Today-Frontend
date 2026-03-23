import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react-native';
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
        <View className="px-6 py-4">
          <Typography variant="h2" weight="bold">{STEP_TITLES[step - 1]}</Typography>
          <Typography variant="caption" color="secondary" className="mt-1">{STEP_SUBTITLES[step - 1]}</Typography>
        </View>

        <ProgressBar currentStep={step} />

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

        <View className="flex-row p-6 pb-10 border-t" style={{ borderTopColor: colors.bg.modalCard }}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              className="px-6 h-14 items-center justify-center rounded-xl mr-3"
              style={{ backgroundColor: colors.bg.modalCard }}
            >
              <ArrowLeft size={20} color={colors.text.icon} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={!canProceed()}
            onPress={() => step < 3 ? setStep(step + 1) : handleCreate()}
            className="flex-1 h-14 rounded-xl flex-row items-center justify-center gap-2"
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
    <View className="flex-row items-center justify-center py-4 px-10">
      {[1, 2, 3].map((s) => (
        <View key={s} className="flex-row items-center">
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: s <= currentStep ? colors.brand.primary : colors.bg.modalCard }}>
            {s < currentStep ? (
              <CheckCircle size={16} color={colors.white} />
            ) : (
              <Typography variant="caption" weight="bold" style={{ color: s <= currentStep ? colors.text.primary : colors.text.muted }}>{s}</Typography>
            )}
          </View>
          {s < 3 && <View className="w-12 h-1 mx-2 rounded-full" style={{ backgroundColor: s < currentStep ? colors.brand.primary : colors.bg.modalCard }} />}
        </View>
      ))}
    </View>
  );
}
