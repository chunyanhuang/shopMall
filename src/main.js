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
// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.37.39:8888/api/private/v1/'
// 挂载axios 在其原型对象上挂载了方法
Vue.prototype.$http = axios;



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
