import React, {useEffect, useState} from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

export function Four(){

  const [data, setData] = useState([]);

  const navigation = useNavigation()
  const {params} = useRoute()
  const [waiting, setWaiting] = useState(false)

  async function getData(){
    setWaiting(true)
    const response = await api.get(params.params.params.params+ "/marcas/"+params.params.params.item.codigo+"/modelos/"+params.params.item.codigo+"/anos/"+params.item.codigo )

    setData(response.data)
   console.log(response.data)
   setWaiting(false)
  }
  //Para tirar o codigo do veiculo
    //console.log(params.item.codigo)
//Para saber qual o tipo
    //console.log(params.params.params.params)
//Para descobrir o código do modelo
    //console.log(params.params.item.codigo)
//Para descobrir o codigo da montadora
    //console.log(params.params.params.item.codigo)




  useEffect(() => {
    getData()
  }, []);



  return(
    <View style={styles.container}>
    <Text style={styles.title}>{data.AnoModelo}</Text>
    <Text style={styles.title}>{data.CodigoFipe}</Text>
    <Text style={styles.title}>{data.Combustivel}</Text>
    <Text style={styles.title}>{data.Marca}</Text>
    <Text style={styles.title}>{data.MesReferencia}</Text>
    <Text style={styles.title}>{data.Modelo}</Text>
    <Text style={styles.title}>{data.Valor}</Text>

      

      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
    marginTop:50,
    justifyContent:'center',
  },
  title:{
    fontSize:25,
    textTransform:'uppercase'
  },
  botao:{
    flexDirection:'row',
    width:'95%',
    height:55,
    alignItems:'center',
    justifyContent:'space-between',
    margin:5,
    backgroundColor:'#9AC1F0',
    padding:5,
    elevation:10,
    borderRadius:8
    
  }
})
