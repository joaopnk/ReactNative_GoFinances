import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { addMonths, subMonths, format } from 'date-fns'; 
import { ptBR } from 'date-fns/locale'; 
import { HistoryCard } from "../../Components/HistoryCard";
import { categories } from "../../utils/categories";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";

// import { addMonths }



import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
} from './styles';
import { useAuth } from "../../hooks/auth";

interface TransactionData {
    type: 'positive' | 'negative',
    name: string,
    amount: string,
    category: string,
    date: string
}

interface CategoryData {
    key: string,
    name: string,
    total: number,
    totalFormated: string,
    color: string,
    percent: string,
}

export function Resume(){

    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    
    // Parametrizando para saber se vai estar avançando ou recuando a data (action)
    function handleChangeDate(action: 'next' | 'prev'){
        // Utilizando a lib https://date-fns.org/ para lidar com datas



        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1));
        }else{
            setSelectedDate(subMonths(selectedDate, 1));
        }
    }

    const theme = useTheme();

    const {user} = useAuth();
    

    async function loadData(){

        setIsLoading(true);
        

        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await  AsyncStorage.getItem(dataKey);
        const responseFormatted = response ?  JSON.parse(response) : [];


        // Filtrando transações de saida
        const  expensives = responseFormatted
        .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );



        // Calculando o total da %
        const expensivesTotal = expensives
        .reduce((acumulator: number , expensive: TransactionData) => {
            return acumulator + Number(expensive.amount); 
        }, 0);

        // Vetor auxiliar do laço abaixo
        const totalByCategory: CategoryData[] = [];

        // Percorrendo cada categoria   
        categories.forEach(category => {
            let categorySum = 0;

            // Pra cada categoria, percorrendo todos os gastos, e verificando se categoria do gasto é a mesma da chave que estou percorrendo
            expensives.forEach((expensive: TransactionData) => {
                // Caso seja, realiza a soma
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });


            if(categorySum > 0){

                const totalFormated = categorySum
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                // Descobrindo a % de cada categoria
                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormated,
                    percent,
                });
            }
        });

        setTotalByCategories(totalByCategory);

        setIsLoading(false);
    }



    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {            
                isLoading ? 
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary} 
                            size="large"
                        /> 
                    </LoadContainer>    :

                    <Content 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >

                        <MonthSelect>
                            <MonthSelectButton onPress={ () => handleChangeDate('prev')}>
                                <MonthSelectIcon  name="chevron-left" />
                            </MonthSelectButton>
        
                            <Month>
                                { format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                            </Month>

                            <MonthSelectButton onPress={ () => handleChangeDate('next')}>
                                <MonthSelectIcon name="chevron-right" />
                            </MonthSelectButton>

                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie 
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: { 
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape,
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"
                            />
                        </ChartContainer>

                        {   
                            totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormated}
                                    color={item.color}
                                />
                            ))
                        }
                    </Content>
            }
        </Container>
    );
}