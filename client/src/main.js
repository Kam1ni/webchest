import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify';
import VueResource from 'vue-resource';
import {init as dirInit} from './classes/dir';
import {init as fileInit} from './classes/file';
import Auth from './services/auth-service';
import Err from './services/error-service';
import Socket from './services/socket'
import ConfirmDialog from './components/common/ConfirmDialog.vue';

Vue.use(Socket);
Vue.use(VueResource);
if (process.env.NODE_ENV == "development"){
	Vue.http.options.root = "http://localhost:3000/";
	Vue.Socket.connect("http://localhost:3000/");
}else{
	Vue.http.get("/client").then((response)=>{
		Vue.http.options.root = response.body["server-endpoint"];
		Vue.Socket.connect(response.body["server-endpoint"]);
	}).catch((err)=>{
		console.error(err);
	})
}
Vue.http.interceptors.push(function(req,next){
	if (localStorage.getItem("token")){
		req.headers.set('Authorization', localStorage.getItem("token"));
	}
	next((res)=>{
		if (res.status == 401){
			Vue.Auth.tokenIsInvalid();
		}
	});
});

Vue.use(Auth);
Vue.use(Err);

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

Vue.component("app-confirm-dialog",ConfirmDialog );

console.log(new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>',
}));
