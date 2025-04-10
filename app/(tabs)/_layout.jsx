import { Tabs } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
    return (
        <Tabs 
        screenOptions={{ tabBarActiveTintColor: '#ffffff', tabBarInactiveTintColor: '#a6a6a6' ,headerShown: false,
        tabBarStyle:{
            backgroundColor: '#4ea84e',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 20,
            position: 'absolute',
            overflow: 'hidden',
            height: 50,
        }

         }}>
        
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome
                        size={28}
                        name="home"
                        color={color}
                    />
                }}
            />
            <Tabs.Screen
                name="fertilizer-recommendation"
                options={{
                    title: 'Fertilizer',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="flask" color={color} />,
                }}
            />

            <Tabs.Screen
                name="crop-recommendation"
                options={{
                    title: 'Crop',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="leaf" color={color} />,
                }}
            />

            <Tabs.Screen
                name="deficiency-prediction"
                options={{
                    title: 'Nutrients',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                }}
            />

<Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <FontAwesome
                        size={28}
                        name="user"
                        color={color}
                    />
                }}
            />

        </Tabs>
    )
}

export default TabsLayout;