import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../axios/axios";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Reservar({ navigation, route }) {
  const salaSelecionada = route.params.salaSelecionada;

  // Estado para armazenar o userId no componente
  const [userId, setUserId] = useState(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Seg", value: "Seg" },
    { label: "Ter", value: "Ter" },
    { label: "Qua", value: "Qua" },
    { label: "Qui", value: "Qui" },
    { label: "Sex", value: "Sex" },
    { label: "Sab", value: "Sab" },
  ]);

  // Estado para a reserva
  const [schedule, setSchedule] = useState({
    user: userId,
    dateStart: "",
    dateEnd: "",
    days: "",
    classroom: salaSelecionada,
    timeStart: "",
    timeEnd: "",
  });
  const [focusedInput, setFocusedInput] = useState(null);

  const formatInputData = (value) => {
    let text = value.replace(/[^0-9]/g, "");
    if (text.length > 4) {
      text = text.substring(0, 4) + "-" + text.substring(4);
    }
    if (text.length > 7) {
      text = text.substring(0, 7) + "-" + text.substring(7);
    }
    return text;
  };

  const formatInputHora = (value) => {
    let text = value.replace(/[^0-9]/g, "");
    if (text.length > 2) {
      text = text.substring(0, 2) + ":" + text.substring(2);
    }
    return text;
  };

  // Usando useEffect para buscar o userId do AsyncStorage
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId !== null) {
          setUserId(storedUserId); // Atualiza o userId no estado
        } else {
          console.log("Nenhum userId encontrado");
        }
      } catch (error) {
        console.error("Erro ao recuperar o userId do AsyncStorage:", error);
      }
    };

    getUserId(); // Chama a função para recuperar o userId
  }, []); // O array vazio garante que a função seja chamada apenas uma vez na montagem

  // Atualiza o estado 'schedule' quando o 'userId' for recuperado
  useEffect(() => {
    if (userId) {
      setSchedule((prev) => ({
        ...prev,
        user: userId,
      }));
    }
  }, [userId]); // Esse efeito roda sempre que o 'userId' mudar

  useEffect(() => {
    setSchedule((prev) => ({
      ...prev,
      days: value,
    }));
  }, [value]);

  async function handleReserva() {
    await api.postReserva(schedule).then(
      (response) => {
        Alert.alert(response.data.message);
        navigation.navigate("ListaReserva", { userId });
      },
      (error) => {
        Alert.alert(error.response.data.error);
      }
    );
  }

  return (
    <View>
      <View style={styles.ViewInputs}>
        <Text style={styles.Text}>Faça sua reserva:</Text>

        <View
          style={{
            borderColor: focusedInput === "days" ? "#af2e2e" : "#000000",
            marginBottom: "20",
            color: "#000000",
            fontSize: 12,
            width: "100%",
            marginRight: "10",
          }}
        >
          <DropDownPicker
            style={styles.input}
            multiple={true}
            min={1}
            max={6}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Escolha os dias da semana"
          />
        </View>

        <View
          style={[
            styles.Container,
            {
              borderColor: focusedInput === "dateStart" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite a data de inicio"
            value={schedule.dateStart}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => {
              const text = formatInputData(value);
              setSchedule({ ...schedule, dateStart: text });
            }}
            onFocus={() => setFocusedInput("dateStart")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View
          style={[
            styles.Container,
            {
              borderColor: focusedInput === "dateEnd" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite a data de fim"
            value={schedule.dateEnd}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => {
              const text = formatInputData(value);
              setSchedule({ ...schedule, dateEnd: text });
            }}
            onFocus={() => setFocusedInput("dateEnd")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        <View
          style={[
            styles.Container,
            {
              borderColor: focusedInput === "timeStart" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite a hora de inicio"
            value={schedule.timeStart}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => {
              const text = formatInputHora(value);
              setSchedule({ ...schedule, timeStart: text });
            }}
            onFocus={() => setFocusedInput("timeStart")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View
          style={[
            styles.Container,
            {
              borderColor: focusedInput === "timeEnd" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite a hora de fim"
            value={schedule.timeEnd}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => {
              const text = formatInputHora(value);
              setSchedule({ ...schedule, timeEnd: text });
            }}
            onFocus={() => setFocusedInput("timeEnd")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.viewNavigate}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ListaSalas", { userId })}
          style={styles.buttonColor1}
        >
          <Text style={styles.TextNavigate1}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReserva} style={styles.buttonColor2}>
          <Text style={styles.TextNavigate2}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: -70,
    marginTop: -50,
  },
  ViewInputs: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  Text: {
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 15,
  },
  Container: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1, //Espessura da borda
    padding: 8,
    borderRadius: 10,
  },
  input: {
    color: "#000000",
    fontSize: 12,
    width: "100%",
  },
  viewNavigate: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  buttonColor1: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderColor: "#00000",
    borderWidth: 1,
    borderRadius: 5,
  },
  TextNavigate1: {
    color: "#215299",
  },
  buttonColor2: {
    backgroundColor: "#215299",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  TextNavigate2: {
    color: "#FFFFFF",
  },
});
