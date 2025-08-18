import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome5, Feather } from "@expo/vector-icons";

const iconMap = {
  car: <AntDesign name="car" size={45} color="#2f2f2f" />,
  motorcycle: <FontAwesome5 name="motorcycle" size={45} color="#2f2f2f" />,
  truck: <Feather name="truck" size={45} color="#2f2f2f" />,
};

const VehicleButton = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>{iconMap[icon]}</View>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export function Home() {
  const navigation = useNavigation();
  const carros = String("carros");
  const motos = String("motos");
  const caminhoes = String("caminhoes");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.subtitle}>O QUE VOCÊ DESEJA VER?</Text>
        <View style={styles.buttonsContainer}>
          <VehicleButton
            icon="car"
            label="Carro"
            onPress={() => navigation.navigate("One", carros)}
          />
          <VehicleButton
            icon="motorcycle"
            label="Moto"
            onPress={() => navigation.navigate("One", motos)}
          />
          <VehicleButton
            icon="truck"
            label="Caminhões"
            onPress={() => navigation.navigate("One", caminhoes)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
    aspectRatio: 1,
    borderRadius: 100,
  },
  subtitle: {
    fontSize: 22,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginBottom: 20,
    width: "45%",
    aspectRatio: 1,
  },
  iconContainer: {
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2f2f2f",
    textAlign: "center",
  },
});
