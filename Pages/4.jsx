import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
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

const DetailRow = ({ label, value, icon }) => (
  <View
    style={styles.detailRow}
    accessible
    accessibilityLabel={`${label}: ${value}`}
    accessibilityRole="text"
  >
    <FontAwesome
      name={icon}
      size={20}
      color="#007bff"
      style={styles.icon}
      accessible={false}
    />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export function Four() {
  const [data, setData] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const navigation = useNavigation();
  const { params } = useRoute();

  const fetchCarImage = useCallback(async (marca, modelo) => {
    try {
      setImageLoading(true);
      const searchQuery = `${marca} ${modelo}`;
      console.log("Buscando imagem para:", searchQuery);
      console.log("Chave:", UNSPLASH_KEY);
      
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`;
      console.log("URL completa:", url);
      
      const response = await fetch(url);
      console.log("Status da resposta:", response.status);
      
      const data = await response.json();
      console.log("Dados recebidos:", data);
      
      if (data.results && data.results.length > 0) {
        setCarImage(data.results[0].urls.regular);
      }
    } catch (err) {
      console.error("Erro ao buscar imagem:", err);
    } finally {
      setImageLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${params.params.params.params}/marcas/${params.params.params.item.codigo}/modelos/${params.params.item.codigo}/anos/${params.item.codigo}`;
      const response = await api.get(url);
      setData(response.data);
      
      // Buscar imagem do carro
      if (response.data.Marca && response.data.Modelo) {
        fetchCarImage(response.data.Marca, response.data.Modelo);
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError("Não foi possível carregar os detalhes. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, fadeAnim, fetchCarImage]);

  useEffect(() => {
    fetchData();
  }, [params, fetchData]);

  const renderLoading = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    </SafeAreaView>
  );

  const renderError = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonError}
          accessible
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <AntDesign name="arrowleft" size={24} color="#007bff" />
        </TouchableOpacity>
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
          accessibilityLabel="Tentar carregar detalhes novamente"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return renderLoading();
  }

  if (error) {
    return renderError();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {data && (
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <View style={styles.imageContainer}>
              {carImage ? (
                <Image
                  source={{ uri: carImage }}
                  style={styles.carImage}
                  onError={() => setCarImage(null)}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  {imageLoading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                  ) : (
                    <FontAwesome name="car" size={60} color="#ddd" />
                  )}
                </View>
              )}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButtonFloating}
                accessible
                accessibilityLabel="Voltar"
                accessibilityRole="button"
              >
                <AntDesign name="arrowleft" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>{data.Modelo}</Text>
              <Text style={styles.brandTitle}>{data.Marca}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceValue}>{data.Valor}</Text>
              <Text style={styles.priceLabel}>Valor (Tabela FIPE)</Text>
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Informações do Veículo</Text>
              <DetailRow
                label="Ano"
                value={data.AnoModelo}
                icon="calendar"
              />
              <DetailRow
                label="Combustível"
                value={data.Combustivel}
                icon="tint"
              />
              <DetailRow
                label="Tipo de Veículo"
                value={data.TipoVeiculo || "N/A"}
                icon="car"
              />
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Dados FIPE</Text>
              <DetailRow
                label="Código FIPE"
                value={data.CodigoFipe}
                icon="barcode"
              />
              <DetailRow
                label="Referência"
                value={data.MesReferencia}
                icon="clock-o"
              />
              {data.Sigla && (
                <DetailRow
                  label="Sigla"
                  value={data.Sigla}
                  icon="tag"
                />
              )}
            </View>

            {(data.NumeroPortarias || data.Reavaliacoes || data.PotenciaMotor) && (
              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Especificações</Text>
                {data.NumeroPortarias && (
                  <DetailRow
                    label="Portarias"
                    value={data.NumeroPortarias}
                    icon="file-text"
                  />
                )}
                {data.Reavaliacoes && (
                  <DetailRow
                    label="Reavaliações"
                    value={data.Reavaliacoes}
                    icon="refresh"
                  />
                )}
                {data.PotenciaMotor && (
                  <DetailRow
                    label="Potência do Motor"
                    value={data.PotenciaMotor}
                    icon="bolt"
                  />
                )}
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 10,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  backButtonFloating: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 44,
    height: 44,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  carImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1c1c1e",
    textAlign: "center",
  },
  brandTitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    fontWeight: "500",
  },
  priceContainer: {
    marginVertical: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 20,
    borderRadius: 12,
  },
  priceValue: {
    fontSize: 44,
    fontWeight: "700",
    color: "#007bff",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  icon: {
    marginRight: 12,
    width: 20,
    textAlign: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    minWidth: 90,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
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