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
// import { useNavigation } from '@react-navigation/native';

import {
    useNavigation,
    NavigationProp,
    ParamListBase,
} from "@react-navigation/native"

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid         from 'react-native-uuid';


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
import { useAuth } from "../../hooks/auth";


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
    .required('O valor é obrigatório!')

});

export function Register(){



    // Para saber qual botão esta selecionado
    const [transactionType, setTransactionType] = useState('');

    const [CategoryModalOpen, setCategoryModalOpen] = useState(false);

    const {user} = useAuth();

    const [category, setCategory] = useState({
        key: 'category',
        name: 'categoria'
    });


    // const navigation = useNavigation();
    const { navigate }: NavigationProp<ParamListBase> = useNavigation();


    const {
        control,
        reset,
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


    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
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

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }
        
        // Realizando o armazenamento
        try{
            const dataKey = `@gofinances:transactions_user:${user.id}`;

            // Recuperando todos os itens existentes
            const data = await  AsyncStorage.getItem(dataKey);
            // Convertendo caso tenha alguma coisa de dados.
            const currentData = data ?  JSON.parse(data) : [];
            
            const  dataFormatted = [
                ...currentData,
                newTransaction
            ]


                                                // Convertendo objeto para texto
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));


            // Limpando campos após cadastrar algo novo!
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            // Redirecionando para a listagem após adicionar
            // navigation.navigate('Listagem');
            navigate("Listagem");


        }
        catch (err){
            console.log(err);
             Alert.alert("Não foi possível cadastrar!");
        }
    }

    /*
    useEffect( () => {
        async function loadData(){
            const data = await AsyncStorage.getItem(dataKey);
            console.log(JSON.parse(data!));
        };

        loadData();


        // Apagando todos os registros existentes
        // async function removeAll() {
        //     await  await AsyncStorage.removeItem(dataKey);
        // }

        // removeAll();

        
    }, []);
    */

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
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive ={transactionType === 'positive'}
                                />
                            <TransactionTypeButton 
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive ={transactionType === 'negative'}
                            
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