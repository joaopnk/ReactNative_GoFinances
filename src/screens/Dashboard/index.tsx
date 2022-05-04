import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';


import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
} from './styles';


// Extendendo com as propriedades ja existentes e passando o id
export interface DataListProps extends TransactionCardProps {
    id: string,
}

interface HighlightProps{
    amount: string;
    lastTransaction: string;

}
interface HighlightData{
    entries     : HighlightProps;
    expensives  :  HighlightProps;
    total       :  HighlightProps;
    
}   

export function Dashboard(){

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]); 
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative',
    ){

        const collectionFilttered = collection
        .filter(transaction => transaction.type === type);

        // Se entrar aqui, é porque não tem data (nenhuma transação)
        if(collectionFilttered.length === 0){
            return 0;
        }

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFilttered
            .map(transaction => new Date(transaction.date).getTime())));
        
        // Já retornando a data formatadacollection
        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {month: 'long'})}`; 
    }

    async function loadTransctions(){
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        // Recuperando todas as transações
        const response      = await AsyncStorage.getItem(dataKey);
        const transactions  = response ? JSON.parse(response) : [];


        let entriesTotal    = 0;
        let expensiveTotal  = 0;

        // Percorrendo cada transação e formatando (percorrendo cada item, e falando o que é cada um)
        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {


            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }
            else{
                expensiveTotal  += Number(item.amount);
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR',  {
                style: 'currency',
                currency: 'BRL'
            });
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month:'2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        }); 


        setTransactions(transactionsFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionsExpensive = getLastTransactionDate(transactions, 'negative');


        const totalInterval = lastTransactionsExpensive === 0 
        ? 'Não há transações'
        : `01 a ${lastTransactionsExpensive}`;

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionsEntries === 0 
                ? 'Não há transações' 
                : `Última entrada dia ${lastTransactionsEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionsExpensive === 0
                ? 'Não há transações'
                : `Última saida dia ${lastTransactionsExpensive}`,

            },
            total: {
                amount: total.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL',
                }),
                lastTransaction: totalInterval,
                
            }

        })

        setIsLoading(false);


    }

    useEffect( () => {
        loadTransctions();
        const dataKey = '@gofinances:transactions';
        AsyncStorage.removeItem(dataKey);
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransctions();
    }, []));

    return (
        <Container >
            { 
            
            // Validação para loading da tela
            isLoading ? 
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary} 
                        size="large"
                    /> 
                </LoadContainer>    :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo 
                                    source={{ uri: user.photo}}
                                    
                                />
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon  name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                        type="up"
                        title="Entradas" 
                        amount={highlightData.entries?.amount} 
                        lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard
                        type="down"
                        title="Saídas" 
                        amount={highlightData.expensives?.amount}
                        lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard
                        type="total"
                        title="Total" 
                        amount={highlightData.total?.amount}
                        lastTransaction={highlightData.total.lastTransaction}
                        />
                        
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>
        
                        <TransactionsList 
                            data={transactions}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <TransactionCard  data={item}/>}
                        />
                        
                    </Transactions>
                </>
            }
        </Container>
    )
}
