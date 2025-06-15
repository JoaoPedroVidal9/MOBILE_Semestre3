import axios from "axios"
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
    baseURL: "http://192.168.100.6:5000/api/reservas/v3/", 
    headers: {"accept": "application/json"}
})

api.interceptors.request.use(
  async (config) => {
      const token = await SecureStore.getItemAsync("token");
      if(token){
          config.headers.Authorization = `${token}`
      }
      return config
  },(error) => Promise.reject(error)
)
  

const sheets =  {
    postLogin: (user) => api.post("user/login", user),
    postCadastro: (user) => api.post("user", user),
    getSalas: () => api.get("classroom"),
    postConsulta: (body) => api.post(`schedule/available/`, body),
    postReserva: (body) => api.post('schedule/', body),
    getListaReserva: (userId) => api.get(`schedule/user/${userId}`),
    deleteReserva: (reservaId) => api.delete(`schedule/${reservaId}`),
    putAtualizarUsuario: (currentCpf, user) => api.put(`user/${currentCpf}`, user),
    getUserById: (userId) => api.get(`user/${userId}`),
    deleteUser: (userId) => api.delete(`user/${userId}`),
    getUserSchedules: (userId) => api.get(`schedule/user/${userId}`),
    postDaysWeekSchedule: (daysDate) => api.post(`schedule/days`, daysDate),
}

export default sheets
