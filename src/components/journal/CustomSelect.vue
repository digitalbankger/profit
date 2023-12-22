<template>
  <div class="custom-select">
    <div class="selected-option" @click="toggleDropdown">
      <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
      {{ selectedStatus }}
    </div>
    <div class="options" v-if="isOpen">
      <div class="option" v-for="option in options" :key="option" @click="selectOption(option)">
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trade: Object,
  },
  data() {
    return {
      isOpen: false,
      options: ["Активна", "Победа", "Проигрыш"],
      selectedStatus: this.trade.Status,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedStatus = option;
      this.isOpen = false;
      this.$emit("updateStatus", this.selectedStatus); // Передаем обновленный статус обратно в родительский компонент
    },
  },
};
</script>
  
  
  <style scoped>
  .custom-select {
    position: relative;
    width: 150px; 
    cursor: pointer;
  }
  
  .select-header {
    cursor: pointer;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .arrow {
    margin-left: 8px;
  }
  
  .options {
    cursor: pointer;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #cccccc24;
    border-top: none;
    border-radius: 6px;
    background-color: rgb(24 23 33);
    max-height: 150px; 
    overflow-y: auto;
    padding: 5px;
    z-index: 2;
  }
  
  .options div {
    padding: 8px;
    cursor: pointer;
  }
  
  .options div:hover {
    background-color: #f2f2f232;
  }
  </style>
  