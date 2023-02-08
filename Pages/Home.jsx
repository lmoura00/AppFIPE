import React, {useEffect, useState} from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import { api } from "../api";
import {useNavigation} from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'; 


export function Home(){

  const navigation = useNavigation()
  const carros = String('carros');
  const motos = String('motos');
  const caminhoes = String('caminhoes');

  

  

  return(
    <View style={styles.container}>
      <Text style={styles.title}>O QUE VOCÊ DESEJA VER?</Text>
        <TouchableOpacity style={styles.botao}  onPress={()=> navigation.navigate('One', carros)}>
            <Text>Carro</Text>
            <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={()=> navigation.navigate('One', motos)} >
            <Text>Moto</Text>
            <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={()=> navigation.navigate('One', caminhoes)}>
            <Text>Caminhões</Text>
            <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} />
        </TouchableOpacity>


      
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
    fontSize:25
  },
  botao:{
    flexDirection:'row',
    width:'95%',
    height:55,
    alignItems:'center',
    justifyContent:'center',
    margin:5,
    backgroundColor:'#9AC1F0',
    padding:5,
    elevation:10,
    borderRadius:8
  },
  icone:{
    position:'absolute',
    right:15
  }
})
