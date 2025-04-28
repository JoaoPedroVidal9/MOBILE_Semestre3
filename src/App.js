import LoginScreen from "./screens/Login";
import CadastroScreen from "./screens/Cadastro";
import LayoutMenu from "./components/LayoutMenu";
import ListaSalas from "./screens/ListaSalas";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
       screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Cadastro" component={CadastroScreen}/>
        <Stack.Screen name="ListaSalas" component={()=>
          <LayoutMenu>
          <ListaSalas/>
          </LayoutMenu>
          }/>
      </Stack.Navigator>
    </NavigationContainer> 
  )
}