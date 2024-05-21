import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { api } from "../api";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";

export function Home() {
  const navigation = useNavigation();
  const carros = String("carros");
  const motos = String("motos");
  const caminhoes = String("caminhoes");

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 45,
          fontStyle: "italic",
          fontWeight: "300",
          marginBottom: 25,
          textAlign: "center",
          backgroundColor: "#2f2f2f",
          color: "#ffff",
          borderRadius: 10,
        }}
      >
        APP FIPE
      </Text>
      <Text style={styles.title}>O QUE VOCÊ DESEJA VER?</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableOpacity
          style={styles.botao1}
          onPress={() => navigation.navigate("One", carros)}
        >
          <View>
            <AntDesign name="car" size={45} color="black" />
            <Text style={{ textAlign: "center", fontSize: 18 }}>Carro</Text>
          </View>
          {/* <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} /> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao2}
          onPress={() => navigation.navigate("One", motos)}
        >
          <View>
            <FontAwesome5 name="motorcycle" size={45} color="black" />
            <Text style={{ textAlign: "center", fontSize: 18 }}>Moto</Text>
          </View>
          {/* <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} /> */}
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("One", caminhoes)}
        >
          <View>
            <Feather
              name="truck"
              size={45}
              color="black"
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
            <Text style={{ textAlign: "center", fontSize: 18 }}>Caminhões</Text>
          </View>
          {/* <AntDesign name="rightcircleo" size={24} color="black" style={styles.icone} /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
  },
  botao: {
    marginTop:45,
    flexDirection: "row",
    width: "90%",
    height: 85,
    alignSelf:'center',
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "#9AC1F0",
    padding: 5,
    elevation: 10,
    borderRadius: 8,
  },
  botao1: {
    flexDirection: "row",
    width: "40%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "#9AC1F0",
    padding: 5,
    elevation: 10,
    borderRadius: 8,
  },
  botao2: {
    flexDirection: "row",
    width: "40%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "#9AC1F0",
    padding: 5,
    elevation: 10,
    borderRadius: 8,
  },
  icone: {
    position: "absolute",
    right: 15,
  },
});
