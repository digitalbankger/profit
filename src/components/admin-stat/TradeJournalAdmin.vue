<template>
  <div class="d-flex fd-row jc-space m-tb-2">
    <h2 @click="setClose" :class="{'display-3 sec-head text-light pointer': isActive, 'd-none': !isActive}">Активный портфель</h2>
    <h2 @click="setActive" :class="{'d-none': isActive, 'display-3 sec-head text-light pointer': !isActive}">Предыдущий портфель</h2>
  </div>

  <div class="width-100 p-relative">
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

      <EditPNLUSDT
        v-if="isEditPNLDialogVisible"
        :trade="selectedTradeForEdit"
        @close-dialog="closeEditPNLDialog"
        @save-pnl="updatePNL(selectedTradeForEdit, $event)"
      />

  </div>
  <div class="width-100">
    <div class="d-flex fd-column jc-center ai-center m-tb-2">
      <v-table theme="dark">
        <thead>
          <tr>
            <th class="w-5 text-left"></th>
            <th class="w-5 text-left">ID</th>
            <th class="w-10 text-left">Сумма</th>
            <th class="text-left">Открытие</th>
            <th class="w-15 text-left">Статус</th>
            <th class="text-left">Прибыль %</th>
            <th class="text-left">Прибыль USDT</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="trade in tradesFiltered" 
            :key="trade.ID"
          >
            <td class="w-5 col-body">
              <img 
                alt="Удалить сделку"
                width="18"
                height="18"
                src="@/assets/svg/delete.svg"  
                @click="deleteTrade(trade)"
                class="pointer"
              />
            </td>
            <td class="w-5 col-body">{{ trade.ID }}</td>
            <td class="w-10 col-body">{{ trade.AmountTrade }}</td>
            <td class="col-body">{{ trade.EntryPoint }}</td>
            <td  :class="statusClass(trade.Status)" class="w-15 col-body upper fs-13">
              <CustomSelect :trade="trade" @updateStatus="updateStatus(trade, $event)" />
            </td>
            <td  :class="pnlClass(pnlPercentage(trade))" class="col-body">{{ pnlPercentage(trade) }} %</td>
            <td  :class="pnlClass(trade.PNLUSDT)" class="col-body">
              <div class="d-flex fd-row ai-center">
                <img 
                  alt="Редактировать"
                  width="15"
                  height="15"
                  src="@/assets/svg/edit.svg" 
                  @click="openEditPNLDialog(trade)"
                  class="pointer m-r-05"
                />
                {{ trade.PNLUSDT }} USDT
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>

</template>
  
  
<script>
import EditPNLUSDT from '../journal/EditPNLUSDT.vue';
import { ref, onMounted } from 'vue';
import CustomSelect from '../journal/CustomSelect.vue'
import { useApi } from '@/api/api.js';
  
