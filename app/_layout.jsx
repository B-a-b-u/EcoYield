import { Stack, Link } from "expo-router";
import {AuthProvider} from '../components/auth-context';
import { View, Text, Image, StyleSheet } from "react-native";
import images from '@/constants/images'

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{
        headerTitle : () => (
          <View style={styles.headerContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
          />
          <Text style={styles.title}>EcoYield</Text>
        </View>
      ),
        headerTitleAlign: 'center',
        headerTintColor: '#ffffff',
        headerStyle: { backgroundColor: '#4ea84e', }, 
      }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  )
}


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

