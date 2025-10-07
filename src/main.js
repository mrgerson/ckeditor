import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueFroala from 'vue-froala-wysiwyg'

// Importar CSS de Froala
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

Vue.use(VueFroala)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
