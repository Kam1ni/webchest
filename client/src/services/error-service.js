import Vue from 'vue';

export default {
	install(Vue, options){
		Vue.prototype.$Error = new Vue({
			data(){
				return {error:null, timeout:null}
			},
			watch:{
				error(newVal){
					if (!newVal)
						return;
					this.$emit("error", this.error);
					if (this.timeout)
						clearTimeout(this.timeout);
					this.timeout = setTimeout(()=>{
						this.error = null;
					}, 5000);
				}
			},
			methods:{
				showError(error){
					console.log(error);
					this.error = error;
				},
				showHttpError(error){
					console.log(error);
					if (error.status == 0)
						return this.error = "No connection";
					if (error.body)
						this.error = error.body.message;
					else
						this.error = error.message || error.statusText;
				}
			}
		});
	}
}