export default {
  components: {
    CustomSelect,
    EditPNLUSDT,
  },
  props: {
    trade: Object,
  },
  setup(props, context) {
    const { deleteTradeById, fetchTrades, updateTradeStatus, updateTradeComment, updateTradeCommission, updateTradePNL } = useApi();
    const isEditCommissionDialogVisible = ref(false);
    const isEditCommentDialogVisible = ref(false);
    const isEditPNLDialogVisible = ref(false);
    const selectedTradeForEdit = ref(null);
    const selectedPosition = ref('');
    const selectedStatus = ref('')
    const trades = ref([]);
    const showTradeModal = ref(false);
    const selectedTrade = ref(null);  
    const isActive = ref(true);
    
    const setActive = () => {
      isActive.value = true;
    };

    const setClose = () => {
      isActive.value = false;
    };

    const openLightbox = (imageSrc) => {
      context.emit('open-lightbox', imageSrc);
    };
  
    // Функция для удаления сделки
    const deleteTrade = async (trade) => {
      const confirmation = confirm('Вы уверены, что хотите удалить эту сделку?');
      if (confirmation) {
        try {
          await deleteTradeById(trade.ID);
          fetchTradesData(); 
        } catch (error) {
          console.error(error);
        }
      }
    };
      
      // Функция для получения сделок
      const fetchTradesData = async () => {
        try {
          const response = await fetchTrades(1);
          trades.value = response;
        } catch (error) {
          console.error(error);
        }
      };
  
      // Функция для обновления статуса сделки
      const updateStatus = async (trade, updatedStatus) => {
        trade.Status = updatedStatus; 
        try {
          await updateTradeStatus(trade.ID, updatedStatus);
        } catch (error) {
          console.error(error);
        }
      };
  
      // Функция редактирования комментария
      const updateCommission = async (trade, newCommission) => {
        try {
          await updateTradeCommission(trade.ID, newCommission);
          closeEditCommissionDialog();
          fetchTradesData();
        } catch (error) {
          console.error(error);
        }
      };
  
      // Функция редактирования комментария
      const updateComment = async (trade, newComment) => {
        try {
          await updateTradeComment(trade.ID, newComment);
          closeEditCommentDialog();
          fetchTradesData()
        } catch (error) {
          console.error(error);
        }
      };
  
      // Функция редактирования комментария
      const updatePNL = async (trade, pnlUSDT) => {
        try {
          await updateTradePNL(trade.ID, pnlUSDT);
          closeEditPNLDialog();
          fetchTradesData()
        } catch (error) {
          console.error(error);
        }
      };
  
      const openEditCommissionDialog = (trade) => {
        selectedTradeForEdit.value = trade;
        isEditCommissionDialogVisible.value = true;
      };
  
      const closeEditCommissionDialog = () => {
        isEditCommissionDialogVisible.value = false;
      };
      
      const openEditCommentDialog = (trade) => {
        selectedTradeForEdit.value = trade;
        isEditCommentDialogVisible.value = true;
      };
  
      const closeEditCommentDialog = () => {
        isEditCommentDialogVisible.value = false;
      };
  
      const openEditPNLDialog = (trade) => {
        selectedTradeForEdit.value = trade;
        isEditPNLDialogVisible.value = true;
      };
  
      const closeEditPNLDialog = () => {
        isEditPNLDialogVisible.value = false;
      };
  
      const showDialog = (tradeID) => {
        selectedTrade.value = tradeID;
      };
  
      const closeDialog = () => {
        selectedTrade.value = false;
      };
  
      onMounted(() => {
        fetchTradesData();
  
      });
    
      const showAddOrder = () => {
        showTradeModal.value = true;
      };
      const closeAddOrder = () => {
        showTradeModal.value = false;
      };
      return {
        isEditCommissionDialogVisible,
        isEditCommentDialogVisible,
        openEditCommentDialog,
        closeEditCommentDialog,
        selectedTradeForEdit,
        openEditCommissionDialog,
        closeEditCommissionDialog,
        openEditPNLDialog,
        closeEditPNLDialog,
        selectedTrade,
        showDialog,
        closeDialog,
        selectedStatus,
        selectedPosition,
        isEditPNLDialogVisible,
        trades,
        showAddOrder,
        closeAddOrder,
        showTradeModal,
        isActive,
        setActive,
        setClose,
  
        deleteTrade,
        fetchTradesData,
        updateTradeStatus,
        updateStatus,
        updateComment,
        updateCommission,
        updatePNL,

        openLightbox
      };
    },
    methods: {
      clearFilter() {
        this.selectedStatus = '';
        this.selectedPosition = '';
      },
    },
    computed: {
      statusClass() {
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
      },
      pnlClass() {
        return (value) => {
          if (value > 0) {
            return 'positive-value';
          } else if (value < 0) {
            return 'negative-value';
          } else {
            return 'zero-value';
          }
        };
      },
      positionClass() {
        return (value) => {
          if (value === 'LONG' ) {
            return 'positive-value';
          } else {
            return 'negative-value';
          }
        };
      },
      tradesFiltered() {
        let filteredTrades = this.trades;
        if (this.selectedStatus) {
          filteredTrades = filteredTrades.filter(trade => trade.Status === this.selectedStatus);
        }
        if (this.selectedPosition) {
          filteredTrades = filteredTrades.filter(trade => trade.PositionDirection === this.selectedPosition);
        }
        return filteredTrades;
      },
      getTruncatedComment() {
        return (comment) => {
          if (!comment) return '';
          const words = comment.split(' ');
          const limit = 10;
          if (words.length > limit) {
            return words.slice(0, limit).join(' ') + ' ...';
          }
          return comment;
        };
      },
      pnlPercentage() {
        return (trade) => {
          if (trade.AmountTrade === 0) {
            return 0;
          }
          const percentage = (trade.PNLUSDT / trade.AmountTrade) * 100;
          return Math.round(percentage); 
        };
      },
    }
  }
  </script>
  
  <style>
  
  </style>