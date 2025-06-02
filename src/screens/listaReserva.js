import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axios/axios";

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
      const userId = await AsyncStorage.getItem("userId");
      const response = await api.getListaReserva(userId);
      setReservas(response.data.results);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
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
    <View style={styles.containerBgg}>
      <Text style={styles.titulo}>Reservas do Usuário:</Text>

      {loading ? (
        <Text>Nenhuma Reserva Encontrada</Text>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listagem}>
              <Text style={styles.textoCentral}>
                Data de Início: {formatarData(item.dateStart)}
              </Text>
              <Text style={styles.textoCentral}>
                Data de Fim: {formatarData(item.dateEnd)}
              </Text>
              <Text style={styles.textoCentral}>
                Horário de Início: {item.timeStart}
              </Text>
              <Text style={styles.textoCentral}>
                Horário de Fim: {item.timeEnd}
              </Text>
              <Text style={styles.textoCentral}>
                Número da Sala: {item.classroom}
              </Text>

              <View style={styles.botoesLayout}>
                <TouchableOpacity
                  style={styles.confirmBut}
                  onPress={() => abrirModalCancelar(item)}
                >
                  <Text >Cancelar</Text>
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
        <Text style={styles.textoBotao}>Fazer Reserva</Text>
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
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              Você tem certeza que deseja cancelar essa reserva?
            </Text>
            <View style={styles.botoesLayout}>
              <TouchableOpacity
                style={styles.confirmBut}
                onPress={cancelarReserva}
              >
                <Text>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.denyBut}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{color:"#ffffff"}}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBgg: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  listagem: {
    display: "flex",
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 10,
    width: "85%",
    alignSelf: "center",
    marginBottom: 10,
  },
  textoCentral: {
    textAlign: "center",
  },
  confirmBut: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    width: "45%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 5,
  },
  denyBut: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#215299",
    width: "45%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 5,
  },
  botoesLayout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#DDDDDD",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    borderWidth: 1,
    borderColor: "#000000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.57)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoFazerReserva: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
