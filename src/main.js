import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
console.log('🔑 API Key:', process.env.VUE_APP_TINYMCE_API_KEY)
import VueFroala from 'vue-froala-wysiwyg'
import TinyMCEEditor from './components/TiniMCE.vue'

// Importar CSS de Froala
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

Vue.use(VueFroala)
Vue.component('TinyMCEEditor', TinyMCEEditor)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
