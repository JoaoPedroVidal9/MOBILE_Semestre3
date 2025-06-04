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
import * as SecureStore from "expo-secure-store"

export default function AtualizarUsuario({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    password2:"",
    oldPassword:"",
    showPassword: true,
    showPassword2: true,
    showPassword3: true,
  });

  const [currentCpf, setCurrentCpf] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const cpf = await SecureStore.getItemAsync("userId");
      const token = await SecureStore.getItemAsync("authorization")
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
              borderColor: focusedInput === "oldPassword" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Digite sua senha atual"
            value={user.oldPassword}
            onChangeText={(value) => setUser({ ...user, oldPassword: value })}
            style={styles.inputPassword}
            secureTextEntry={user.showPassword3}
            placeholderTextColor="#000000"
            maxLength={50}
            onFocus={() => setFocusedInput("oldPassword")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword3: !user.showPassword3 })
            }
          >
            <Ionicons
              name={user.showPassword3 ? "eye-off" : "eye"}
              size={34}
              color="#808080"
            />
          </TouchableOpacity>
        </View>

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

        <View
          style={[
            styles.Container2,
            {
              borderColor: focusedInput === "password2" ? "#af2e2e" : "#000000",
            },
          ]}
        >
          <TextInput
            placeholder="Confirme a sua nova senha"
            value={user.password2}
            onChangeText={(value) => setUser({ ...user, password2: value })}
            style={styles.inputPassword}
            secureTextEntry={user.showPassword2}
            placeholderTextColor="#000000"
            maxLength={50}
            onFocus={() => setFocusedInput("password2")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword2: !user.showPassword2 })
            }
          >
            <Ionicons
              name={user.showPassword2 ? "eye-off" : "eye"}
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
  ViewInputs: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  Text: {
    fontSize: 26,
    fontWeight: "700",
    color: "#215299",
    marginBottom: 20,
    alignSelf: "center",
  },
  Container: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
  },
  input: {
    color: "#333",
    fontSize: 16,
    width: "100%",
  },
  Container2: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
  },
  inputPassword: {
    color: "#333",
    fontSize: 16,
    width: "90%",
  },
  viewNavigate: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
    marginTop: 25,
  },
  buttonColor1: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: "#215299",
    borderWidth: 1.5,
    borderRadius: 8,
  },
  TextNavigate1: {
    color: "#215299",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonColor2: {
    backgroundColor: "#215299",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#215299",
  },
  TextNavigate2: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

