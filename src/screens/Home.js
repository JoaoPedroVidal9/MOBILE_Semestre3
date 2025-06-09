import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ListaReserva")}
      >
        <Text style={styles.buttonText}>Minhas Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ListaSalas")}
      >
        <Text style={styles.buttonText}>Nova Reserva</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => {
          // Aqui você pode limpar o token e navegar para login, por exemplo
          // SecureStore.deleteItemAsync("token");
          navigation.navigate("Login");
        }}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#215299",
    alignSelf: "center",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#215299",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#215299",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#215299",
  },
  logoutText: {
    color: "#215299",
  },
});
