import EventEmitter from 'events';
import {Http} from 'vue-resource'

class AuthService extends EventEmitter{
	constructor(){
		super();
		this.fetchProfile().catch((err)=>{
			console.error("Failed to fetch profile");
		});
	}

	async login(username, password){
		let response = await Http.post("auth/login", {username: username, password: password});
		this.user = response.body;
		localStorage.setItem("token", response.body.token);
		this.emit("login", response.body);
		return this.user;
	}

	isLoggedIn(){
		return localStorage.getItem("token") != null;
	}

	async fetchProfile(){
		let response = await Http.get("auth");
		this.user = response.body;
		console.log(this.user);
	}

	async logout(){
		let response = await Http.delete("auth/logout");
		localStorage.clear();
		this.user = {};
		this.emit("logout");
	}
}

export default {
	install(Vue, options){
		Vue.prototype.$AuthService = new AuthService();
	}
}