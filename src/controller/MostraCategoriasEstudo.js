// Arquivo que mostra nomes de categorias de estudo
import React, {useState, useEffect} from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';

// Icone baixado em https://icons8.com/icons
import imagemCategoriaEstudo from '../../assets/microscopio.png'

import API_URL from '../model/config'

import { useNavigation } from '@react-navigation/native';

import { getAllLocalCategoriasEstudos, saveListaCategoriasEstudo, createTable, dropTable } from '../model/saveLocalCategoriasDeEstudo';

// Item da lista: um botão com um texto do nome da categoria de estudo
const Item = ({item, onPress, backgroundColor, textColor}) => (

  // Botão customizável e interativo quando pressionado
  <TouchableOpacity onPress={onPress} style={[estilos.item, {backgroundColor}]}>

    {/*<Image source={imagemCategoriaEstudo} style={estilos.imagem} ></Image>*/}

    {/* Abaixo o texto do nome da categoria de estudo retirada da lista de categorias de estudo*/}
    <Text style={[estilos.nomeCategoriaEstudo, {color: textColor}]}>{item.nomeCategoriaEstudo}</Text>
    
  </TouchableOpacity>

);


export default function MostraCategoriasEstudo() {
  // Efeito colateral para buscar a lista de categorias de estudo ao montar o componente
  useEffect(() => {
    fetchListaCategoriasEstudo();
  }, []);

  // Estado local para armazenar a lista de categorias de estudo
  const [listaCategoriasEstudo, setListaCategoriasEstudo] = useState([]); 

  // Função assíncrona para buscar a lista de categoria de estudos da API
  const fetchListaCategoriasEstudo = async () => {
    try {
        const response = await fetch(`${API_URL}/listaCategoriasEstudo`);
        data = await response.json();
        setListaCategoriasEstudo(data);
        saveLocally(data);

    } catch(error){
        console.error("Erro ao buscar lista de categorias de estudo no banco de dados externo ", error);
        console.log("Tentando buscar no banco de dados local...");
        try {
            const dadosLocais = await getAllLocalCategoriasEstudos();
            setListaCategoriasEstudo(dadosLocais);
        } catch (error) {console.log("Erro ao buscar lista de categorias de estudo no banco de dados locais ", error);}
    }
  }

  // Função responsável por salvar localmente as categorias de estudo
  async function saveLocally(listaCategoriasDeEstudo){
    try{
      createTable();
      saveListaCategoriasEstudo(listaCategoriasDeEstudo);
    } catch (error) { console.log("Erro ao salvar localmente ", error); }
  }

  // Estado local para ser utilizado na mudança de cor do botão
  const [selectedId, setSelectedId] = useState();

  // Variável utilizada para navegação entre telas
  const navigation = useNavigation();

  // Função para renderização de item da lista
  const renderItem = ({item}) => {

    // O cor de fundo do botão muda do último valor para o primeiro quando clicado
    const backgroundColor = item.id === selectedId ? '#0981D1' : '#00AAFF';
    
    // A cor do texto muda do último valor para o primeiro quando clicado
    const color = item.id === selectedId ? '#00AAFF' : 'black';
    
    return (
      <Item
        item={item}

        // Quando clicado ele muda de cor e navega para outra tela
        onPress={
          () => { setSelectedId(item.id)
          navigation.navigate('Patologias', {nomeBuscado:""})
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  
  // O retorno padrão desta tela é a flatlist abaixo
  return (
    <FlatList
      data={listaCategoriasEstudo}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      extraData={selectedId}
    />
  )
};
  
const estilos = StyleSheet.create({
    item: {
        //flexDirection: "row" ,
        alignItems: 'center',
        padding: 30,
        marginVertical: 30,
        marginHorizontal: 30,
        borderRadius: 10,
      },

    nomeCategoriaEstudo: {
      fontSize: 32,
      textAlign: "center",
      lineHeight: 32,
      fontWeight: 'bold',
      //backgroundColor: '#ffffff'
    },
    /*
    imagem: {
        width: 75,
        height: 75,
       // backgroundColor: '#000000',
        
    },*/
    

});
