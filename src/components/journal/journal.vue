<template>
  <div class="width-100 p-relative">
    <addTrade v-if="showTradeModal" @close-addtrade="closeAddOrder" />
    <div class="d-flex fd-column jc-start">
      <div class="d-flex fd-row jc-space ai-end">
        
        <div class="d-flex fd-row width-50">
          <div class="d-flex fd-column m-r-2">
            <p class="text-light fs-18 m-b-1">Статус сделки</p>
            <select v-model="selectedStatus">
              <option value="">Все</option>
              <option value="Активна">Активна</option>
              <option value="Проигрыш">Проигрыш</option>
              <option value="Победа">Победа</option>
            </select>
          </div>
          <div class="d-flex fd-column m-r-2">
            <p class="text-light fs-18 m-b-1">Позиция</p>
            <select v-model="selectedPosition">
              <option value="">Все</option>
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>                    
        </div>

        <button @click="clearFilter" class="btn-gen">Сбросить фильтр</button>
      </div>
    </div>

      <EditCommissionDialog
        v-if="isEditCommissionDialogVisible"
        :trade="selectedTradeForEdit"
        @close-dialog="closeEditCommissionDialog"
        @save-commission="saveCommission(trade)"
      />

      <EditCommentDialog
        v-if="isEditCommentDialogVisible"
        :trade="selectedTradeForEdit"
        @close-dialog="closeEditCommentDialog"
        @save-comment="saveComment(trade)"
      />
  </div>
  <div class="width-100 o-scroll">
    <div class="d-flex fd-column jc-center ai-center w-150 m-tb-2">
      <v-table theme="dark">
        <thead>
          <tr>
            <th class="w-5 text-left">ID</th>
            <th class="w-10 text-left">Сумма</th>
            <th class="text-left">Плечо</th>
            <th class="text-left">Комиссия</th>
            <th class="w-10 text-left">Позиция</th>
            <th class="text-left">ТВХ</th>
            <th class="text-left">T/P</th>
            <th class="text-left">S/L</th>
            <th class="w-15 text-left">Статус</th>
            <th class="text-left">Форс</th>
            <th class="text-left">PNL %</th>
            <th class="text-left">PNL USDT</th>
            <th class="w-30 text-left">Комментарий</th>
            <th class="w-20 text-left">Картинка</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="trade in tradesFiltered" 
            :key="trade.ID"
          >
            <td class="w-5 col-body">{{ trade.ID }}</td>
            <td class="w-10 col-body">{{ trade.AmountTrade }}</td>
            <td class="col-body">{{ trade.LeverageLevel }}</td>
            <td class="col-body">
              <div class="d-flex fd-row ai-center">
                <img 
                  alt="Редактировать"
                  width="15"
                  height="15"
                  src="@/assets/svg/edit.svg" 
                  @click="openEditCommissionDialog(trade)" 
                  class="pointer m-r-05"
                />
                {{ trade.CommissionAmount }} $
              </div>
            </td>
            <td class="col-body">{{ trade.PositionDirection }}</td>
            <td class="col-body">{{ trade.EntryPoint }} $</td>
            <td class="col-body">{{ trade.TakeProfit }} $</td>
            <td class="col-body">{{ trade.StopLoss }} $</td>
            <td  :class="statusClass(trade.Status)" class="w-15 col-body upper fs-13">
              <CustomSelect :trade="trade" @updateStatus="updateStatus(trade)" />
            </td>
            <td class="col-body">{{ trade.ForcedStatus }}</td>
            <td  :class="pnlClass(trade.PNL)" class="col-body">{{ trade.PNL }} %</td>
            <td  :class="pnlClass(trade.PNLUSDT)" class="col-body">{{ trade.PNLUSDT }} USDT</td>
            <td class="w-30 col-body">
              <div class="d-flex fd-row ai-center">
                <img 
                  alt="Редактировать"
                  width="15"
                  height="15"
                  src="@/assets/svg/edit.svg" 
                  @click="openEditCommentDialog(trade)"
                  class="pointer m-r-05"
                />
                <div v-if="selectedTrade === trade.ID">
                  {{ trade.Comment }}<br>
                  <span @click="closeDialog" class="curtext pointer">Скрыть</span>
                </div>
                <div v-else @click="showDialog(trade.ID)" class="pointer">
                  {{ getTruncatedComment(trade.Comment) }}
                </div>
              </div>
            </td>
            <td class="w-20 col-body"><img :src="'http://localhost:3000/' + trades.ImagePath" alt="Изображение сделки" width="50" height="50" /></td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
  <button v-if="!showTradeModal" class="btn-add-trades text-center m-t-3 w-20" @click="showAddOrder">Добавить сделку</button>
</template>


<script setup>
import addTrade from './AddTrade.vue';
import EditCommissionDialog from './EditCommissionDialog.vue';
import EditCommentDialog from './EditCommentDialog.vue';
import CustomSelect from './CustomSelect.vue';
import { ref, onMounted, computed } from 'vue';
import { useApi } from '@/api/api.js';

const { fetchTrades, updateTradeStatus } = useApi();

const trades = ref([]);

// Функция для получения сделок
const fetchTradesData = async () => {
  try {
    const response = await fetchTrades();
    trades.value = response;
  } catch (error) {
    console.error(error);
  }
};

