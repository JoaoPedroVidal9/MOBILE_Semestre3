import axios from "axios"
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: "http://10.89.240.71:5000/api/reservas/v1/", 
    headers: {"accept": "application/json"}
})
api.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem("jwt");
  
        if (token) {
          config.headers.Authorization = token;
        }
  
        return config;
      } catch (error) {
        return config; 
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  

const sheets =  {
    postLogin: (user) => api.post("user/login", user),
    postCadastro: (user) => api.post("user", user),
    getSalas: () =>api.get("classroom"),
    postConsulta: (body) =>api.post(`schedule/available/`, body),
    postReserva: (body) =>api.post('schedule/', body),
}

export default sheets
