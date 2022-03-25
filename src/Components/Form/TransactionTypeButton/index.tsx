import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { 
    Container,
    Icon,
    Title,
    Button
} from './styles'

// Deixando já "pré-definido os icons"
const Icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

interface Props extends RectButtonProps{
    type: 'up' | 'down';
    title: string;
    isActive: boolean;
}

export function TransactionTypeButton({
    type,
    title,
    isActive,
    ...rest
}: Props){
    return(
        <Container 
         isActive={isActive}
         type={type}
        >
            <Button
                {...rest}
            >
                <Icon 
                    name={Icons[type]} 
                    type={type}
                />
                <Title>{ title }</Title>
            </Button>

        </Container>
    );
}