import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{
        title: "Eco Yield", 
        headerTitleAlign: 'center',
        drawerActiveBackgroundColor: '#4ea84e', 
        drawerActiveTintColor: '#ffffff',
        headerTintColor: '#ffffff',
        headerStyle: {backgroundColor:'#4ea84e'}
      }}>
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerLabel: 'Home' }}
        />
        <Drawer.Screen
          name="signup"
          options={{ drawerLabel: 'Signup' }}
        />
        <Drawer.Screen
          name="settings"
          options={{ drawerLabel: 'Settings' }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
