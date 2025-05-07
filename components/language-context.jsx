import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/constants/language';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('language');
      const lang = savedLang || 'en';
      i18n.locale = lang;
      setLanguageState(lang);
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang) => {
    i18n.locale = lang;
    await AsyncStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
