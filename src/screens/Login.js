import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Button, Image } from "react-native";


export default function Login({ navigation }) {
    return (
        <View>
            <Image source={require("../../assets/logo_senai.png")} style={styles.logo} />
            <View style={styles.viewNavigate}>
                <Text >Não possui conta?</Text>
                <TouchableOpacity onPress={()=> navigation.navigate("Cadastro")}>
                    <Text style={styles.TextNavigate} >Clique aqui</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}




const styles = StyleSheet.create({
viewNavigate: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
},
TextNavigate: {
    color: "#215299",
    marginLeft: '10'
},
logo: {
    width: 300,
    height: 300,
    alignSelf: "center",
    resizeMode: "contain",// Mantém a proporção e evita cortes
    marginBottom: '-30',
    marginTop: '-100'
}
    
})