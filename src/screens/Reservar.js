import React, { useState, useEffect } from "react"; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import api from "../axios/axios";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Reservar({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [listClassroom, setListClassroom] = useState([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([]);

  // Estados para DateTimePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [currentField, setCurrentField] = useState(null);

  const [schedule, setSchedule] = useState({
    user: userId,
    dateStart: "",
    dateEnd: "",
    days: [],
    daysWeek: [],
    classroom: salaSelecionada,
    timeStart: "",
    timeEnd: "",
  });

  // Função para formatar data YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  // Função para formatar hora HH:mm
  const formatTime = (date) => {
    const d = new Date(date);
    const hours = `${d.getHours()}`.padStart(2, "0");
    const minutes = `${d.getMinutes()}`.padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        const storedSala = await SecureStore.getItemAsync("salaSelecionada");

        if (storedUserId) {
          setUserId(storedUserId);
        }

        if (storedSala) {
          setSalaSelecionada(storedSala);
        }
      } catch (error) {
        console.error("Erro ao recuperar dados do SecureStore:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      setSchedule((prev) => ({ ...prev, user: userId }));
    }
  }, [userId]);

  useEffect(() => {
    if (salaSelecionada) {
      setSchedule((prev) => ({ ...prev, classroom: salaSelecionada }));
    }
  }, [salaSelecionada]);

  useEffect(() => {
    if (schedule.dateStart && schedule.dateEnd) {
      postDaysForSchedule();
    }
  }, [schedule.dateStart, schedule.dateEnd]);

  useEffect(() => {
    setSchedule((prev) => ({ ...prev, days: value }));
  }, [value]);

  async function postDaysForSchedule() {
    try {
      const response = await api.postDaysWeekSchedule({
        dateStart: schedule.dateStart,
        dateEnd: schedule.dateEnd
      });
      
      setSchedule((prev) => ({
        ...prev,
        daysWeek: response.data.days
      }));
      
      // Atualiza os itens do dropdown
      setItems(response.data.days.map(day => ({
        label: day,
        value: day
      })));
      
    } catch (error) {
      console.log("Erro", error);
      Alert.alert(error.response.data.error);
    }
  }

  // Quando fecha o picker, atualiza o valor no campo correto
  const onChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "dismissed") return;

    if (selectedDate) {
      if (currentField === "dateStart" || currentField === "dateEnd") {
        const formatted = formatDate(selectedDate);
        setSchedule((prev) => ({ ...prev, [currentField]: formatted }));
      } else if (currentField === "timeStart" || currentField === "timeEnd") {
        const formatted = formatTime(selectedDate);
        setSchedule((prev) => ({ ...prev, [currentField]: formatted }));
      }
    }
  };

  // Abre o DateTimePicker no modo correto para o campo clicado
  const showPicker = (field) => {
    if (field === "dateStart" || field === "dateEnd") {
      setDatePickerMode("date");
    } else {
      setDatePickerMode("time");
    }
    setCurrentField(field);
    setShowDatePicker(true);
  };

  async function handleReserva() {
    try {
      const response = await api.postReserva(schedule);
      Alert.alert(response.data.message);
      navigation.navigate("ListaReserva", { userId });
    } catch (error) {
      Alert.alert(error.response.data.error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça sua reserva:</Text>

      <TouchableOpacity
        style={styles.inputTouchable}
        onPress={() => showPicker("dateStart")}
      >
        <TextInput
          style={styles.input}
          placeholder="Data de início"
          value={schedule.dateStart}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputTouchable}
        onPress={() => showPicker("dateEnd")}
      >
        <TextInput
          style={styles.input}
          placeholder="Data de fim"
          value={schedule.dateEnd}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          multiple={true}
          min={1}
          max={6}
          placeholder="Escolha os dias da semana"
          mode="BADGE"
          badgeColors="#215299"
          badgeTextStyle={{ color: "#fff", fontWeight: "bold" }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainerStyle}
          disabled={items.length === 0}
        />
      </View>

      <TouchableOpacity
        style={styles.inputTouchable}
        onPress={() => showPicker("timeStart")}
      >
        <TextInput
          style={styles.input}
          placeholder="Hora de início"
          value={schedule.timeStart}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.inputTouchable}
        onPress={() => showPicker("timeEnd")}
      >
        <TextInput
          style={styles.input}
          placeholder="Hora de fim"
          value={schedule.timeEnd}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode={datePickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          minimumDate={new Date()}
          maximumDate={new Date(2030, 11, 31)}
        />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonCancel}
        >
          <Text style={styles.buttonCancelText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReserva} style={styles.buttonConfirm}>
          <Text style={styles.buttonConfirmText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F7FA",
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    color: "#215299",
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#215299",
    backgroundColor: "#fff",
  },
  dropdownContainerStyle: {
    borderColor: "#215299",
  },
  inputTouchable: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#215299",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: "#fff",
    borderColor: "#215299",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  buttonCancelText: {
    color: "#215299",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonConfirm: {
    backgroundColor: "#215299",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonConfirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});