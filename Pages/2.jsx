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
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { UNSPLASH_KEY } from "../config";

const { width } = Dimensions.get("window");

const formatBrandNameForApi = (name) => {
  let formattedName = name.toLowerCase().replace(/\s+/g, "");
  if (formattedName.includes("mercedes-benz")) return "mercedes-benz.com";
  if (formattedName.includes("astonmartin")) return "astonmartin.com";
  if (formattedName.includes("landrover")) return "landrover.com";
  return `${formattedName}.com`;
};

const ListItem = React.memo(({ item, params, navigation }) => {
  const scaleAnim = useMemo(() => new Animated.Value(1), []);

  const handlePress = useCallback(() => {
    navigation.navigate("Three", { item, params });
  }, [item, params, navigation]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
        accessible
        accessibilityLabel={`Modelo ${item.nome}`}
        accessibilityRole="button"
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemName} numberOfLines={2}>
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
    </Animated.View>
  );
});

export function Two() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);
  const [brandImage, setBrandImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const navigation = useNavigation();
  const { params } = useRoute();

  const fetchBrandLogo = useCallback((marca) => {
    try {
      const logoUrl = `https://logo.clearbit.com/${formatBrandNameForApi(marca)}`;
      setBrandLogo(logoUrl);
    } catch (err) {
      console.error("Erro ao buscar logo:", err);
    }
  }, []);

  const fetchBrandImage = useCallback(async (marca) => {
    try {
      setImageLoading(true);
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(marca)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setBrandImage(data.results[0].urls.regular);
      }
    } catch (err) {
      console.error("Erro ao buscar imagem da marca:", err);
    } finally {
      setImageLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get(
        `${params.params}/marcas/${params.item.codigo}/modelos`
      );
      setData(response.data.modelos);
      // Buscar logo e imagem da marca
      fetchBrandLogo(params.item.nome);
      fetchBrandImage(params.item.nome);
    } catch (err) {
      setError("Não foi possível carregar os modelos. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params, fetchBrandLogo, fetchBrandImage]);

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
      <Text style={styles.loadingText}>Carregando modelos...</Text>
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
        accessibilityLabel="Tentar carregar modelos novamente"
        accessibilityRole="button"
      >
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>Nenhum modelo disponível</Text>
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
      {brandImage && (
        <Image
          source={{ uri: brandImage }}
          style={styles.backgroundImage}
          onError={() => setBrandImage(null)}
        />
      )}
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
        <View style={styles.titleContainer}>
          {brandLogo ? (
            <Image
              source={{ uri: brandLogo }}
              style={styles.brandLogo}
              onError={() => setBrandLogo(null)}
            />
          ) : (
            <View style={styles.brandLogoPlaceholder}>
              <FontAwesome name="car" size={20} color="#bbb" />
            </View>
          )}
          <Text style={styles.title}>Modelos</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {params.item.nome}
          </Text>
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
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: 180,
    opacity: 0.3,
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
  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
  brandLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 8,
  },
  brandLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#007bff",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
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
  itemName: {
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