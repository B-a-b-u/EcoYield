import { Text, View, Image, StyleSheet } from "react-native";
import { useAuth } from "@/components/auth-context";
import images from '@/constants/images'
import { SafeAreaView } from "react-native-safe-area-context";
const Index = () => {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={images.ecoyield}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to EcoYield</Text>
        <Text style={styles.subtitle}>
          Sustainable Fertilizer Usage Optimization App
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
    color: "#2e7d32", // Green shade for eco feel
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default Index;
