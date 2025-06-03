<template>
  <div class="charger-list">
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="stations.length === 0" class="empty">
      No charging stations found
    </div>
    
    <ul v-else class="station-list">
      <li v-for="station in stations" :key="station._id" class="station-item">
        <div class="station-info">
          <h3>{{ station.name }}</h3>
          <p>
            <strong>Status:</strong> 
            <span :class="statusClass(station.status)">{{ station.status }}</span>
          </p>
          <p><strong>Location:</strong> {{ station.location.coordinates[1] }}, {{ station.location.coordinates[0] }}</p>
          <p><strong>Power Output:</strong> {{ station.powerOutput }} kW</p>
          <p><strong>Connector Type:</strong> {{ formatConnectorType(station.connectorType) }}</p>
        </div>
        
        <div class="station-actions">
          <button @click="$emit('edit', station)" class="edit-btn">Edit</button>
          <button @click="$emit('delete', station._id)" class="delete-btn">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  stations: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])

const statusClass = (status) => {
  return {
    'status-active': status === 'Active',
    'status-inactive': status === 'Inactive',
    'status-maintenance': status === 'Maintenance'
  }
}

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
</script>

<style scoped>
.charger-list {
  height: 100%;
}

.loading, .empty {
  padding: 2rem;
  text-align: center;
  color: #777;
}

.station-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.station-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.station-item:last-child {
  border-bottom: none;
}

.station-info {
  flex: 1;
}

.station-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.station-info p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #555;
}

.status-active {
  color: #42b983;
  font-weight: bold;
}

.status-inactive {
  color: #e74c3c;
  font-weight: bold;
}

.status-maintenance {
  color: #f39c12;
  font-weight: bold;
}

.station-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .station-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .station-actions {
    justify-content: flex-end;
  }
}
</style>