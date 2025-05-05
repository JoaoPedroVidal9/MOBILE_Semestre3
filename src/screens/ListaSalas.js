import { useEffect, useState } from "react";
import api from "../axios/axios";
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
  ScrollView
} from "react-native";

export default function ListaSalas({ navigation, route }) {
  const [rota, setRota] = useState({
    'userId':route.params,
    'salaSelecionada': "",
  })

  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalConsulta, setModalConsulta] = useState(false);
  const [modalDisponivel, setModalDisponivel] = useState(false);

  const [idSala, setIdSala] = useState();
  const [infoSchedule, setInfoSchedule] = useState({
    weekStart: "",
    weekEnd: "",
  });

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

  const abrirModalConsulta = (item) => {
    setRota({...rota, 'salaSelecionada':item.number});
    setModalConsulta(true);
  };

  useEffect(() => {
    getSalas();
  }, []);

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.classrooms);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error); // Caso não puxe as salas, permanece carregando.
    }
  }
  async function ConsultarReservas() {
    await api
      .postConsulta({
        weekStart: infoSchedule.weekStart,
        weekEnd: infoSchedule.weekEnd,
        classroomID: rota.salaSelecionada,
      })
      .then(
        (response) => {
          setIdSala(response.data.available);
          setModalDisponivel(true);
        },
        (error) => {
          Alert.alert(error.response.data.error);
        }
      );
  }

  return (
    <View style={styles.containerFlex}>
      <Text>Salas Disponíveis:</Text>

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

      <Modal
        visible={modalConsulta}
        onRequestClose={() => setModalConsulta(false)}
        animationType="slide"
      >
        <View style={styles.modalCons}>
          <Text
            style={{
              margin: 10,
            }}
          >
            Consultar Disponibilidade:
          </Text>
          <Text>Selecione os dias para consultar a semana:</Text>
          <TextInput
            style={styles.inputData}
            placeholder="Digite o primeiro dia (Segunda-feira): *"
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
            placeholder="Digite o último dia (Domingo): *"
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
              style={styles.denyBut}
              onPress={() => setModalConsulta(false)}
            >
              <Text>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBut}
              onPress={() => ConsultarReservas()}
            >
              <Text>Consultar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalDisponivel}
        onRequestClose={() => setModalDisponivel(false)}
        animationType="fade"
      >
        {!idSala ? (
          <Text>Espera</Text>
        ) : (
          <View style={styles.modalCons}>
            <Text>Horários Disponíveis:</Text>
            <ScrollView>
              {diasSemana.map((dia) => (
                <Text key={dia} style={{ marginBottom: 10 }}>
                  {dia}: {idSala[dia].join(`, ` )}
                </Text>
              ))}
            </ScrollView>

            <Text>Sala: {rota.salaSelecionada}</Text>
            <TouchableOpacity
              style={styles.confirmBut}
              onPress={()=>{navigation.navigate("Reservar", rota);}}
            >
              <Text>Reserve-a Agora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.denyBut}
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
    backgroundColor: "#AAAAAA",
    borderRadius: 10,
    alignItems: "center",
    height: 100,
    marginBottom: 10,
  },
  botao: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FF6666",
    textAlign: "center",
    borderRadius: 10,
    width: "70%",
  },
  modalCons: {
    display: "flex",
    backgroundColor: "#999999",
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
  },
  confirmBut: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#66FF66",
    width: "40%",
    margin: 10,
    borderRadius: 10,
  },
  denyBut: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FF6666",
    width: "40%",
    margin: 10,
    borderRadius: 10,
  },
  botoesLayout: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    margin: 10,
  },
  viewHorarios: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});
