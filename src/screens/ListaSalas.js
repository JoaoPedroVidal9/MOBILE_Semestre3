import { useEffect, useState } from "react";
import api from "../axios/axios";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Box,
} from "react-native";
export default function ListaSalas() {
  const [salas, setSalas] = useState([]);
  const [infoSchedule, setInfoSchedule] = useState({
    weekStart: "1990-01-01",
    weekEnd: "1990-01-01",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatInput = (text) => {
    // Remove qualquer caractere não numérico
    let value = text.replace(/\D/g, "");

    // Adiciona hífens entre os números
    if (value.length > 4) {
      value = value.substring(0, 4) + "-" + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + "-" + value.substring(7);
    }

    // Atualiza o valor do input
    setInputValue(value);
  };

  useEffect(() => {
    getSalas();
    console.log(salas + " salas");
  });

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.classrooms);
      setLoading(false);
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  return (
    <View>
      <Text>
        Salas Disponíveis
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff0000" />
      ) : (
        <FlatList
          data={salas}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <Box>
              <Text>Número: </Text>
              <Text>{item.number}</Text>
              <Text>Capacidade: </Text>
              <Text>{item.capacity}</Text>
              <Text>Descrição: </Text>
              <Text>{item.description}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                Conferir Disponibilidade
              </TouchableOpacity>
            </Box>
          )}
        />
      )}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
              setInfoSchedule({ ...infoSchedule, value: weekStart });
            }}
            keyboardType="numeric"
            maxLength={10}
            onFocus={() => setFocusedInput("weekStart")}
            onBlur={() => setFocusedInput(null)}
          />
          <TextInput
            placeholder="Digite o ultimo dia da semana (um Sábado): *"
            placeholderTextColor="#000000"
            value={infoSchedule.weekEnd}
            onChangeText={(value) => {
              setInfoSchedule({ ...infoSchedule, value: weekEnd });
            }}
            keyboardType="numeric"
            maxLength={10}
            onFocus={() => setFocusedInput("weekEnd")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
          >Fechar</TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
