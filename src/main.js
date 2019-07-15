import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
// 引入Elementui样式
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
// 引入Element-Ui
// 使用 ElementUI
Vue.use(ElementUI);

// 配置axios
import Axios from "axios";
Vue.prototype.$http = Axios;
// Axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";

// 请求拦截器
Axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // config.headers
  // console.log(config.headers)
  // 当我们去获取需要权限的数据的时候 一定要把令牌传到服务器
  // 
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 引入全局CSS
import './assets/css/base.css'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
