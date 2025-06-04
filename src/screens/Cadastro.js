import React, { useState } from "react";
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
import * as SecureStore from "expo-secure-store";

export default function Cadastro({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    password2: "",
    showPassword: true,
    showPassword2: true,
  });
  const [focusedInput, setFocusedInput] = useState(null);

  async function saveToken(token) {
    await SecureStore.setItemAsync("token", token);
    console.log(token)
  }
  async function saveCpf(cpf) {
    await SecureStore.setItemAsync("userId", cpf);
    console.log(cpf)
  }

  async function handleCadastro() {
    await api.postCadastro(user).then(
      (response) => {
        Alert.alert(response.data.message);
        saveToken(response.data.token)
        saveCpf(user.cpf)
        navigation.navigate("ListaReserva", user.cpf);
      },
      (error) => {
        Alert.alert(error.response.data.error);
      }
    );
  }

  return (
    <View>
      <Image
        source={require("../../assets/logo_senai.png")}
        style={styles.logo}
      />

      <View style={styles.ViewInputs}>
        <Text style={styles.Text}>Cadastre-se</Text>

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
              // Filtra apenas letras, números, ponto e arroba
              //Remove qualquer caractere que não seja letra, número, ponto ou arroba.
              //g no final significa "global"
              const filteredValue = value.replace(/[^a-zA-Z0-9.@]/g, "");
              setUser({ ...user, email: filteredValue });
            }}
            style={styles.input}
            placeholderTextColor="#000000"
            keyboardType="email-address" // Incluir @ e . no teclado para facilitar a digitação
            maxLength={255} // Limita a entrada a 255 caracteres
            autoCapitalize="none" // Evita letras maiúsculas automáticas
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.Container,
            { borderColor: focusedInput === "cpf" ? "#af2e2e" : "#000000" },
          ]}
        >
          <TextInput
            placeholder="Digite seu CPF *"
            placeholderTextColor="#000000"
            value={user.cpf}
            onChangeText={(value) => {
              // Filtra apenas números e limita a 11 caracteres
              const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
              setUser({ ...user, cpf: numericValue });
            }}
            style={styles.input}
            keyboardType="numeric" // Exibe o teclado numérico
            maxLength={11} // Limita a entrada a 11 caracteres
            onFocus={() => setFocusedInput("cpf")}
            onBlur={() => setFocusedInput(null)}
          />
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
            placeholder="Digite sua senha"
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
            style={styles.inputPassword}
            secureTextEntry={user.showPassword} //A senha não ficar visível a menos que ele clique no icon
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
            placeholder="Confirme sua senha"
            value={user.password2}
            onChangeText={(value) => setUser({ ...user, password2: value })}
            style={styles.inputPassword}
            secureTextEntry={user.showPassword2} //A senha não ficar visível a menos que ele clique no icon
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
          onPress={() => navigation.navigate("Login")}
          style={styles.buttonColor1}
        >
          <Text style={styles.TextNavigate1}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCadastro} style={styles.buttonColor2}>
          <Text style={styles.TextNavigate2}>Criar Conta</Text>
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
