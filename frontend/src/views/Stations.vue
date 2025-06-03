<template>
  <div class="stations-container">
    <div class="stations-header">
      <h2>Charging Stations</h2>
      <button @click="showForm = true" class="add-btn">Add Station</button>
    </div>
    
    <div class="filters">
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filters.status" @change="updateFilters">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Min Power (kW):</label>
        <input 
          v-model="filters.minPower" 
          type="number" 
          min="0" 
          @input="updateFilters"
        />
      </div>
      
      <div class="filter-group">
        <label>Connector Type:</label>
        <select v-model="filters.connectorType" @change="updateFilters">
          <option value="">All</option>
          <option value="Type1">Type 1</option>
          <option value="Type2">Type 2</option>
          <option value="CCS">CCS</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Tesla">Tesla</option>
        </select>
      </div>
    </div>
    
    <div class="content">
      <div class="list-container">
        <ChargerList 
          :stations="filteredStations" 
          :loading="loading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
      
      <div class="map-container">
        <MapView :stations="filteredStations" />
      </div>
    </div>
    
    <ChargerForm 
      v-if="showForm"
      :station="editingStation"
      @save="handleSave"
      @close="showForm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStationsStore } from '../stores/stations'
import ChargerList from '../components/ChargerList.vue'
import MapView from '../components/MapView.vue'
import ChargerForm from '../components/ChargerForm.vue'

const stationsStore = useStationsStore()
const showForm = ref(false)
const editingStation = ref(null)

const filters = ref({
  status: '',
  minPower: '',
  connectorType: ''
})

const filteredStations = computed(() => stationsStore.filteredStations)
const loading = computed(() => stationsStore.loading)

onMounted(() => {
  stationsStore.fetchStations()
})

const updateFilters = () => {
  stationsStore.updateFilters(filters.value)
}

const handleEdit = (station) => {
  editingStation.value = { ...station }
  showForm.value = true
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this station?')) {
    await stationsStore.deleteStation(id)
  }
}

const handleSave = async (stationData) => {
  if (stationData._id) {
    await stationsStore.updateStation(stationData)
  } else {
    await stationsStore.createStation(stationData)
  }
  showForm.value = false
  editingStation.value = null
}
</script>

<style scoped>
.stations-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #3aa876;
}

.filters {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: calc(100vh - 250px);
}

.list-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 1rem;
}

.map-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

@media (max-width: 1024px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    height: 400px;
  }
}
</style>