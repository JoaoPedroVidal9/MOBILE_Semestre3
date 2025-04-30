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
} from "react-native";

export default function ListaSalas({ navigation }) {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);



  const [modalConsulta, setModalConsulta] = useState(false);
  const [modalDisponivel, setModalDisponivel] = useState(false);

  const [infoSchedule, setInfoSchedule] = useState({ weekStart:'1990-01-01', weekEnd:'1990-01-01'});
  const [salaSelecionada, setSalaSelecionada] = useState({});
  const [idSala, setIdSala] = useState("");

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
    setSalaSelecionada(item);
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
      console.log(error.response.data.error);
    }
  }
  async function ConsultarReservas() {
    console.log(salaSelecionada.number,{weekEnd:infoSchedule.weekEnd,weekStart:infoSchedule.weekStart });
    await api.getConsulta(salaSelecionada.number,{weekEnd:infoSchedule.weekEnd,weekStart:infoSchedule.weekStart }).then(
      (response) => {
        console.log(response.data.available);
        setIdSala = response.data.available;
        setModalDisponivel(true);
      },
      (error) => {
        console.log(error.response.data.error);
        Alert.alert(error.response.data.error);
      }
    );
  }

  return (
    <View>
      <Text>Salas Disponíveis:</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff0000" />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>Número: {item.number}</Text>
              <Text>Capacidade: {item.capacity}</Text>
              <Text>Descrição: {item.description}</Text>
              <TouchableOpacity onPress={() => abrirModalConsulta(item)}>
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
        <View>
          <Text>Consultar Disponibilidade:</Text>
          <Text>Selecione os dias para consultar a semana:</Text>
          <TextInput
            placeholder="Digite o primeiro dia da semana (uma Segunda-feira): *"
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
            placeholder="Digite o ultimo dia da semana (um Sábado): *"
            placeholderTextColor="#000000"
            value={infoSchedule.weekEnd}
            onChangeText={(value) => {
              const text = formatInput(value);
              setInfoSchedule({ ...infoSchedule, weekEnd: text });
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          <TouchableOpacity
            style={{ backgroundColor: "green" }}
            onPress={() => ConsultarReservas()}
          >
            <Text>Consultar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "red" }}
            onPress={() => setModalConsulta(false)}
          >
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={modalDisponivel}
        onRequestClose={() => setModalDisponivel(false)}
        animationType="fade"
      >
        <FlatList
          data={idSala}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>Horários Disponíveis:</Text>
              <Text>Segunda-feira: {item.Seg}</Text>
              <Text>Terça-feira: {item.Ter}</Text>
              <Text>Quarta-feira: {item.Qua}</Text>
              <Text>Quinta-feira: {item.Qui}</Text>
              <Text>Sexta-feira: {item.Sex}</Text>
              <Text>Sábado: {item.Sab}</Text>
              <Text>Sala: {salaSelecionada}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Reservar",)
                }
              >
                <Text>Reserve-a Agora</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </Modal>
    </View>
  );
}
