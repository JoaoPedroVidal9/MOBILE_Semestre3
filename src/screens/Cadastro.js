import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import api from "../axios/axios";

export default function Cadastro({ navigation }) {
    const [user, setUser] = useState({
        name: '',
        email: '',
        cpf: '',
        password: '',
        password2: ''
    });

    const [focusedInput, setFocusedInput] = useState(null);

    async function handleCadastro() {
        await api.postCadastro(user)
            .then(
                (response) => {
                    console.log(response.data.message);
                    Alert.alert(response.data.message)
                    navigation.navigate("Home");
                }, (error) => {
                    console.log(error);
                    Alert.alert(error.response.data.error);
                }
            );
    }

    return (
        <View>
            <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />

            <View style={styles.ViewInputs}>
                <Text style={styles.Text} >Cadastre-se</Text>
                <TextInput
                    placeholder="Digite seu nome"
                    value={user.name}
                    onChangeText={(value) => setUser({ ...user, name: value })}
                    style={[styles.input, { borderColor: focusedInput === "name" ? "#af2e2e" : "#000000" }]}
                    placeholderTextColor="#000000"
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput(null)}
                />
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
                    style={[styles.input, { borderColor: focusedInput === "email" ? "#af2e2e" : "#000000" }]}
                    placeholderTextColor="#000000"
                    keyboardType="email-address" // Sugere o teclado correto no celular
                    autoCapitalize="none" // Evita letras maiúsculas automáticas
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                    placeholder="Digite seu CPF"
                    value={user.cpf}
                    onChangeText={(value) => {
                        const numericValue = value.replace(/[^0-9]/g, "").slice(0, 11);
                        setUser({ ...user, cpf: numericValue });
                    }}
                    style={[styles.input, { borderColor: focusedInput === "cpf" ? "#af2e2e" : "#000000" }]}
                    placeholderTextColor="#000000"
                    keyboardType="numeric"
                    maxLength={11}
                    onFocus={() => setFocusedInput("cpf")}
                    onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                    placeholder="Digite sua senha"
                    value={user.password}
                    onChangeText={(value) => setUser({ ...user, password: value })}
                    style={[styles.input, { borderColor: focusedInput === "password" ? "#af2e2e" : "#000000" }]}
                    secureTextEntry
                    placeholderTextColor="#000000"
                    onFocus={() => setFocusedInput("password")}
                    onBlur={() => setFocusedInput(null)}
                />
                <TextInput
                    placeholder="Confirme sua senha"
                    value={user.password2}
                    onChangeText={(value) => setUser({ ...user, password2: value })}
                    style={[styles.input, { borderColor: focusedInput === "password2" ? "#af2e2e" : "#000000" }]}
                    secureTextEntry
                    placeholderTextColor="#000000"
                    onFocus={() => setFocusedInput("password2")}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>

            <View style={styles.viewNavigate}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.buttonColor1}>
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
        marginTop: -50
    },
    ViewInputs: {
        width: "90%",
        alignSelf: "center",
        marginTop: 10
    },
    Text: {
        fontSize: 25,
        fontWeight: "500",
        marginBottom: 15
    },
    input: {
        color: "#000000",
        borderWidth: 1,
        padding: 13,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20
    },
    viewNavigate: {
        display: "flex",
        flexDirection: "row",
        width: '90%',
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between"
    },
    buttonColor1: {
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderColor: "#00000",
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonColor2: {
        backgroundColor: "#215299",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    TextNavigate1: {
        color: "#215299",
    },
    TextNavigate2: {
        color: "#FFFFFF",
    },
});