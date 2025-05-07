import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { Image } from 'expo-image';
import images from '@/constants/images';
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';

const ActivityIndicator = () => {
   const { language } = useLanguage();
      
          useEffect(() => {
              i18n.locale = language || 'en';
          }, [language]);
      
  return (
    <View style={styles.container}>
      <Image 
        source={images.loading} 
        style={styles.image} 
        contentFit="contain" 
        transition={100}
      />
      <Text style={styles.text}>{i18n.t('loading.wait')}</Text>
    </View>
  );
};

export default ActivityIndicator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 250, 
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '500',
  },
});
