// import { defineStore } from 'pinia'
// import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [],
    loading: false,
    error: null,
    filters: {
      status: '',
      minPower: '',
      connectorType: ''
    }
  }),
  getters: {
    filteredStations(state) {
      return state.stations.filter(station => {
        const matchesStatus = !state.filters.status || station.status === state.filters.status
        const matchesPower = !state.filters.minPower || station.powerOutput >= Number(state.filters.minPower)
        const matchesConnector = !state.filters.connectorType || station.connectorType === state.filters.connectorType
        return matchesStatus && matchesPower && matchesConnector
      })
    }
  },
  actions: {
    async fetchStations() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${API_URL}/stations`, {
          params: this.filters,
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.stations = response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch stations'
      } finally {
        this.loading = false
      }
    },
    async createStation(stationData) {
      try {
        const response = await axios.post(`${API_URL}/stations`, stationData, {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.stations.push(response.data)
        return response.data
      } catch (err) {
        throw err.response?.data?.message || 'Failed to create station'
      }
    },
    async updateStation({ id, ...stationData }) {
      try {
        const response = await axios.put(`${API_URL}/stations/${id}`, stationData, {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        const index = this.stations.findIndex(s => s._id === id)
        if (index !== -1) {
          this.stations[index] = response.data
        }
        return response.data
      } catch (err) {
        throw err.response?.data?.message || 'Failed to update station'
      }
    },
    async deleteStation(id) {
      try {
        await axios.delete(`${API_URL}/stations/${id}`, {
          headers: {
            Authorization: `Bearer ${useAuthStore().token}`
          }
        })
        this.stations = this.stations.filter(s => s._id !== id)
      } catch (err) {
        throw err.response?.data?.message || 'Failed to delete station'
      }
    },
    updateFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.fetchStations()
    }
  }
})