import Vue from 'vue';
import io from 'socket.io-client';

export default {
	install(Vue, options){
		Vue.prototype.$Socket = new Vue({
			data(){
				return {socket:null}
			},
			methods:{
				connect(address){
					this.socket = io(address);
				},
				on(event, callback){
					this.socket.on(event, callback);
				},
				unsub(event, callback){
					this.socket.removeListener(event, callback);
				},
				emit(event, data){
					data.token = Vue.Auth.token;
					this.socket.emit(event, data);
				}
			}
		});
		Vue.Socket = Vue.prototype.$Socket;
	}
}