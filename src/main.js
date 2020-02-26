import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// 引入字体图标
import './common/css/index.css'

// 使用 vue-resource 请求数据
import vueResource from 'vue-resource'
Vue.use(vueResource)

// 引入miit-Ui全部组件
import Mint from "mint-ui";
Vue.use(Mint);
import 'mint-ui/lib/style.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
})
