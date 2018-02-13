<template>
	<v-snackbar :timeout="0" v-model="show" color="error" top right>{{$Error.error}}</v-snackbar>
</template>

<script>
	export default {
		data(){
			return{
				show: true
			};
		},
		watch:{
			"$Error.error"(){
				console.log(this.$Error);
				this.show = this.$Error.error != null;
			}
		},
		created(){
			this.show = this.$Error.error != null;
		}
	}
</script>
