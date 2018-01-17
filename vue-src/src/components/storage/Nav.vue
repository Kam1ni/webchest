<template>
	<v-layout row wrap>
			<v-flex xs12>
				<v-toolbar divider="/" :large="true">
					<a @click="goBack()"><v-icon>arrow_back</v-icon></a>
					<template v-for="(item, index) in history" >
						/<a :key="index" @click="navigateTo(index)">
							{{item.name}}
						</a>
					</template>
				</v-toolbar>
			</v-flex>
		</v-layout>
</template>

<script>
	export default {
		data(){
			return {
				history: [{name:"root", _id:""}]
			};
		},
		watch:{
			current(newVal, oldVal){
				if (newVal && newVal._id){
					let inHistory = this.history.find(function(item){return item._id == newVal._id});
					if (!inHistory)
						this.history.push({name:newVal.name, _id:newVal._id});
				}
			}
		},
		methods:{
			navigateTo(index){
				this.$router.push("/storage/" + this.history[index]._id);
				this.history.splice(index + 1, this.history.length);
			},
			goBack(){
				if (this.history.length > 1){
					let lastIndex = this.history.length - 2;
					this.navigateTo(lastIndex);
				}
			}
		},
		props:[
			'current'
		]
	}
</script>
