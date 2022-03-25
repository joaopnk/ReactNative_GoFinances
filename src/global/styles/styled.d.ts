import 'styled-components';
import theme from './theme';

// Acessando o styled-components e sobrescrevendo
declare module 'styled-components' {
    type ThemeType = typeof theme

    export interface DefaultTheme extends ThemeType {}
}