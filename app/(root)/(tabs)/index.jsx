import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome to Eco Yield.</Text>
      <Link href='/Settings'>Go to Settings</Link>
      <Link href='/CropRecommendation'>Go to CR</Link>
      <Link href='/FertilizerRecommendation'>Go to FR</Link>

    </View>
  );
}