// Функция для обновления статуса сделки
const updateStatus = async (trade) => {
  try {
    await updateTradeStatus(trade.ID, trade.Status);
    console.log('Статус успешно обновлен');
  } catch (error) {
    console.error(error);
  }
};

// Меняейм цвет в зависимости от статуса
const statusClass = computed(() => {
  return (status) => {
    switch (status) {
      case 'Активна':
        return 'active-status';
      case 'Победа':
        return 'win-status';
      case 'Проигрыш':
        return 'lose-status';
      default:
        return '';
    }
  };
});

// Меняем цвет в зависимости от PNL
const pnlClass = computed(() => {
  return (value) => {
    if (value > 0) {
      return 'positive-value';
    } else if (value < 0) {
      return 'negative-value';
    } else {
      return 'zero-value';
    }
  };
});

// Фильтр сделкок
const tradesFiltered = () => {
  let filteredTrades = trades; 

  if (selectedStatus.value) {
    filteredTrades = filteredTrades.filter(trade => trade.Status === selectedStatus.value);
  }

  if (selectedPosition.value) {
    filteredTrades = filteredTrades.filter(trade => trade.PositionDirection === selectedPosition.value);
  }
  return filteredTrades;
  
};


// Очищаем фильтры
const clearFilter = () => {
  selectedStatus.value = '';
  selectedPosition.value = '';
};

// Делаем комент видымым на 10 слов
const getTruncatedComment = computed(() => {
  return (comment) => {
    if (!comment) return '';
    const words = comment.split(' ');
    const limit = 10;
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + ' ...';
    }
    return comment;
  };
});

const isEditCommissionDialogVisible = ref(false);
const isEditCommentDialogVisible = ref(false);
const selectedTradeForEdit = ref(null);
const selectedTrade = ref(null);
const selectedStatus = ref('');
const selectedPosition = ref('');
const showTradeModal = ref(false);

const openEditCommissionDialog = (trade) => {
  selectedTradeForEdit.value = trade;
  isEditCommissionDialogVisible.value = true;
};

const closeEditCommissionDialog = () => {
  isEditCommissionDialogVisible.value = false;
  selectedTradeForEdit.value = null;
};

const openEditCommentDialog = (trade) => {
  selectedTradeForEdit.value = trade;
  isEditCommentDialogVisible.value = true;
};

const closeEditCommentDialog = () => {
  isEditCommentDialogVisible.value = false;
  selectedTradeForEdit.value = null;
};

const showDialog = (tradeID) => {
  selectedTrade.value = tradeID;
};

const closeDialog = () => {
  selectedTrade.value = false;
};

const showAddOrder = () => {
  showTradeModal.value = true;
};

const closeAddOrder = () => {
  showTradeModal.value = false;
};

onMounted(() => {
  fetchTradesData();
  tradesFiltered()
});



      // const saveCommission = (trade, newCommission) => {
      //   axios.put(`http://ваш_сервер/api/updatecommission/${trade.ID}`, { commission: newCommission })
      //     .then((response) => {
      //       console.log('Комиссия успешно обновлена', response.data);
      //     })
      //     .catch((error) => {
      //       console.error('Произошла ошибка при обновлении комиссии', error);
      //     });
      //   closeEditCommissionDialog();
      // };

      // const saveComment = (trade, newComment) => {
      //   axios.put(`http://ваш_сервер/api/updatecommission/${trade.ID}`, { commission: newCommission })
      //     .then((response) => {
      //       console.log('Комиссия успешно обновлена', response.data);
      //     })
      //     .catch((error) => {
      //       console.error('Произошла ошибка при обновлении комиссии', error);
      //     });
      //   closeEditCommissionDialog();
      // };

</script>
<script>

</script>

<style>
.btn-add-trades {
  box-shadow: rgba(0, 128, 255, 0.5) 0px 0px 6px 3px;
  background-color: transparent;
  border: 1px solid rgb(0 154 255);
  cursor: pointer;
  color: #fff;
  padding: 12px 20px;
  font-size: 16px;
}
.o-scroll {
  overflow-x: scroll;
}
table {
  border-collapse: collapse;
  table-layout: fixed; 
  word-wrap:break-word; 
}
tr {
  background-color: #1f1e28;
}
th, td {
  width: 12%;
  border: 1px solid #cccccc31;
  padding: 8px;
  font-size: 16px;
}
th {
  font-weight: 500;
  color: #fff !important;
}
td {
  color: #ffffffc5;
}
thead {
  background-color: #24232f;
  border: 2px solid rgb(0 154 255);
}
.w-150 {
  width: 180%;
}
.active-status {
  border-radius: 0px;
}

.win-status {
  background-color: #00c0ad;
  color: #fff;
  border-radius: 0px;
  font-weight: 600 !important;
}

.win-color {
  color: #00c0ad;
}

.lose-status {
  background-color: red;
  color: #fff;
  border-radius: 0px;
  font-weight: 600 !important;
}

.lose-color {
  color: red;
}

.positive-value {
  color: #00ffc5;
  font-weight: 500;
}

.negative-value {
  color: #ff0000;
  font-weight: 500;
}

*::-webkit-scrollbar {
  width: 10px;               
  height: 10px;
}
*::-webkit-scrollbar-track {
  background: rgb(44, 44, 44);        
}
*::-webkit-scrollbar-thumb {
  background-color: rgb(0 154 255);
  border-radius: 20px;      
}

</style>