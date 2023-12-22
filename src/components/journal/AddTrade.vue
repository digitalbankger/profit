<template>
  <div class="add-trade-popup animate">
    <span class="close-addtrade fs-18 text-light text-right pointer p-absolut z-index-1" @click="closeAddTrade">✕</span>
    <div class="p-relative">

      <h2 class="m-b-1">Добавить сделку</h2>
      <form @submit.prevent="addTrade" class="d-flex fd-column jc-space">

        <div class="d-flex fd-row jc-space">
          <div class="col-3 d-flex fd-column">
            <label for="entryPoint">Сумма сделки:</label>
            <input type="number" v-model="amountTrade" class="form-control" required />

            <label for="leverageLevel">Плечо:</label>
            <input type="number" v-model="leverageLevel" class="form-control" required />

            <label for="positionDirection">Позиция:</label>
            <select v-model="positionDirection" class="form-control-select"  required >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
            
          </div>

          <div class="col-3 d-flex fd-column">

            <label for="entryPoint">Точка входа:</label>
            <input type="number" v-model="entryPoint" class="form-control" required />

            <label for="commissionAmount">Стоп-приказ</label>
            <input type="number" v-model="stopLoss" min="0.01" step="0.01" class="form-control" required />

            <label for="takeProfit">Тейк-профит:</label>
            <input type="number" v-model="takeProfit" class="form-control" required />

          </div>

          <div class="col-3 d-flex fd-column">

            <label for="commissionAmount">Коммиссия:</label>
            <input type="number" v-model="commissionAmount" min="0.01" step="0.01" class="form-control" required />

            <label for="comment">Комментарий:</label>
            <textarea v-model="comment" rows="3" class="form-control"></textarea>

          </div>

        </div>

        <div class="d-flex fd-row jc-center m-tb-1">
          <label for="image" class="file-label">
            <img src="@/assets/svg/paper.svg" width="40"/>
            <span class="title">Добавить картинку</span>
            <input type="file" ref="imageInput" @change="handleImageUpload" class="form-file"/>
          </label>  
        </div>

        <button type="submit" class="btn-gen text-dark">Добавить</button>

      </form>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      amountTrade: "",
      leverageLevel: "",
      commissionAmount: "",
      positionDirection: "",
      entryPoint: "",
      stopLoss: "",
      takeProfit: "",
      status: "В работе",
      forcedStatus: "Нет",
      comment: "",
      imageInput: null,
    };
  },
  methods: {
    closeAddTrade() {
      this.$emit('close-addtrade');
    },
    handleImageUpload(event) {
      this.imageInput = event.target.files[0];
    },
    addTrade() {
      const tradeData = new FormData();
      tradeData.append("amountTrade", this.amountTrade);
      tradeData.append("leverageLevel", this.leverageLevel);
      tradeData.append("commissionAmount", this.commissionAmount);
      tradeData.append("positionDirection", this.positionDirection);
      tradeData.append("entryPoint", this.entryPoint);
      tradeData.append("takeProfit", this.takeProfit);
      tradeData.append("stopLoss", this.stopLoss);
      tradeData.append("comment", this.comment);
      tradeData.append("image", this.imageInput);


      axios.post("http://localhost:3000/api/addtrade", tradeData)
        .then((response) => {
          alert('Сделка успешно добавлена')         
              this.amountTrade = "";
              this.leverageLevel = "";
              this.commissionAmount = "";
              this.positionDirection = "";
              this.entryPoint = "";
              this.takeProfit = "";
              this.stopLoss = "";
              this.comment = "";
              this.imageInput = null;
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>


<style>
.add-trade-popup {
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(24 23 33);
  /* box-shadow: rgba(0, 128, 255, 0.5) 0px 0px 6px 3px; */
  box-shadow: #1da4a460 0px 0px 200px 100px;
  padding: 20px;
  border-radius: 5px;
  border: 2px solid #1da4a4;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

input[type=file]{outline:0;opacity:0;}
.file-label{position:relative;width:50%;border:2px dashed grey;border-radius:5px;display:flex;flex-direction:row;align-items:center;padding:0.6em;transition:border 300ms ease;cursor:pointer;justify-content:center;}
.file-label img{display:block;padding-right:16px}
.file-label:hover{border:2px solid #1da4a4}
.file-label span{width: 42%;}
.form-file {width:100%;position:absolute;}
.close-addtrade {
  right: 20px;
}
</style>