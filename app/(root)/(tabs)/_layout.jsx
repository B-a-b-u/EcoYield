import { Tabs } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#4EA84E', headerShown: false  }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                }}
                
            />

            <Tabs.Screen
                name="FertilizerRecommendation"
                options={{
                    title: 'Fertilizer',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="flask" color={color} />,
                }}
            />

            <Tabs.Screen
                name="CropRecommendation"
                options={{
                    title: 'Crop',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="leaf" color={color} />,
                }}
            />

            <Tabs.Screen
                name="Settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />,
                }}
            />

        </Tabs>
    )
}

export default TabsLayout