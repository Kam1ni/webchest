<template>
	<v-dialog v-model="show">
		<slot name="activator" slot="activator"></slot>
		<v-card>
			<v-card-title class="headline">{{title || "Confirm"}}</v-card-title>
			<v-card-text><slot>Are you sure you want to do this.</slot></v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click.native="yes">{{yesText || "Yes"}}</v-btn>
				<v-btn flat @click.native="no">{{noText || "No"}}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		data(){
			return {show: false}
		},
		watch:{
			show(newVal){
				this.$emit("input", newVal);
			},
			value(newVal){
				this.show = newVal;
			}
		},
		methods:{
			yes(){
				this.show = false;
				this.$emit("yes", this.yesParam);
			},
			no(){
				this.show = false;
				this.$emit("no", this.noParam);
			}
		},
		props:["title", "yes-text", "no-text", "value", "yes-param", "no-param"]

	}
</script>