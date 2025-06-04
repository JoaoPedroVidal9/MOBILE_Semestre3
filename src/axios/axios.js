import axios from "axios"
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: "http://10.89.240.75:5000/api/reservas/v3/", 
    headers: {"accept": "application/json"}
})
api.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem("authorization");
        console.log("Token do axios: ", token)
  
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
    getSalas: () => api.get("classroom"),
    postConsulta: (body) => api.post(`schedule/available/`, body),
    postReserva: (body) => api.post('schedule/', body),
    getListaReserva: (userId) => api.get(`schedule/user/${userId}`),
    deleteReserva: (reservaId) => api.delete(`schedule/${reservaId}`),
    putAtualizarUsuario: (currentCpf, user) => api.put(`user/${currentCpf}`, user),
}

export default sheets
