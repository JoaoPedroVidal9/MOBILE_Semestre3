import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import LayoutMenu from "./components/LayoutMenu";
import Teste from "./screens/Teste";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Cadastro" component={CadastroScreen}/>
        <Stack.Screen name="Teste" component={()=>
          <LayoutMenu>
          <Teste/>
          </LayoutMenu>
          }/>
      </Stack.Navigator>
    </NavigationContainer> 
  )
}