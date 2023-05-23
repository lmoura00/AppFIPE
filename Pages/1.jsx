import React, {useEffect, useState} from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList , ActivityIndicator} from 'react-native'
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

export function One(){

  const [data, setData] = useState([]);

  const navigation = useNavigation()
  const {params} = useRoute()
  const [waiting, setWaiting] = useState(false)

  async function getData(){
    setWaiting(true)
    const response = await api.get(params + '/marcas')
    setData(response.data);
    console.log(response.data)
    setWaiting(false)
    //console.log(response.data)
    
  }


  useEffect(() => {
    getData()
  }, []);



  return(
    <View style={styles.container}>
        <Text style={styles.title}>LISTA DE {params}</Text>
    {
        waiting ?
        <ActivityIndicator size="large" style={{flex:1}}/>
        :
        <FlatList
        data={data}
        renderItem={({item})=>(
          <View style={{flex:1, justifyContent:'center'}}>
          <TouchableOpacity 
            style={styles.botao}
            onPress={()=>{navigation.navigate('Two', {item, params})}} 
          > 
            <Text>{item.codigo} </Text>
            <Text>{item.nome}</Text>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>  
          </View>
            )}
        keyExtractor={(item)=>String(item.codigo)}
      />
    }
      


      
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
