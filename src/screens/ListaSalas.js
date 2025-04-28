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
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  
  const formatInput = (text) => {
    // Remove qualquer caractere não numérico
    let value = text.replace(/\D/g, '');

    // Adiciona hífens entre os números
    if (value.length > 4) {
      value = value.substring(0, 4) + '-' + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + '-' + value.substring(7);
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
      <Text
      // style={styles.title}
      >
        Salas Disponíveis
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#BECE18" />
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
            placeholder="Digite o dia da Segunda-Feira *"
            placeholderTextColor="#000000"
            value={dates.segunda}
            onChangeText={(value) => {
              setUser({ ...dates, value: numericValue });
            }}
            style={styles.input}
            keyboardType="numeric" // Exibe o teclado numérico
            maxLength={11} // Limita a entrada a 11 caracteres
            onFocus={() => setFocusedInput("cpf")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </Modal>
    </View>
  );
}
