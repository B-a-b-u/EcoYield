import { Stack } from 'expo-router';
import {AuthProvider} from '@/components/auth-context'
import { UserProvider } from '@/contexts/UserContext';
import { LanguageProvider } from '@/components/language-context';
import { View, Text, Image, StyleSheet } from 'react-native';
import images from '@/constants/images';
import i18n from '@/constants/language';
import { useEffect } from 'react';
import { useLanguage } from '@/components/language-context';

const RootLayout = () => {
  const { language } = useLanguage();
    
        useEffect(() => {
          i18n.locale = language;
        }, [language]);
    
        i18n.locale = i18n.locale ?? 'en'

  return (
    <LanguageProvider>
      <AuthProvider>
        <Stack screenOptions={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image source={images.logo} style={styles.logo} />
              <Text style={styles.title}>{i18n.t('title')}</Text>
            </View>
          ),
          headerTitleAlign: 'center',
          headerTintColor: '#ffffff',
          headerStyle: { backgroundColor: '#4ea84e' },
        }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    // border: "1px solid black",
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
export default RootLayout;

