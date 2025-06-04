import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AtualizarUsuario({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    showPassword: true,
  });

  const [currentCpf, setCurrentCpf] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const cpf = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("authorization")
      console.log("CPF carregado:", cpf);
      console.log(token)
      setUser((prev) => ({ ...prev, cpf: cpf }));
      setCurrentCpf(cpf);
    }
    loadUser();
  }, []);


  
  async function handleAtualizar() {
    await api.putAtualizarUsuario(currentCpf, user)
        .then(
            (response) => {
                Alert.alert(response.data.message);
                if (currentCpf !== user.cpf) {
                    AsyncStorage.setItem("userId", user.cpf);
                    setCurrentCpf(user.cpf);
                }
            },
            (error) => {
                Alert.alert(error.response.data.error);
            }
        );
}

  return (
    <View>
      <View style={styles.ViewInputs}>
        <Text style={styles.Text}>Atualizar Dados</Text>

        {/* Nome */}
        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "name" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Digite seu nome"
            value={user.name}
            onChangeText={(value) => setUser({ ...user, name: value })}
            style={styles.input}
            placeholderTextColor="#000000"
            maxLength={255}
            onFocus={() => setFocusedInput("name")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Email */}
        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "email" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Digite seu e-mail"
            value={user.email}
            onChangeText={(value) => {
              const filteredValue = value.replace(/[^a-zA-Z0-9.@]/g, "");
              setUser({ ...user, email: filteredValue });
            }}
            style={styles.input}
            placeholderTextColor="#000000"
            keyboardType="email-address"
            maxLength={255}
            autoCapitalize="none"
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* CPF */}
        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "cpf" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Digite seu CPF"
            value={user.cpf}
            onChangeText={(value) =>
              setUser({ ...user, cpf: value.replace(/[^0-9]/g, "") })
            }
            style={styles.input}
            placeholderTextColor="#000000"
            maxLength={11}
            keyboardType="numeric"
            onFocus={() => setFocusedInput("cpf")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Senha */}
        <View
          style={[
            styles.Container2,
            {
              borderColor: focusedInput === "password" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite sua nova senha"
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
            style={styles.inputPassword}
            secureTextEntry={user.showPassword}
            placeholderTextColor="#000000"
            maxLength={50}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword: !user.showPassword })
            }
          >
            <Ionicons
              name={user.showPassword ? "eye-off" : "eye"}
              size={34}
              color="#808080"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.viewNavigate}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonColor1}
        >
          <Text style={styles.TextNavigate1}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAtualizar} style={styles.buttonColor2}>
          <Text style={styles.TextNavigate2}>Salvar</Text>
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
    borderWidth: 1,
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
    borderWidth: 1,
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
