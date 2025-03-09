import { Tabs } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#4EA84E', headerShown: false }}>
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
                name="nutrients"
                options={{
                    title: 'Nutrients',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                }}
            />

        </Tabs>
    )
}

export default TabsLayout;