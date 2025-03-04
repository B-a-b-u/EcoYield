import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ScrollView } from "react-native-web";


export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Personalized Fertilizer Recommendation</Text>
        <Text style={styles.subtitle}>Just 3 Steps to Get your Recommendation</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Link href='/FertilizerRecommendation' style={styles.buttonText}>
          Get Fertilizer Recommendation
        </Link>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#4EA84E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});