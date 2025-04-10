import { Stack } from "expo-router";
const RootLayout = () => {
  return (
    <Stack screenOptions={{
      title: "Eco Yield",
      headerTitleAlign: 'center',
      headerTintColor: '#ffffff',
      headerStyle: { backgroundColor: '#4ea84e', },
    }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
export default RootLayout;

