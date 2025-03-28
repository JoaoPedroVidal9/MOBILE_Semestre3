import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import HomeScreen from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Cadastro" component={CadastroScreen}/>
        <Stack.Screen name="Home" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer> 
  )
}