import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify';

Vue.config.productionTip = false
Vue.use(Vuetify, {
	theme: {
		primary: "#004d40",
		secondary: "#757575",
		accent: "#00bfa5",
		error: "#b71c1c"
	}
});

new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
})
