import React from 'react';
import { Text, View } from 'react-native';
import { HighlightCard } from '../../Components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard';
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
    LogoutButton
} from './styles';


// Extendendo com as propriedades ja existentes e passando o id
export interface DataListProps extends TransactionCardProps {
    id: string,
}

export function Dashboard(){
    const data:  DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount:"R$ 12.000,00",
            category:{
                name: 'Vendas',
                icon: 'dollar-sign',
            },
            date:"13/02/2022",
        },
        {
            id: '2',
            type: 'negative',
            title: "Hamburgueria Pizzy",
            amount:"R$ 59,00",
            category:{
                name: 'Alimentação',
                icon: 'coffee',
            },
            date:"10/02/2022",
        },
        {
            id: '3',
            type: 'negative',
            title: "Aluguel do apartamento",
            amount:"R$ 1.200,00",
            category:{
                name: 'Casa',
                icon: 'shopping-bag',
            },
            date:"11/02/2022",
        },
];
    return (
        <Container >
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo 
                            source={{ uri: 'https://avatars.githubusercontent.com/u/71463038?v=4'}}
                            
                        />
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>João</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton onPress={() => {}}>
                        <Icon  name="power" />
                    </LogoutButton>
                </UserWrapper>
            </Header>

            <HighlightCards>
                <HighlightCard
                type="up"
                title="Entradas" 
                amount="R$ 17.400,00" 
                lastTransaction="Última entrada dia 17 de fevereiro."
                />
                <HighlightCard
                type="down"
                title="Saídas" 
                amount="R$ 1.259,00" 
                lastTransaction="Última saida dia 19 de fevereiro."
                />
                <HighlightCard
                type="total"
                title="Total" 
                amount="R$ 16.141,00" 
                lastTransaction="17 à 19 de fevereiro"
                />
                
            </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
 
                <TransactionsList 
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <TransactionCard  data={item}/>}
                />
                
             </Transactions>
        </Container>
    )
}
