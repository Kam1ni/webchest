import EventEmitter from 'events';
import {Http} from 'vue-resource'

class AuthService extends EventEmitter{
	constructor(){
		super();
		this.fetchProfile().catch((err)=>{
			console.error("Failed to fetch profile");
		});
		this.user = {};
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

	async changePassword(oldPassword, newPassword){
		let response = await Http.patch("auth/password", {oldPassword, newPassword});
		return response.body.message;
	}

	async fetchProfile(){
		let response = await Http.get("auth");
		this.user = response.body;
		console.log(this.user);
		this.emit("login", this.user);
	}

	async logout(){
		let response = await Http.delete("auth/logout");
		localStorage.clear();
		this.user = {};
		this.emit("logout");
	}

	async removeToken(token){
		this.user = (await Http.delete("auth/logout/" + token)).body;
		this.emit("login", this.user);
	}

	getToken(){
		return localStorage.getItem("token");
	}
}

export default {
	install(Vue, options){
		Vue.prototype.$AuthService = new AuthService();
	}
}