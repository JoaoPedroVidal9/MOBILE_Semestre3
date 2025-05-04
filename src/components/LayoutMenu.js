import logo_senai from "../../assets/logo_senai.png";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import IoniconsMenu from "@expo/vector-icons/Ionicons";
import IoniconsUser from "@expo/vector-icons/Ionicons";

export default function LayoutMenu({ children }) {
  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View style={estilos.centralizarRow}>
        <TouchableOpacity>
          <IoniconsMenu name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Image source={logo_senai} style={estilos.logosenai} />
      </View>
      <View>{children}</View>
      <View style={estilos.fundoDoUser}>
        <TouchableOpacity style={estilos.logoUser} >
          <IoniconsUser
            style={estilos.logoBurger}
            name="person"
            size={24}
            color="black"
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
    justifyContent: "center",
  },

  fundoDoUser: {
    width:"50",
    height:"50",
    margin:25,
    display:'flex',
    alignItems:"center",
    justifyContent:"center",
  },

  logosenai: {
    width: 300,
    height: 75,
    margin: 25,
    marginRight: 0,
    
  },

  logoUser: {
    backgroundColor: "#ff0000",
    width:"50",
    height:"50",
    borderRadius:"100%",
  },

  logoBurger:{
    paddingTop:13,
    paddingLeft:13.4,
    width:"50",
    height:"50",
  },
});
