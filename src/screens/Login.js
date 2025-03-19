import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Button, Image } from "react-native";
import api from "../axios/axios"

export default function Login({ navigation }) {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    async function handleLogin() {
        await api.postLogin(user)
            .then(
                (response) => {
                    console.log(response.data.message)
                    // navigation.navigate("Home")
                }, (error) => {
                    console.log(error)
                    Alert.alert(error.response.data.error)
                }
            )
    }


    return (
        <View>
            <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />

            <Text>Seja bem-vindo(a). Faça o login para acessar a agenda senai ou cadastre-se como novo usuário.</Text>

            <View>
                <TextInput
                    placeholder="E-mail"
                    value={user.email}
                    onChangeText={(value) => { setUser({ ...user, email: value }) }}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Senha"
                    value={user.password}
                    onChangeText={(value) => { setUser({ ...user, password: value }) }}
                    style={styles.input}
                />
            </View>

            <View>
                <TouchableOpacity onPress={handleLogin}>
                    <Text>Entrar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.viewNavigate}>
                <Text >Não possui conta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
                    <Text style={styles.TextNavigate} >Clique aqui</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}




const styles = StyleSheet.create({
    logo: {
        width: 300,
        height: 300,
        alignSelf: "center",
        resizeMode: "contain",// Mantém a proporção e evita cortes
        marginBottom: '-30',
        marginTop: '-100'
    },
    viewNavigate: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
    },
    TextNavigate: {
        color: "#215299",
        marginLeft: '10'
    },
})