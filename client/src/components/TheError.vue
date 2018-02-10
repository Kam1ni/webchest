<template>
	<v-snackbar :timeout="0" v-model="show" top right color="red darken-3">{{$Error.error}}</v-snackbar>
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
				this.show = this.$Error.error != null;
			}
		},
		created(){
			this.show = this.$Error.error != null;
		}
	}
</script>
