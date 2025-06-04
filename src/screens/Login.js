import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';

export default function Login({ navigation }) {
  const [user, setUser] = useState({
    cpf: '',
    password: '',
    showPassword: true
  });

  const [focusedInput, setFocusedInput] = useState(null);

  async function saveToken(token){
    await SecureStore.setItemAsync("token",token);
  }
  async function saveCpf(cpf){
    await SecureStore.setItemAsync("userId", cpf);
  }
  
  async function handleLogin() {
    await api.postLogin(user)
      .then(
        (response) => {
          Alert.alert(response.data.message);
          saveToken(response.data.token);
          saveCpf(user.cpf);
          navigation.navigate("Home", user.cpf);
        },
        (error) => {
          Alert.alert(error.response.data.error);
        }
      );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />

      <Text style={styles.welcomeText}>
        Seja bem-vindo(a). Faça o login para acessar a agenda SENAI ou cadastre-se como novo usuário.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Usuário</Text>
        <View style={[
          styles.inputContainer,
          { borderColor: focusedInput === "cpf" ? "#215299" : "#ccc" }
        ]}>
          <TextInput
            placeholder="Digite seu CPF *"
            placeholderTextColor="#999"
            value={user.cpf}
            onChangeText={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
              setUser({ ...user, cpf: numericValue });
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={11}
            onFocus={() => setFocusedInput("cpf")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View style={[
          styles.inputContainer,
          styles.passwordContainer,
          { borderColor: focusedInput === "password" ? "#215299" : "#ccc" }
        ]}>
          <TextInput
            placeholder="Digite sua senha *"
            placeholderTextColor="#999"
            maxLength={50}
            secureTextEntry={user.showPassword}
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
            style={styles.input}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity onPress={() => setUser({ ...user, showPassword: !user.showPassword })} style={styles.eyeIcon}>
            <Ionicons name={user.showPassword ? "eye-off" : "eye"} size={24} color="#808080" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não possui conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.footerLink}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logo: {
    width: 250,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#215299",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  passwordContainer: {
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#215299",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#555",
    fontSize: 16,
  },
  footerLink: {
    color: "#215299",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
});
