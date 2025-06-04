import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import LayoutMenu from "./components/LayoutMenu";
import ListaSalas from "./screens/ListaSalas";
import Reservar from "./screens/Reservar";
import ListaReserva from "./screens/listaReserva";
import Perfil from "./screens/Perfil";
import Home from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen
          name="ListaSalas">{({navigation}) => (
            <LayoutMenu navigation={navigation}>
              <ListaSalas navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="Reservar">
          {({ navigation }) => (
            <LayoutMenu navigation={navigation}>
              <Reservar navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="ListaReserva">
          {({ navigation }) => (
            <LayoutMenu navigation={navigation}>
              <ListaReserva navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="Perfil">
          {({ navigation }) => (
            <LayoutMenu navigation={navigation}>
              <Perfil navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <LayoutMenu navigation={navigation}>
              <Home navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
