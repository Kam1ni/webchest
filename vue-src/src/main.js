import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify';
import VueResource from 'vue-resource';
import {init as dirInit} from './classes/dir';
import {init as fileInit} from './classes/file';

Vue.use(VueResource);
Vue.http.options.root = "http://localhost:3000/";
Vue.http.interceptors.push(function(req,next){
	if (localStorage.getItem("token")){
		req.headers.set('Authorization', localStorage.getItem("token"));
	}
	next();
});

dirInit();
fileInit();

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
	template: '<App/>',
})
