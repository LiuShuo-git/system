import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
// 引入Elementui样式
import 'element-ui/lib/theme-chalk/index.css';
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 引入 tree树形表格
import tableTree from "vue-table-with-tree-grid";

Vue.component("table-tree", tableTree);

// 引入lodash
// var _ = require('lodash');
import _ from 'lodash';

// 富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.config.productionTip = false;
// 引入Element-Ui
// 使用 ElementUI
Vue.use(ElementUI);

// 配置axios
import Axios from "axios";
Vue.prototype.$http = Axios;
Axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// 时间过滤器
Vue.filter('dateFormat', (original) => {
  let date = new Date(original);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hour = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
})

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
