import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

export default function AtualizarUsuario({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
    password2: "",
    oldPassword: "",
    contagem:"",
    showPassword: true,
    showPassword2: true,
    showPassword3: true,
  });

  const [currentCpf, setCurrentCpf] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const cpf = await SecureStore.getItemAsync("userId");

      setCurrentCpf(cpf);

      try {
        const response = await api.getUserById(cpf);

        const { name, email } = response.data.user;

        setUser((prev) => ({
          ...prev,
          cpf: cpf,
          name: name,
          email: email,
        }));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    loadUser();
    getUserSchedules();
  }, []);

  async function handleAtualizar() {
    await api.putAtualizarUsuario(currentCpf, user).then(
      (response) => {
        Alert.alert(response.data.message);
        if (currentCpf !== user.cpf) {
          setCurrentCpf(user.cpf);
          SecureStore.setItemAsync("userId", user.cpf);
          SecureStore.setItemAsync("token", response.data.token);
        }
      },
      (error) => {
        Alert.alert(error.response.data.error);
      }
    );
  }

  async function handleDeletar() {
    await api.deleteUser(currentCpf).then(
      (response) => {
        Alert.alert(response.data.message);
        navigation.navigate("Login");
      },
      (error) => {
        Alert.alert(error.response.data.error);
      }
    );
  }

  async function getUserSchedules(){
    try {
      const cpf = await SecureStore.getItemAsync("userId");
      const response = await api.getUserSchedules(cpf)
      const numeroReservas = response.data.contagem

      setUser((prev) => ({
          ...prev,
          contagem: String(numeroReservas)
      }))
    } catch (error) {
      Alert.alert(error.response.data.error)
    }
    
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

        {/* Senhas */}
        <View
          style={[
            styles.Container2,
            {
              borderColor:
                focusedInput === "oldPassword" ? "#af2e2e" : "#000000",
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
        
        <Text>Número de reservas do usuário: {user.contagem}</Text>
      </View>

      <View style={styles.viewNavigate}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.buttonColor1}
        >
          <Text style={styles.TextNavigate1}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAtualizar} style={styles.buttonColor2}>
          <Text style={styles.TextNavigate2}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Deletar */}
      <View style={{ width: "90%", alignSelf: "center", marginTop: 15 }}>
        <TouchableOpacity
          onPress={() => setShowDeleteModal(true)}
          style={{
            backgroundColor: "#af2e2e",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Deletar Usuário
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação */}
      <Modal
        transparent
        animationType="fade"
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.title}>Confirmação</Text>
            <Text style={modalStyles.message}>
              Você tem certeza que deseja deletar seu usuário?
            </Text>

            <View style={modalStyles.buttonsContainer}>
              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: "#ccc" }]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, { backgroundColor: "#af2e2e" }]}
                onPress={async () => {
                  setShowDeleteModal(false);
                  await handleDeletar();
                }}
              >
                <Text style={[modalStyles.buttonText, { color: "#fff" }]}>
                  Deletar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#af2e2e",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
