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
} from "react-native";
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const ListItem = React.memo(({ item, params, navigation }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={() => navigation.navigate("Three", { item, params })}
  >
    <View style={styles.itemContainer}>
      <Text style={styles.itemCode}>{item.codigo}</Text>
      <Text style={styles.itemName}>{item.nome}</Text>
    </View>
    <AntDesign name="right" size={20} color="#555" />
  </TouchableOpacity>
));

export function Two() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { params } = useRoute();

  const fetchData = async () => {
    try {
      setError(null);
      const response = await api.get(
        `${params.params}/marcas/${params.item.codigo}/modelos`
      );
      setData(response.data.modelos);
    } catch (err) {
      setError("Não foi possível carregar os modelos. Tente novamente.");
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Modelos</Text>
          <Text style={styles.subtitle}>{params.item.nome}</Text>
        </View>
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 16,
    color: "#007bff",
    textAlign: "center",
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
    padding: 20,
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
  itemCode: {
    fontSize: 16,
    color: "#888",
    marginRight: 15,
    fontWeight: "500",
    minWidth: 40,
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