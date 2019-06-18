import Vue from 'vue'
// 导入组件库中相关组件
import { 
  Button, 
  FormItem, 
  Form, 
  Input,
  Message,
  
 } from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)


// 全局挂载弹窗提示 必须挂载到全局才能使用
Vue.prototype.$message = Message;
