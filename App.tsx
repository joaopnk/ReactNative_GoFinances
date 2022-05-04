import React from 'react';
import AppLoading from 'expo-app-loading';

import { StatusBar } from 'react-native';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

       {/* ThemeProvider: trabalha como um contexto */}
import { ThemeProvider  } from 'styled-components';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,

} from '@expo-google-fonts/poppins';

// #Componentes:
import theme from './src/global/styles/theme';

// #Barra de nav
import { Routes } from './src/routes';


import { AppRoutes } from './src/routes/app.routes';


// import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Register';
// import { CategorySelect } from './src/screens/CategorySelect';

import { SignIn} from './src/screens/SignIn';

import { AuthProvider, useAuth } from './src/hooks/auth';


export default function App() {

  
  // Recebendo a fonte para que o cell do usuario tenha.
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  // Se a fontes não carregarem, segurnaod usuario na tela de splash
  if(!fontsLoaded || userStorageLoading){
    return <AppLoading />
  }

  return (
    <>
      <ThemeProvider theme={theme}>
          <StatusBar barStyle="light-content" />
          {/* <AppRoutes /> */}
          <AuthProvider>
            <Routes />
          </AuthProvider >
      </ThemeProvider>
    </>
  )
}


