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
				}
			}
		});
		Vue.Socket = Vue.prototype.$Socket;
	}
}