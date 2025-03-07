import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

const RootLayout = () =>{
    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="(tabs)" 
          options={{ drawerLabel: 'Home', title: 'Home' }}
        />
        <Drawer.Screen
          name="Drawer/signup" 
          options={{ drawerLabel: 'Signup', title: 'Signup' }}
        />
        <Drawer.Screen
          name="Drawer/settings" 
          options={{ drawerLabel: 'Settings', title: 'Settings' }}
        />
      </Drawer>
    </GestureHandlerRootView>
    )
}


export default RootLayout;