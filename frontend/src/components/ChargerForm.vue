<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <h2>{{ station?._id ? 'Edit' : 'Add' }} Charging Station</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="formData.name" type="text" required />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="lat">Latitude range [-90 to 90]</label>
            <input id="lat" v-model="formData.lat" type="number" step="0.000001" required />
          </div>
          <div class="form-group">
            <label for="lng">Longitude range [-180 to 180]</label>
            <input id="lng" v-model="formData.lng" type="number" step="0.000001" required />
          </div>
        </div>
        
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="formData.status" required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="powerOutput">Power Output (kW)</label>
          <input 
            id="powerOutput" 
            v-model="formData.powerOutput" 
            type="number" 
            min="0" 
            step="0.1" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="connectorType">Connector Type</label>
          <select id="connectorType" v-model="formData.connectorType" required>
            <option value="Type1">Type 1 (J1772)</option>
            <option value="Type2">Type 2 (Mennekes)</option>
            <option value="CCS">CCS (Combo)</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="close" class="cancel-btn">Cancel</button>
          <button type="submit" class="save-btn">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  station: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

const formData = ref({
  name: '',
  lat: '',
  lng: '',
  status: 'Active',
  powerOutput: '',
  connectorType: 'Type2'
})

watch(() => props.station, (newVal) => {
  if (newVal) {
    formData.value = {
      _id: newVal._id,
      name: newVal.name,
      lat: newVal.location.coordinates[1],
      lng: newVal.location.coordinates[0],
      status: newVal.status,
      powerOutput: newVal.powerOutput,
      connectorType: newVal.connectorType
    }
  } else {
    formData.value = {
      name: '',
      lat: '',
      lng: '',
      status: 'Active',
      powerOutput: '',
      connectorType: 'Type2'
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('save', formData.value)
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #d0d0d0;
}

.save-btn {
  background-color: #42b983;
  color: white;
}

.save-btn:hover {
  background-color: #3aa876;
}
</style>