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
        @save-commission="updateCommission(selectedTradeForEdit, $event)"
      />

      <EditPNLUSDT
        v-if="isEditPNLDialogVisible"
        :trade="selectedTradeForEdit"
        @close-dialog="closeEditPNLDialog"
        @save-pnl="updatePNL(selectedTradeForEdit, $event)"
      />

      <EditCommentDialog
        v-if="isEditCommentDialogVisible"
        :trade="selectedTradeForEdit"
        @close-dialog="closeEditCommentDialog"
        @save-comment="updateComment(selectedTradeForEdit, $event)"
      />
  </div>
  <div class="width-100 o-scroll">
    <div class="d-flex fd-column jc-center ai-center w-150 m-tb-2">
      <v-table theme="dark">
        <thead>
          <tr>
            <th class="w-5 text-left"></th>
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
            <td :class="positionClass(trade.PositionDirection)" class="col-body fw-600">{{ trade.PositionDirection }}</td>
            <td class="col-body">{{ trade.EntryPoint }}</td>
            <td class="col-body">{{ trade.TakeProfit }}</td>
            <td class="col-body">{{ trade.StopLoss }}</td>
            <td  :class="statusClass(trade.Status)" class="w-15 col-body upper fs-13">
              <CustomSelect :trade="trade" @updateStatus="updateStatus(trade, $event)" />
            </td>
            <td class="col-body">{{ trade.ForcedStatus }}</td>
            <td  :class="pnlClass(trade.PNL)" class="col-body">{{ trade.PNL }} %</td>
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
            <td class="w-20 col-body"><img :src="'http://localhost:3000/' + trade.ImagePath" alt="Изображение сделки" width="50" height="50" /></td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
  <button v-if="!showTradeModal" class="btn-add-trades text-center m-t-3 w-20" @click="showAddOrder">Добавить сделку</button>
</template>


<script>
import addTrade from './AddTrade.vue';
import EditCommissionDialog from './EditCommissionDialog.vue';
import EditCommentDialog from './EditCommentDialog.vue';
import EditPNLUSDT from './EditPNLUSDT.vue';
import { ref, onMounted, onBeforeMount } from 'vue';
import CustomSelect from './CustomSelect.vue'
import { useApi } from '@/api/api-client.js';
import { useStore } from 'vuex';

export default {
  components: {
    addTrade,
    CustomSelect,
    EditCommissionDialog,
    EditCommentDialog,
    EditPNLUSDT
  },
  props: {
    trade: Object,
  },
  setup() {
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
    const store = useStore();

    const userId = ref(null);

    // Функция для получения текущего пользователя и его ID
    const fetchCurrentUser = () => {
      userId.value = store.state.auth.user.user.ID;
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
        const response = await fetchTrades(userId.value);
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

    onBeforeMount(() => {
      fetchCurrentUser();
    });

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

      deleteTrade,
      fetchTradesData,
      updateTradeStatus,
      updateStatus,
      updateComment,
      updateCommission,
      updatePNL,
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

  }
}
</script>

<style>

</style>