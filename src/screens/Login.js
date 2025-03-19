import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import api from "../axios/axios";

export default function Login({ navigation }) {
    const [user, setUser] = useState({
        cpf: '',
        password: ''
    });

    const [focusedInput, setFocusedInput] = useState(null);

    async function handleLogin() {
        await api.postLogin(user)
            .then(
                (response) => {
                    console.log(response.data.message);
                    Alert.alert(response.data.message)
                    navigation.navigate("Home");
                },
                (error) => {
                    console.log(error);
                    Alert.alert(error.response.data.error);
                }
            );
    }

    return (
        <View>
            <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />

            <View style={styles.ViewBemVindo}>
                <Text style={styles.TextBemVindo}>Seja bem-vindo(a). Faça o login para acessar a agenda senai ou cadastre-se como novo usuário.</Text>
            </View>

            <View style={styles.ViewInputs}>
                <Text style={styles.Text}>Usuário</Text>
                <TextInput
                    placeholder="Digite seu CPF *"
                    placeholderTextColor="#000000"
                    value={user.cpf}
                    onChangeText={(value) => {
                        // Filtra apenas números e limita a 11 caracteres
                        const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
                        setUser({ ...user, cpf: numericValue });
                    }}
                    style={[
                        styles.input,
                        { borderColor: focusedInput === "cpf" ? "#af2e2e" : "#000000" }
                    ]}
                    keyboardType="numeric" // Exibe apenas o teclado numérico
                    maxLength={11} // Limita a entrada a 11 caracteres
                    onFocus={() => setFocusedInput("cpf")}
                    onBlur={() => setFocusedInput(null)}
                />

                <Text style={styles.Text}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha *"
                    placeholderTextColor="#000000"
                    secureTextEntry //A senha não fica visível
                    value={user.password}
                    onChangeText={(value) => setUser({ ...user, password: value })}
                    style={[
                        styles.input,
                        { borderColor: focusedInput === "password" ? "#af2e2e" : "#000000" }
                    ]}
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            <TouchableOpacity style={styles.ButtonEntrar} onPress={handleLogin}>
                <Text style={styles.TextEntrar}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.viewNavigate}>
                <Text style={styles.TextNavigate1}>Não possui conta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                    <Text style={styles.TextNavigate2}>Cadastre-se</Text>
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
        marginTop: -50
    },
    ViewBemVindo: {
        alignSelf: "center",
        width: "80%"
    },
    TextBemVindo: {
        fontSize: 14,
        fontWeight: "500"
    },
    ViewInputs: {
        width: "90%",
        alignSelf: "center",
        marginTop: 30
    },
    Text: {
        fontSize: 25,
        fontWeight: "500",
        marginBottom: 5
    },
    input: {
        color: "#000000",
        borderWidth: 1, //Espessura da borda
        padding: 13,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20
    },
    ButtonEntrar: {
        backgroundColor: "#215299",
        width: "80%",
        alignSelf: "center",
        borderRadius: 5,
        paddingTop: 9,
        paddingBottom: 9,
        marginBottom: 20,
        marginTop: 15
    },
    TextEntrar: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "500",
        alignSelf: "center"
    },
    viewNavigate: {
        flexDirection: "row",
        alignSelf: "center"
    },
    TextNavigate1: {
        color: "#000000",
        fontSize: 16
    },
    TextNavigate2: {
        color: "#215299",
        marginLeft: 5,
        marginRight: 10,
        fontSize: 16
    }
});