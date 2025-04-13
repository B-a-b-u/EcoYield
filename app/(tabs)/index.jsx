import { Text, View } from "react-native";
import { useAuth } from "@/components/auth-context";

const Index = () => {
  const { user } = useAuth();
  return (
    <View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

export default Index;
