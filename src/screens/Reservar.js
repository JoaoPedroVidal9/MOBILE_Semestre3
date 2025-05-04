import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import api from "../axios/axios";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Reservar() {
  const navigation = useNavigation();
  const route = useRoute();
  const salaSelecionada = route.params;

  const [schedule, setSchedule] = useState({
    user: "",
    dateStart: "",
    dateEnd: "",
    days: "",
    classroom: salaSelecionada,
    timeStart: "",
    timeEnd: "",
  });
  const [focusedInput, setFocusedInput] = useState(null);

  async function handleReserva() {
    await api.postReserva(schedule).then(
      (response) => {
        console.log(response.data.message);
        Alert.alert(response.data.message);
        navigation.navigate("ListaSalas");
      },
      (error) => {
        console.log(error);
        Alert.alert(error.response.data.error);
      }
    );
  }

  return (
    <View>
      <View style={styles.ViewInputs}>
        <Text style={styles.Text}>Faça sua reserva:</Text>

        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "name" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Digite seu codigo de usuário"
            value={schedule.user}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => setSchedule({ ...schedule, user: value })}
            onFocus={() => setFocusedInput("user")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "days" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Selecione os dias da semana"
            value={schedule.days}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) => setSchedule({ ...schedule, days: value })}
            onFocus={() => setFocusedInput("days")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.Container,
            {
              borderColor: focusedInput === "classroom" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite a sala a reservar"
            value={schedule.classroom}
            style={styles.input}
            placeholderTextColor="#000000"
            onChangeText={(value) =>
              setSchedule({ ...schedule, classroom: value })
            }
            onFocus={() => setFocusedInput("classroom")}
            onBlur={() => setFocusedInput(null)}
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
            onChangeText={(value) =>
              setSchedule({ ...schedule, dateStart: value })
            }
            onFocus={() => setFocusedInput("dateStart")}
            onBlur={() => setFocusedInput(null)}
          />
          {/* const { dateEnd, classroom, timeStart, timeEnd } = req.body; */}
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
            onChangeText={(value) =>
              setSchedule({ ...schedule, dateEnd: value })
            }
            onFocus={() => setFocusedInput("dateEnd")}
            onBlur={() => setFocusedInput(null)}
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
            onChangeText={(value) =>
              setSchedule({ ...schedule, timeStart: value })
            }
            onFocus={() => setFocusedInput("timeStart")}
            onBlur={() => setFocusedInput(null)}
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
            onChangeText={(value) =>
              setSchedule({ ...schedule, timeEnd: value })
            }
            onFocus={() => setFocusedInput("timeEnd")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.viewNavigate}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ListaSalas")}
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
    padding: 12,
    borderRadius: 10,
  },
  input: {
    color: "#000000",
    fontSize: 16,
    width: "100%",
  },
  Container2: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1, //Espessura da borda
    paddingLeft: 12,
    padding: 5,
    borderRadius: 10,
  },
  inputPassword: {
    color: "#000000",
    fontSize: 16,
    width: "90%",
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
