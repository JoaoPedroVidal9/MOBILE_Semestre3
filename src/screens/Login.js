import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import api from "../axios/axios";
import { Ionicons } from "@expo/vector-icons"
import * as SecureStore from 'expo-secure-store'

export default function Login({ navigation }) {
    const [user, setUser] = useState({
        cpf: '',
        password: '',
        showPassword: true
    });

    const [focusedInput, setFocusedInput] = useState(null); // constante para saber qual input está em foco


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
            <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />

            <View style={styles.ViewBemVindo}>
                <Text style={styles.TextBemVindo}>Seja bem-vindo(a). Faça o login para acessar a agenda senai ou cadastre-se como novo usuário.</Text>
            </View>

            <View style={styles.ViewInputs}>
                
                <Text style={styles.Text}>Usuário</Text>

                <View style={[styles.Container,
                    { borderColor: focusedInput === "cpf" ? "#af2e2e" : "#000000" }
                ]}>
                    <TextInput
                        placeholder="Digite seu CPF *"
                        placeholderTextColor="#000000"
                        value={user.cpf}
                        onChangeText={(value) => {
                            // Filtra apenas números e limita a 11 caracteres
                            const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
                            setUser({ ...user, cpf: numericValue });
                        }}
                        style={styles.inputCPF}
                        keyboardType="number-pad" // Exibe apenas o teclado numérico
                        maxLength={11} // Limita a entrada a 11 caracteres
                        onFocus={() => setFocusedInput("cpf")}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>


                <Text style={styles.Text}>Senha</Text>

                <View style={[styles.Container2,
                { borderColor: focusedInput === "password" ? "#af2e2e" : "#000000" }
                ]}>
                    <TextInput
                        placeholder="Digite sua senha *"
                        placeholderTextColor="#000000"
                        maxLength={50}
                        secureTextEntry={user.showPassword} //A senha não ficar visível a menos que ele clique no icon
                        value={user.password}
                        onChangeText={(value) => setUser({ ...user, password: value })}
                        style={styles.inputPassword}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                    />

                    <TouchableOpacity onPress={() => setUser({ ...user, showPassword: !user.showPassword })}>
                        <Ionicons name={user.showPassword ? "eye-off" : "eye"} size={34} color="#808080" />
                    </TouchableOpacity>
                </View>

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
    Container: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1, //Espessura da borda
        padding: 12,
        borderRadius: 10,
    },
    inputCPF: {
        color: "#000000",
        fontSize: 16,
        width: "100%",
    },
    Container2: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1, //Espessura da borda
        paddingLeft: 15,
        padding: 5,
        borderRadius: 9,
    },
    inputPassword: {
        color: "#000000",
        fontSize: 16,
        width: "90%"
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
    },
    
});