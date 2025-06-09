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
  }
  async function saveCpf(cpf) {
    await SecureStore.setItemAsync("userId", cpf);
  }

  async function handleCadastro() {
    await api.postCadastro(user).then(
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
      <Image
        source={require("../../assets/logo_senai.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Cadastre-se</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome</Text>
        <View
          style={[
            styles.inputContainer,
            { borderColor: focusedInput === "name" ? "#215299" : "#ccc" },
          ]}
        >
          <TextInput
            placeholder="Digite seu nome"
            value={user.name}
            onChangeText={(value) => setUser({ ...user, name: value })}
            style={styles.input}
            placeholderTextColor="#999"
            maxLength={255}
            onFocus={() => setFocusedInput("name")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-mail</Text>
        <View
          style={[
            styles.inputContainer,
            { borderColor: focusedInput === "email" ? "#215299" : "#ccc" },
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
            placeholderTextColor="#999"
            keyboardType="email-address"
            maxLength={255}
            autoCapitalize="none"
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>CPF</Text>
        <View
          style={[
            styles.inputContainer,
            { borderColor: focusedInput === "cpf" ? "#215299" : "#ccc" },
          ]}
        >
          <TextInput
            placeholder="Digite seu CPF *"
            placeholderTextColor="#999"
            value={user.cpf}
            onChangeText={(value) => {
              const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
              setUser({ ...user, cpf: numericValue });
            }}
            style={styles.input}
            keyboardType="numeric"
            maxLength={11}
            onFocus={() => setFocusedInput("cpf")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View
          style={[
            styles.inputContainer,
            styles.passwordContainer,
            { borderColor: focusedInput === "password" ? "#215299" : "#ccc" },
          ]}
        >
          <TextInput
            placeholder="Digite sua senha"
            value={user.password}
            onChangeText={(value) => setUser({ ...user, password: value })}
            style={styles.input}
            secureTextEntry={user.showPassword}
            placeholderTextColor="#999"
            maxLength={50}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword: !user.showPassword })
            }
            style={styles.eyeIcon}
          >
            <Ionicons
              name={user.showPassword ? "eye-off" : "eye"}
              size={24}
              color="#808080"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirme a senha</Text>
        <View
          style={[
            styles.inputContainer,
            styles.passwordContainer,
            {
              borderColor:
                focusedInput === "password2" ? "#215299" : "#ccc",
            },
          ]}
        >
          <TextInput
            placeholder="Confirme sua senha"
            value={user.password2}
            onChangeText={(value) => setUser({ ...user, password2: value })}
            style={styles.input}
            secureTextEntry={user.showPassword2}
            placeholderTextColor="#999"
            maxLength={50}
            onFocus={() => setFocusedInput("password2")}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword2: !user.showPassword2 })
            }
            style={styles.eyeIcon}
          >
            <Ionicons
              name={user.showPassword2 ? "eye-off" : "eye"}
              size={24}
              color="#808080"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.buttonBack}
        >
          <Text style={styles.buttonBackText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCadastro} style={styles.buttonCreate}>
          <Text style={styles.buttonCreateText}>Criar Conta</Text>
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
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#215299",
    textAlign: "center",
    marginBottom: 35,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#215299",
    marginBottom: 6,
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  buttonBack: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#215299",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonBackText: {
    color: "#215299",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonCreate: {
    backgroundColor: "#215299",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonCreateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
