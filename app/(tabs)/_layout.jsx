import { Tabs } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import i18n from '@/constants/language';
import { useLanguage } from '@/components/language-context';
import {useEffect} from 'react';

const TabsLayout = () => {

    const { language } = useLanguage();
    
        useEffect(() => {
          i18n.locale = language;
        }, [language]);
    
        i18n.locale = i18n.locale ?? 'en'
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffffff', tabBarInactiveTintColor: '#a6a6a6', headerShown: false,
                tabBarStyle: {
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
                    title:i18n.t('tabs.home'),
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
                    title: i18n.t('tabs.fr'),
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="flask" color={color} />,
                }}
            />

            <Tabs.Screen
                name="crop-recommendation"
                options={{
                    title: i18n.t('tabs.cr'),
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="leaf" color={color} />,
                }}
            />

            <Tabs.Screen
                name="deficiency-prediction"
                options={{
                    title: i18n.t('tabs.nd'),
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: i18n.t('tabs.profile'),
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