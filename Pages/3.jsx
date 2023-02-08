import React, {useEffect, useState} from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

export function Three(){

  const [data, setData] = useState([]);
  const dados = []
  const [marca, setMarca] = useState('')
  const [moto, setMoto] = useState(false)
  const navigation = useNavigation()
  const {params} = useRoute()
  const [tipo, setTipo] = useState([])
  const [waiting, setWaiting] = useState(false)

  async function getData(){
    setWaiting(true)
    const response = await api.get( params.params.params+"/marcas/"+params.params.item.codigo+"/modelos/"+params.item.codigo+"/anos")
    setData(response.data)
    setWaiting(false)
  
  }

  //Para o item carro ou moto ou caminhão
  //console.log(params.params.params)
  //Para o codigo da montadora
  //console.log(params.params.item.codigo)
  //Para o codigo do carro
  //console.log(params.item.codigo)



  useEffect(() => {
    getData(),
    setTipo(params.params)
  }, []);



  return(
    <View style={styles.container}>
    {

    }
        <Text>VEICULO SELECIONADO:</Text>
      <Text style={styles.title}>{params.item.nome}</Text>
      <Text>MONTADORA:</Text>
      <Text style={styles.title}>{params.params.item.nome}</Text>
    <Text style={styles.title}>SELECIONE O ANO:</Text>
      
      <FlatList
        data={data}
        renderItem={({item})=>(
          <View style={{flex:1, justifyContent:'center'}}>
          <TouchableOpacity 
            style={styles.botao}
            onPress={()=>{navigation.navigate('Four', {item, params})}}
          > 
            <Text>{item.codigo} </Text>
            <Text>{item.nome}</Text>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>  
          </View>
  )}
        keyExtractor={(item)=>String(item.codigo)}
      />

      
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
