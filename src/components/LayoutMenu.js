import logo_senai from "../../assets/logo_senai.png";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import IoniconsMenu from "@expo/vector-icons/Ionicons";
import IoniconsUser from "@expo/vector-icons/Ionicons";

export default function LayoutMenu({ children, navigation }) {
  return (
    <View style={{ flex: 1}}>
      <View style={estilos.centralizarRow}>
        <TouchableOpacity>
          <IoniconsMenu name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Image source={logo_senai} style={estilos.logosenai} />
      </View>
      <View style={{height:"80%"}}>{children}</View>
      <View style={estilos.fundoDoUser}>
        <TouchableOpacity style={estilos.fundoUser} >
          <IoniconsUser
            style={estilos.logoBurger}
            name="person"
            size={24}
            color="black"
            onPress={() => navigation.navigate("Perfil")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  centralizarRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  

  logosenai: {
    width: 300,
    height: 75,
    margin:20
    
  },

  fundoDoUser: {
    width:"50",
    height:"50",
    marginLeft:"25",
    display:'flex',
    alignItems:"center",
    justifyContent:"center",
    margin:25
  },
  
  fundoUser: {
    backgroundColor: "#ff0000",
    width:"50",
    height:"50",
    borderRadius:"100%",
  },

  logoBurger:{
    paddingTop:"25%",
    paddingLeft:"27%",
    width:"50",
    height:"50",
  },
});
