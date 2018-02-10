import Vue from 'vue';

export default {
	install(Vue, options){
		Vue.prototype.$Error = new Vue({
			data(){
				return {error:null, timeout:null}
			},
			watch:{
				error(newVal){
					this.$emit("error", this.error);
					if (!newVal)
						return;
					if (this.timeout)
						clearTimeout(this.timeout);
					this.timeout = setTimeout(()=>{
						this.error = null;
					}, 5000);
				}
			},
			methods:{
				showError(error){
					this.error = error;
				},
				showHttpError(error){
					if (error.body)
						this.error = error.body.message;
					else
						this.error = error.message || error.statusText;
				}
			}
		});
	}
}