import {Http} from 'vue-resource'
import Vue from 'vue';

export default {
	install(Vue, options){
		Vue.prototype.$Auth = new Vue({
			data(){
				return {
					get token(){
						return localStorage.getItem("token");
					},
					set token(value){
						if (value == null)
							return localStorage.removeItem("token");
						localStorage.setItem("token", value);
					},
					user: null
				}
			},
			watch:{
				token(nawVal){
					if (!newVal){
						this.user = null;
						localStorage.clear();
					}
					this.$emit("user", this.user);
				},
				user(){
					this.$emit("user", this.user);
				}
			},
			computed:{
				loggedIn(){
					console.log(this.token);
					console.log("Logged in", this.token != null);
					return this.token != null;
				}
			},
			methods: {
				async login(username, password){
					let response = await Http.post("auth/login", {username: username, password: password});
					this.user = response.body;
					this.token = response.body.token;
					return this.user;
				},

				async changePassword(oldPassword, newPassword){
					let response = await Http.patch("auth/password", {oldPassword, newPassword});
					return response.body.message;
				},
			
				async fetchProfile(){
					let response = await Http.get("auth");
					this.user = response.body;
				},
			
				async logout(){
					let response = await Http.delete("auth/logout");
					this.token = null;
				},
			
				async removeToken(token){
					this.user = (await Http.delete("auth/logout/" + token)).body;
				},
			
				tokenIsInvalid(){
					this.token = null;
				}
			},

			async created(){
				this.user = {};
				if (this.loggedIn){
					try{
						await this.fetchProfile();
					}catch(err){
						if (err.status == 401){
							this.tokenIsInvalid();
						}
					}
				}
			}
		});
		Vue.Auth = Vue.prototype.$Auth;
	}
}