import React from "react";
import { Platform } from 'react-native';
import { MaterialIcons  } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const { Navigator, Screen } = createBottomTabNavigator();

import { Dashboard } from '../screens/Dashboard';
import { Register  } from '../screens/Register';
import { Resume  } from   '../screens/Resume';

export function AppRoutes(){

    const theme = useTheme();

    return (
        <Navigator
            screenOptions={{
                // Desativando cabeçalho
                headerShown: false,
                // Alterando cor do menu que estiver ativo
                tabBarActiveTintColor: theme.colors.secondary,
                // Alterando cor do menu que não estiver ativo
                tabBarInactiveTintColor: theme.colors.text,
                // Alinhando icons a lateral
                tabBarLabelPosition: 'beside-icon',
                // Estilo da barra
                tabBarStyle: {
                    height: 72,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0
                }
            }}
        >
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color}) => 
                        <MaterialIcons 
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color}) => 
                        <MaterialIcons 
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name="Resumo"
                component={Resume}
                options={{
                    tabBarIcon: (({ size, color}) => 
                        <MaterialIcons 
                            name="pie-chart"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Navigator>
    )
}