import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import api from "../axios/axios";
import * as SecureStore from 'expo-secure-store';

export default function ListaReserva({ navigation }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    getListaReserva();
  }, []);

  async function getListaReserva() {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const response = await api.getListaReserva(userId);
      setReservas(response.data.results);
    } catch (error) {
      console.log(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function abrirModalCancelar(reserva) {
    setReservaSelecionada(reserva);
    setModalVisible(true);
  }

  async function cancelarReserva() {
    try {
      await api.deleteReserva(reservaSelecionada.id);
      setReservas(reservas.filter((item) => item.id !== reservaSelecionada.id));
      setModalVisible(false);
    } catch (error) {
      console.log("Erro ao cancelar reserva:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minhas Reservas</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#215299" style={{ marginTop: 50 }} />
      ) : reservas.length === 0 ? (
        <Text style={styles.semReservaTexto}>Nenhuma reserva encontrada</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.cardReserva}>
              <Text style={styles.textoCentral}>Data de Início: {formatarData(item.dateStart)}</Text>
              <Text style={styles.textoCentral}>Data de Fim: {formatarData(item.dateEnd)}</Text>
              <Text style={styles.textoCentral}>Horário de Início: {item.timeStart}</Text>
              <Text style={styles.textoCentral}>Horário de Fim: {item.timeEnd}</Text>
              <Text style={styles.textoCentral}>Número da Sala: {item.classroom}</Text>

              <View style={styles.botoesLayout}>
                <TouchableOpacity
                  style={styles.denyBut}
                  onPress={() => abrirModalCancelar(item)}
                >
                  <Text style={styles.textoBotaoPequeno}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.botaoFazerReserva}
        onPress={() => navigation.navigate("ListaSalas")}
      >
        <Text style={styles.textoBotao}>Fazer Nova Reserva</Text>
      </TouchableOpacity>

      {/* Modal de Confirmação */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>
              Você tem certeza que deseja cancelar essa reserva?
            </Text>
            <View style={styles.botoesLayout}>
              <TouchableOpacity
                style={styles.confirmBut}
                onPress={cancelarReserva}
              >
                <Text style={styles.textoBotaoPequeno}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.denyBut}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotaoPequeno}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    color: "#215299",
  },
  semReservaTexto: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
    marginTop: 40,
  },
  cardReserva: {
    display:"flex",
    alignItems:"center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textoCentral: {
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
    marginVertical: 2,
  },
  denyBut: {
    backgroundColor: "#D9534F",
    width: "45%",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  confirmBut: {
    backgroundColor: "#0275D8",
    width: "45%",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  botoesLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTexto: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    color: "#333333",
  },
  botaoFazerReserva: {
    backgroundColor: "#215299",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 3,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  textoBotaoPequeno: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
});
