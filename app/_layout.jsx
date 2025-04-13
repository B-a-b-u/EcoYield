import { Stack } from "expo-router";
import {AuthProvider} from '../components/auth-context';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{
        title: "Eco Yield",
        headerTitleAlign: 'center',
        headerTintColor: '#ffffff',
        headerStyle: { backgroundColor: '#4ea84e', },
      }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  )
}
export default RootLayout;

