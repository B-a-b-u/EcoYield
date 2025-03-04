import { Tabs } from "expo-router"

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' , headerShown:false}}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />

            <Tabs.Screen
                name="FertilizerRecommendation"
                options={{
                    title: 'Fertilizer',
                }}
            />

            <Tabs.Screen
                name="CropRecommendation"
                options={{
                    title: 'Crop',
                }}
            />

            <Tabs.Screen
                name="Settings"
                options={{
                    title: 'Settings',
                }}
            />

        </Tabs>
    )
}

export default TabsLayout