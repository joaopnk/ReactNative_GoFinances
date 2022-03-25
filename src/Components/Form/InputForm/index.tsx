import React from "react";
import { TextInputProps } from "react-native";
// https://react-hook-form.com/
import { Control, Controller } from "react-hook-form";

import {Input} from '../Input';

import { Container, Error } from './styles';

interface Props extends TextInputProps{
    control: Control;
    name: string;
    error: string;
} 

export function InputForm({
    control,
    name,
    error,
    ...rest
}: Props){
    return(
        <Container>
            <Controller
                control = {control}
                render ={({ field: {onChange, value}}) => (
                    <Input 
                        onChangeText={onChange}
                        value={value}
                        {...rest}
                    />
                    )}
                name={name}
            />
            {/* Caso tenha erro, aparece o componente abaixo, se não, não! */}
            {error && <Error>{ error }</Error>}
        </Container>
    );
}