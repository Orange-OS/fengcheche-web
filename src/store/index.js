import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex) // 安装插件

const store = new Vuex.Store({ // 创建仓库
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
