import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图库
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入axios发送请求
import axios from 'axios';

// 导入折叠树
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册
Vue.component('tree-table', TreeTable)

// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.37.145:8888/api/private/v1/'
// 向服务器发送请求时，如果登录了，访问除login以外的页面都要携带token,以便正常访问
axios.interceptors.request.use(config => {
  // 为请求头对象添加Authorization字段
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 挂载axios 在其原型对象上挂载了方法
Vue.prototype.$http = axios;



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
