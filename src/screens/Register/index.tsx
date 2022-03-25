import React, { useState, useEffect  } from "react";
import { 
    Keyboard, 
    Modal, 
    TouchableWithoutFeedback,
    Alert,
} from "react-native";

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { InputForm } from '../../Components/Form/InputForm';
import { Button } from '../../Components/Form/Button';
import { TransactionTypeButton} from '../../Components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../Components/Form/CategorySelectButton';
import { CategorySelect } from "../CategorySelect";


import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
 } from './styles';


interface FormData{
    name: string;
    amount: string;
}


const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório!'),

    amount: Yup
    .number()
    .typeError('Informe um valor númerico!')
    .transform((_value, originalValue) => Number(originalValue.replace(/,/, '.')))
    .positive('O valor não pode ser negativo!')
});

export function Register(){

    const dataKey = '@gofinances:transactions';


    // Para saber qual botão esta selecionado
    const [transactionType, setTransactionType] = useState('');

    const [CategoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });


    // Fecha a modal
    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }

    // Abre a modal
    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }


    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type);
    }


    async function handleRegister(form: Partial<FormData>){
        
        // [Validações]
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação!');
        }
        
        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria!');
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }
        
        // Realizando o armazenamento
        try{
                                                // Convertendo objeto para texto
            await AsyncStorage.setItem(dataKey, JSON.stringify(data));
        }
        catch (err){
            console.log(err);
             Alert.alert("Não foi possível cadastrar!");
        }
    }

    useEffect( () => {
        async function loadData(){
            const data = await AsyncStorage.getItem(dataKey);
            console.log(JSON.parse(data!));
        };

        loadData();
        
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                            />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}

                        />
                        <TransactionsTypes>
                            <TransactionTypeButton 
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive ={transactionType === 'up'}
                                />
                            <TransactionTypeButton 
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive ={transactionType === 'down'}
                            
                            />
                        </TransactionsTypes>

                        <CategorySelectButton 
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button 
                        title="Enviar" 
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={CategoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>

    );
}