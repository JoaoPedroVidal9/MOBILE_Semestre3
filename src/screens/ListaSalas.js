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
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const formatDate = (date) => date.toISOString().slice(0, 10);

  const openDatePicker = (pickerType) => {
    setCurrentPicker(pickerType);
    let dateToSet = new Date();
    if (pickerType === "start" && infoSchedule.weekStart) {
      const parsed = new Date(infoSchedule.weekStart);
      if (!isNaN(parsed)) dateToSet = parsed;
    } else if (pickerType === "end" && infoSchedule.weekEnd) {
      const parsed = new Date(infoSchedule.weekEnd);
      if (!isNaN(parsed)) dateToSet = parsed;
    }
    setTempDate(dateToSet);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || tempDate;
    setShowDatePicker(Platform.OS === "ios");
    const formatted = formatDate(currentDate);
    if (currentPicker === "start") {
      setInfoSchedule((prev) => ({ ...prev, weekStart: formatted }));
    } else if (currentPicker === "end") {
      setInfoSchedule((prev) => ({ ...prev, weekEnd: formatted }));
    }
  };

  async function setarSala(salaSelecionada) {
    await SecureStore.setItemAsync("salaSelecionada", salaSelecionada);
  }

  const abrirModalConsulta = async (item) => {
    try {
      setarSala(item.number);
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
      console.log(error.response.data.error);
      setLoading(false);
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
        error.response.data.error
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salas Disponíveis</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#215299" />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.number.toString()}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sala {item.number}</Text>
              <Text style={styles.cardText}>Capacidade: {item.capacity}</Text>
              <Text style={styles.cardText}>Descrição: {item.description}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => abrirModalConsulta(item)}
              >
                <Text style={styles.buttonText}>Conferir Disponibilidade</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de Consulta */}
      <Modal
        visible={modalConsulta}
        transparent
        animationType="slide"
        onRequestClose={() => setModalConsulta(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Consultar Disponibilidade</Text>

            <Text style={styles.label}>Selecione os dias para consultar:</Text>

            <TextInput
              style={styles.input}
              placeholder="Data inicial (Segunda-feira)"
              placeholderTextColor="#999"
              value={infoSchedule.weekStart}
              onFocus={() => openDatePicker("start")}
              showSoftInputOnFocus={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Data final (Domingo)"
              placeholderTextColor="#999"
              value={infoSchedule.weekEnd}
              onFocus={() => openDatePicker("end")}
              showSoftInputOnFocus={false}
            />

            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
                maximumDate={new Date(2100, 11, 31)}
                minimumDate={new Date(2025, 0, 1)}
              />
            )}

            <View style={styles.buttonsRowModalConsulta}>
              <TouchableOpacity
                style={styles.buttonOutlineModal}
                onPress={() => setModalConsulta(false)}
              >
                <Text style={styles.buttonOutlineText}>Fechar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonModal}
                onPress={ConsultarReservas}
              >
                <Text style={styles.buttonTextModal}>Consultar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Disponibilidade */}
      <Modal
        visible={modalDisponivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalDisponivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Horários Disponíveis</Text>

            {!idSala ? (
              <ActivityIndicator size="large" color="#215299" />
            ) : (
              <ScrollView style={{ maxHeight: 300, width: "100%" }}>
                {diasSemana.map((dia) => (
                  <View key={dia} style={{ marginBottom: 15 }}>
                    <Text style={styles.dayTitle}>{dia}:</Text>
                    <View style={styles.badgeContainer}>
                      {idSala?.[dia]?.length > 0 ? (
                        idSala[dia].map((horario, index) => (
                          <View key={index} style={styles.badge}>
                            <Text style={styles.badgeText}>{horario}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noAvailability}>
                          Sem horários disponíveis
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <Text style={styles.selectedRoom}>
              Sala selecionada: {salaSelecionada}
            </Text>

            <View style={styles.buttonsRowModalDisponivel}>
              <TouchableOpacity
                style={styles.buttonModal}
                onPress={() => navigation.navigate("Reservar")}
              >
                <Text style={styles.buttonTextModal}>Reservar Agora</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonOutlineModal}
                onPress={() => setModalDisponivel(false)}
              >
                <Text style={styles.buttonOutlineText}>Fechar</Text>
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
    backgroundColor: "#F5F7FA",
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#215299",
    alignSelf: "center",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#215299",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#215299",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  // Estilos para botões nos modais
  buttonsRowModalConsulta: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  buttonModal: {
    backgroundColor: "#215299",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonTextModal: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineModal: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#215299",
    alignItems: "center",
    marginRight: 10,
  },
  buttonOutlineText: {
    color: "#215299",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonsRowModalDisponivel: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 25,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 25,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#215299",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#215299",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 14,
    fontSize: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 15,
  },
  dayTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#215299",
    marginBottom: 6,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#215299",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  noAvailability: {
    fontStyle: "italic",
    color: "#999",
  },
  selectedRoom: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    alignSelf: "flex-start",
  },
});
