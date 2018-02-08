<template>
	<v-progress-circular color="teal" :value="totalProgress" :rotate="-90">{{totalProgress}}</v-progress-circular>
</template>

<script>
	export default {
		data(){
			return {show:false};
		},
		watch:{
			show(newVal, oldVal){
				this.$emit("input", newVal);
			},
			value(newVal, oldVal){
				this.show = newVal;
			}
		},
		computed:{
			totalProgress(){
				return Math.round(this.tasks.reduce(function(total, val){return total + val.progressPercent},0));
			}
		},
		props: ["value", "tasks"]
	}
</script>