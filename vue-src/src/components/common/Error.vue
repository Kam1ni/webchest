<template>
	<v-snackbar v-model="show" :timeout="6000" :top="true" :right="true" color="error">
		{{message}}
	</v-snackbar>
</template>

<script>
	export default {
		data(){
			return{
				show: false,
				message: null
			};
		},
		watch: {
			show(newVal, oldVal){
				if (newVal && !oldVal){
					this.$emit("close");
				}
			},
			value(newVal, oldVal){
				if (newVal != null){
					this.message = newVal;
					this.show = this.value;
					this.$emit("input", null);
				}
			}
		},
		props: ["value"]
	}
</script>
