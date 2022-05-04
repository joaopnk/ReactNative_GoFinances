import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

// Acessando contexto para verificar se o usuario está autenticado.
import { useAuth } from '../hooks/auth';

export function Routes(){
    const { user} = useAuth();


    return (
        <NavigationContainer>
            {/* Validando autenticação.. */}
            {user.id ? <AppRoutes/> : <AuthRoutes />}
        </NavigationContainer>
    );
}