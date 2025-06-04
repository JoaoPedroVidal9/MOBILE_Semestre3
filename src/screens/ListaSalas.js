import { useEffect, useState } from "react";
import api from "../axios/axios";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

export default function ListaSalas({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalConsulta, setModalConsulta] = useState(false);
  const [modalDisponivel, setModalDisponivel] = useState(false);

  const [idSala, setIdSala] = useState();
  const [infoSchedule, setInfoSchedule] = useState({
    weekStart: "",
    weekEnd: "",
  });

  const [salaSelecionada, setSalaSelecionada] = useState("");

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const formatInput = (value) => {
    let text = value.replace(/[^0-9]/g, "");
    if (text.length > 4) {
      text = text.substring(0, 4) + "-" + text.substring(4);
    }
    if (text.length > 7) {
      text = text.substring(0, 7) + "-" + text.substring(7);
    }
    return text;
  };

  const abrirModalConsulta = async (item) => {
    try {
      await SecureStore.setItemAsync("salaSelecionada", item.number);
      setSalaSelecionada(item.number);
      setModalConsulta(true);
    } catch (error) {
      console.log("Erro ao salvar salaSelecionada:", error);
    }
  };

  const carregarSalaSelecionada = async () => {
    try {
      const sala = await SecureStore.getItemAsync("salaSelecionada");
      if (sala) {
        setSalaSelecionada(sala);
      }
    } catch (error) {
      console.log("Erro ao carregar salaSelecionada:", error);
    }
  };

  useEffect(() => {
    getSalas();
    carregarSalaSelecionada();
  }, []);

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.classrooms);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data?.error || error.message);
    }
  }

  async function ConsultarReservas() {
    try {
      const sala = await SecureStore.getItemAsync("salaSelecionada");
      if (!sala) {
        Alert.alert("Selecione uma sala antes.");
        return;
      }

      const response = await api.postConsulta({
        weekStart: infoSchedule.weekStart,
        weekEnd: infoSchedule.weekEnd,
        classroomID: sala,
      });

      setIdSala(response.data.available);
      setModalDisponivel(true);
    } catch (error) {
      Alert.alert(
        error.response?.data?.error || "Erro ao consultar disponibilidade."
      );
    }
  }

  return (
    <View style={styles.containerFlex}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Salas Disponíveis:
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff0000" />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <View style={styles.listagem}>
              <Text>Número: {item.number}</Text>
              <Text>Capacidade: {item.capacity}</Text>
              <Text>Descrição: {item.description}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => abrirModalConsulta(item)}
              >
                <Text>Conferir Disponibilidade</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de Consulta */}
      <Modal
        visible={modalConsulta}
        onRequestClose={() => setModalConsulta(false)}
        animationType="slide"
      >
        <View style={styles.modalCons}>
          <Text style={{ margin: 10, fontSize: 18 }}>
            Consultar Disponibilidade
          </Text>
          <Text>Selecione os dias para consultar:</Text>

          <TextInput
            style={styles.inputData}
            placeholder="Data inicial (Segunda-feira)"
            placeholderTextColor="#000000"
            value={infoSchedule.weekStart}
            onChangeText={(value) => {
              const text = formatInput(value);
              setInfoSchedule({ ...infoSchedule, weekStart: text });
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          <TextInput
            style={styles.inputData}
            placeholder="Data final (Domingo)"
            placeholderTextColor="#000000"
            value={infoSchedule.weekEnd}
            onChangeText={(value) => {
              const text = formatInput(value);
              setInfoSchedule({ ...infoSchedule, weekEnd: text });
            }}
            keyboardType="numeric"
            maxLength={10}
          />

          <View style={styles.botoesLayout}>
            <TouchableOpacity
              style={styles.buttonColor1}
              onPress={() => setModalConsulta(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonColor2}
              onPress={() => ConsultarReservas()}
            >
              <Text style={{ color: "white" }}>Consultar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Disponibilidade */}
      <Modal
        visible={modalDisponivel}
        onRequestClose={() => setModalDisponivel(false)}
        animationType="fade"
      >
        {!idSala ? (
          <Text>Carregando...</Text>
        ) : (
          <View style={styles.modalCons}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Horários Disponíveis:
            </Text>
            <ScrollView>
              {diasSemana.map((dia) => (
                <Text key={dia} style={{ marginBottom: 10 }}>
                  {dia}: {idSala[dia]?.join(", ") || "Sem horários"}
                </Text>
              ))}
            </ScrollView>

            <Text style={{ marginVertical: 10 }}>
              Sala selecionada: {salaSelecionada}
            </Text>

            <TouchableOpacity
              style={styles.buttonColor2}
              onPress={() => {
                navigation.navigate("Reservar");
              }}
            >
              <Text style={{ color: "white" }}>Reservar Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonColor1}
              onPress={() => setModalDisponivel(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
  botao: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDDDDD",
    width: "100%",
    marginTop: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000000",
    padding: 5,
  },
  modalCons: {
    display: "flex",
    borderRadius: 10,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  inputData: {
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    margin: 10,
    width: "70%",
    padding: 8,
    borderColor: "#000000",
    borderWidth: 1,
  },
  buttonColor1: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 5,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonColor2: {
    backgroundColor: "#215299",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
  },
  botoesLayout: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    margin: 10,
  },
});
