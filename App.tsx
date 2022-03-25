import React from 'react';
import AppLoading from 'expo-app-loading';


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
import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './src/routes/app.routes';


// import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Register';
// import { CategorySelect } from './src/screens/CategorySelect';

export default function App() {
  
  // Recebendo a fonte para que o cell do usuario tenha.
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  // Se a fontes não carregarem, segurnaod usuario na tela de splash
  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </ThemeProvider>
    </>
  )
}


