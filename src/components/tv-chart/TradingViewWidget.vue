<template>
    <div class="tradingview-widget-container width-100">
      <div :id="widgetId" />
      <div class="tradingview-widget-copyright">
          <a href="https://ru.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Следите за рынками на TradingView</span></a></div>
    </div>
    <div style="width: 400px; height: 60px; margin-top:-30px; background-color:#0c1011"></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const widgetId = ref('tradingview_widget');
  
      const loadTradingViewScript = () => {
        if (document.getElementById('tradingview-widget-loading-script')) return;
  
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js'; 
        script.type = 'text/javascript';
        script.onload = createWidget;
  
        document.head.appendChild(script);
      };
  
      const createWidget = () => {
        if (document.getElementById(widgetId.value) && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "BINANCE:BTCUSDT",
            interval: "240",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "ru",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: ["STD;EFI","STD;MACD","STD;RSI"],
            container_id: widgetId.value
          });
        }
      };
  
      onMounted(() => {
        loadTradingViewScript();
      });
  
      return {
        widgetId,
      };
    },
  };
  </script>
  
  <style>
  #tradingview_widget {
    width: 100%;
    height: 600px !important;
  }
  </style>
  