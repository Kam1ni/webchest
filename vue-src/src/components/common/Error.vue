<template>
	<v-snackbar v-model="show" :timeout="6000" :top="true" :right="true" color="red">
		<slot></slot>
	</v-snackbar>
</template>

<script>
	export default {
		data(){
			return{
				show: true
			};
		},
		watch: {
			show(newVal, oldVal){
				if (newVal && !oldVal){
					this.$emit("close");
				}
			},
		}
	}
</script>
