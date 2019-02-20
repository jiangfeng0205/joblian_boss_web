// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
// import store from './vuex/store'
import axios from 'axios'

import createRouter from './router'
import createStore from './vuex/store'

// 08-19.1
// import store from './vuex/store'

// rem
import "./js/flexible"
//导入字体样式
// import "./styles/fontstyle.css"
// import "./styles/index.styl"

//client socket.io
import VueSocketio from 'vue-socket.io';
import io from 'socket.io-client';

Vue.use(new VueSocketio({
    debug: true,
    // connection: 'http://localhost:8090/', // 本地环境
    connection: 'http://ceshi.joblian.cn:8090/',    // 线上环境
    vuex: {
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))


//其他页面在使用axios的时候直接  this.$http就可以了
Vue.prototype.$http = axios

//使用mintUI插件
import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
Vue.use(MintUI);

// router.beforeEach((to, from, next) => {
// 	if (to.meta.title) {
// 	    document.title = to.meta.title
// 	}
// 	const type = to.meta.type
// 	  // 判断该路由是否需要登录权限
// 	if (type === 'login') {
// 	    if (window.sessionStorage.getItem('user-id')) {
// 		    next();
// 		} else {
// 		    location.href = '/login';
// 	    }
// 	} else {
// 	    next();  // 确保一定要有next()被调用
// 	}
// })

//全局定义alert弹窗层
window.alert=function(msg){
	Vue.$toast({
	  message: msg,
//	  position: 'bottom',
	  duration: 1000
	})
}

Vue.config.productionTip = false

export default function createApp () {
    // 创建 router 实例
    const router =  createRouter()
    const store  = createStore()
    const app = new Vue({
	    // 注入 router 到根 Vue 实例
	    router,
	    store,
	    render: h => h(App)
	})
	// 返回 app 和 router
	return { app, router, store}
}

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App },
//   render: h => h(App),
//   mounted () {
//     document.dispatchEvent(new Event('render-event'));
//   }
// })

