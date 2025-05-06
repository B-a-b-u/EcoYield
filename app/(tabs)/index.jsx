import { Text, View, Image, StyleSheet } from "react-native";
import { useAuth } from "@/components/auth-context";
import images from '@/constants/images'
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from '@/constants/language';
import { getLocales } from 'expo-localization';


const Index = () => {
  const { user } = useAuth();

  i18n.locale = getLocales()[0].languageCode ?? 'en';

  console.log("language : ",i18n.locale);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={images.ecoyield}
          style={styles.logo}
          resizeMode="contain"
        />
      
        <Text style={styles.title}>{i18n.t('welcome')}</Text>
        <Text style={styles.subtitle}>
        {i18n.t('subWelcome')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32", 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default Index;
