import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Image, // Importe o componente Image
} from "react-native";
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";


const formatBrandNameForApi = (name) => {
  
  let formattedName = name.toLowerCase().replace(/\s+/g, "");
  if (formattedName.includes("mercedes-benz")) return "mercedes-benz.com";
  if (formattedName.includes("astonmartin")) return "astonmartin.com";
  if (formattedName.includes("landrover")) return "landrover.com";
  return `${formattedName}.com`;
};

const ListItem = React.memo(({ item, params, navigation }) => {
  const logoUrl = `https://logo.clearbit.com/${formatBrandNameForApi(item.nome)}`;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("Two", { item, params })}
    >
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: logoUrl }}
          style={styles.logo}
          defaultSource={require('../assets/icon.png')} 
        />
        <Text style={styles.itemName}>{item.nome}</Text>
      </View>
      <AntDesign name="right" size={20} color="#555" />
    </TouchableOpacity>
  );
});

export function One() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { params } = useRoute();

  const fetchData = async () => {
    try {
      setError(null);
      const response = await api.get(`${params}/marcas`);
      setData(response.data);
    } catch (err) {
      setError("Não foi possível carregar as marcas. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Selecione a Marca de{" "}
          <Text style={styles.paramsText}>{params}</Text>
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ListItem item={item} params={params} navigation={navigation} />
        )}
        keyExtractor={(item) => String(item.codigo)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 20,
    zIndex: 1,
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 50,
  },
  paramsText: {
    color: "#007bff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: "contain",
  },
  itemName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    flexShrink: 1,
  },
  errorText: {
    fontSize: 18,
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});