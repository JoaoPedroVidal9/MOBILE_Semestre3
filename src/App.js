import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import LayoutMenu from "./components/LayoutMenu";
import ListaSalas from "./screens/ListaSalas";
import Reservar from "./screens/Reservar";
import ListaReservas from "./screens/listaReserva";
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
          name="ListaSalas">{({navigation, route}) => (
            <LayoutMenu>
              <ListaSalas navigation={navigation} route={route} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="Reservar">
          {({ route, navigation }) => (
            <LayoutMenu>
              <Reservar route={route} navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
        <Stack.Screen name="ListaReservas">
          {({ route, navigation }) => (
            <LayoutMenu>
              <ListaReservas route={route} navigation={navigation} />
            </LayoutMenu>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
