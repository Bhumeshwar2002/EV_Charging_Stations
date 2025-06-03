<template>
  <div class="map-container">
    <div v-if="loading" class="loading">Loading map...</div>
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

export default {
  name: 'MapView',
  props: {
    stations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const mapContainer = ref(null)
    const map = ref(null)
    const loading = ref(true)

    // Fix for default marker icons in Leaflet with Webpack
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })

    onMounted(() => {
      if (mapContainer.value) {
        map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.value)
        loading.value = false
      }
    })

    watch(() => props.stations, (newStations) => {
      if (!map.value) return

      // Clear existing markers
      map.value.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer)
        }
      })

      // Add new markers
      newStations.forEach(station => {
        const [lng, lat] = station.location.coordinates
        const marker = L.marker([lat, lng]).addTo(map.value)
        
        marker.bindPopup(`
          <h3>${station.name}</h3>
          <p><strong>Status:</strong> ${station.status}</p>
          <p><strong>Power Output:</strong> ${station.powerOutput} kW</p>
          <p><strong>Connector Type:</strong> ${formatConnectorType(station.connectorType)}</p>
        `)
      })

      // Fit map to bounds if there are stations
      if (newStations.length > 0) {
        const bounds = L.latLngBounds(newStations.map(station => {
          const [lng, lat] = station.location.coordinates
          return [lat, lng]
        }))
        map.value.fitBounds(bounds, { padding: [50, 50] })
      }
    }, { immediate: true })

    const formatConnectorType = (type) => {
      const types = {
        'Type1': 'Type 1 (J1772)',
        'Type2': 'Type 2 (Mennekes)',
        'CCS': 'CCS (Combo)',
        'CHAdeMO': 'CHAdeMO',
        'Tesla': 'Tesla'
      }
      return types[type] || type
    }

    return {
      mapContainer,
      loading
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.map {
  height: 100%;
  width: 100%;
  border-radius: 8px;
}
</style>