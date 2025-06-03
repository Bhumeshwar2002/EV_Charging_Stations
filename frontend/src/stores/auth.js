    // import { defineStore } from 'pinia'
    // import axios from 'axios'
    // import router from '../router'

    // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    import { defineStore } from 'pinia'
    import axios from 'axios'
    import router from '../router'

    // const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
    const API_URL = 'https://ev-charging-stations-1-veca.onrender.com/api';

    export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token
    },
    actions: {
        async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData)
            this.token = response.data.token
            localStorage.setItem('token', this.token)
            await this.fetchUser()
            router.push({ name: 'stations' })
        } catch (err) {
            this.error = err.response?.data?.message || 'Registration failed'
            throw err
        }
        },
        async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials)
            this.token = response.data.token
            localStorage.setItem('token', this.token)
            await this.fetchUser()
            router.push({ name: 'stations' })
        } catch (err) {
            this.error = err.response?.data?.message || 'Login failed'
            throw err
        }
        },
        async fetchUser() {
        if (!this.token) return
        try {
            // In a real app, you'd have an API endpoint to fetch user data
            // For simplicity, we'll just decode the token
            const payload = JSON.parse(atob(this.token.split('.')[1]))
            this.user = { id: payload.id }
        } catch (err) {
            this.logout()
        }
        },
        logout() {
        this.user = null
        this.token = null
        localStorage.removeItem('token')
        router.push({ name: 'login' })
        }
    }
    })