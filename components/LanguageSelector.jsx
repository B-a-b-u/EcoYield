import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '@/components/language-context';
import { Picker } from '@react-native-picker/picker';
import i18n from '@/constants/language';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={{ padding: 10 }}>
      <Text>{i18n.t('selectLanguage')}</Text>
      <Picker  selectedValue={language} onValueChange={setLanguage}>
        <Picker.Item label="English" value="en" />
        <Picker.Item label="தமிழ்" value="ta" />
      </Picker>
    </View>
  );
};

export default LanguageSelector;
