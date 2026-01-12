import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const formatBrandNameForApi = (name) => {
  let formattedName = name.toLowerCase().replace(/\s+/g, "");
  if (formattedName.includes("mercedes-benz")) return "mercedes-benz.com";
  if (formattedName.includes("astonmartin")) return "astonmartin.com";
  if (formattedName.includes("landrover")) return "landrover.com";
  return `${formattedName}.com`;
};

const ListItem = React.memo(({ item, params, navigation }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const logoUrl = useMemo(
    () => `https://logo.clearbit.com/${formatBrandNameForApi(item.nome)}`,
    [item.nome]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handlePress = useCallback(() => {
    navigation.navigate("Two", { item, params });
  }, [item, params, navigation]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
      accessible
      accessibilityLabel={`Marca ${item.nome}`}
      accessibilityRole="button"
    >
      <View style={styles.itemContainer}>
        <View style={styles.logoContainer}>
          {!imageLoaded && (
            <ActivityIndicator
              size="small"
              color="#007bff"
              style={styles.logoLoader}
            />
          )}
          {!imageError ? (
            <Animated.Image
              source={{ uri: logoUrl }}
              style={[styles.logo, { opacity: fadeAnim }]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <AntDesign name="car" size={20} color="#bbb" />
            </View>
          )}
        </View>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.nome}
        </Text>
      </View>
      <AntDesign
        name="right"
        size={20}
        color="#007bff"
        accessible={false}
      />
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

  const fetchData = useCallback(async () => {
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
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [params, fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Carregando marcas...</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <AntDesign
        name="warning"
        size={50}
        color="#d9534f"
        style={styles.errorIcon}
      />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={fetchData}
        accessible
        accessibilityLabel="Tentar carregar marcas novamente"
        accessibilityRole="button"
      >
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>Nenhuma marca disponível</Text>
    </View>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessible
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <AntDesign name="arrowleft" size={24} color="#007bff" />
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
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={true}
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
    paddingBottom: 10,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  paramsText: {
    color: "#007bff",
    fontWeight: "700",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    marginHorizontal: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  logoLoader: {
    position: "absolute",
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: "#007bff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});