<template>
    <div class="edit-dialog">
      <h3>Введите PNL в USDT</h3>
      <input v-model="pnlUSDT" type="text" class="m-tb-1 form-control" />
      <div class="d-flex fd-row jc-space">
        <button @click="closeDialog" class="btn-close">Отмена</button>
        <button @click="savePNL" class="btn-gen ">Сохранить</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    props: {
      trade: Object,
    },
    setup(props, { emit }) {
      const pnlUSDT = ref(props.trade.PNLUSDT);
  
      const savePNL = () => {
        emit('save-pnl', pnlUSDT.value);
      };
  
      const closeDialog = () => {
        emit('close-dialog');
      };
  
      return {
        pnlUSDT,
        savePNL,
        closeDialog,
      };
    },
  };
  </script>
  
  <style scoped>
  .edit-dialog {
    width: 50%;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgb(24 23 33);
    box-shadow: #1da4a45a 0px 0px 6px 3px;
    padding: 20px;
    border-radius: 5px;
    border: 2px solid #1da4a4;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }
  </style>
  