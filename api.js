import axios from "axios";

export const api = axios.create({
    baseURL:'https://parallelum.com.br/fipe/api/v1/'
})

export const unsplashApi = axios.create({
    baseURL: 'https://api.unsplash.com',
})

// Adicionar chave após criar a instância
if (process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY) {
    unsplashApi.defaults.headers.common['Authorization'] = `Client-ID ${process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY}`
}