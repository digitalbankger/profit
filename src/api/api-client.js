const baseUrl = 'http://localhost:8080';

// Общая функция для выполнения запросов к API
async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}/api${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.statusText}`);
  }

  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
}

// Получение всех сделок
export function fetchTrades(userId) {
  return fetchData(`/gettrades/${userId}`);
}

// Получение статистики со сделками
export function fetchStat(userId) {
  return fetchData(`/getstat/${userId}`);
}

// Получение списка сделок
export function fetchProfits(userId) {
  return fetchData(`/getprofits/${userId}`);
}

// Удаление сделки по ее ID
export function deleteTradeById(tradeId) {
  const options = {
    method: 'DELETE',
  };

  return fetchData(`/deletetrade/${tradeId}`, options);
}

// Обновление статуса сделки
export function updateTradeStatus(tradeId, updatedStatus) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Status: updatedStatus }),
  };

  return fetchData(`/updatestatus/${tradeId}`, options);
}

// Обновление комментария сделки
export function updateTradeComment(tradeId, updateComment) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Comment: updateComment }),
  };

  return fetchData(`/updatecomment/${tradeId}`, options);
}

// Обновление коммиссии сделки
export function updateTradeCommission(tradeId, updateCommission) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Commission: updateCommission }),
  };

  return fetchData(`/updatecommission/${tradeId}`, options);
}

// Обновление коммиссии сделки
export function updateTradePNL(tradeId, updatePNL) {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ PNLUSDT: updatePNL }),
  };

  return fetchData(`/updatepnl/${tradeId}`, options);
}


export function useApi() {
  return {
    fetchTrades,
    fetchStat,
    fetchProfits,
    deleteTradeById,
    updateTradeStatus,
    updateTradeComment,
    updateTradeCommission,
    updateTradePNL
  };
}
