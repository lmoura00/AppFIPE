import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { api } from "../api";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const DetailRow = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    <FontAwesome name={icon} size={20} color="#007bff" style={styles.icon} />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export function Four() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const { params } = useRoute();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = `${params.params.params.params}/marcas/${params.params.params.item.codigo}/modelos/${params.params.item.codigo}/anos/${params.item.codigo}`;
      const response = await api.get(url);
      setData(response.data);
    } catch (err) {
      setError("Não foi possível carregar os detalhes. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { top: 20 }]}
          >
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        {data && (
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>{data.Modelo}</Text>
              <Text style={styles.brandTitle}>{data.Marca}</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceValue}>{data.Valor}</Text>
              <Text style={styles.priceLabel}>Valor (Tabela FIPE)</Text>
            </View>

            <View style={styles.detailsCard}>
              <DetailRow label="Ano" value={data.AnoModelo} icon="calendar" />
              <DetailRow
                label="Combustível"
                value={data.Combustivel}
                icon="tint"
              />
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
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Tom de cinza um pouco mais azulado
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
    width: "100%",
  },
  backButton: {
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c1c1e",
    textAlign: "center",
  },
  brandTitle: {
    fontSize: 18,
    color: "#8a8a8e",
    textAlign: "center",
    marginTop: 4,
  },
  priceContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  priceValue: {
    fontSize: 48,
    fontWeight: "200",
    color: "#007bff",
  },
  priceLabel: {
    fontSize: 16,
    color: "#8a8a8e",
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
    width: 20,
    textAlign: "center",
  },
  detailLabel: {
    fontSize: 16,
    color: "#6c6c70",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    color: "#1c1c1e",
    marginLeft: 8,
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