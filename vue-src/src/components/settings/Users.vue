<template>
	<v-card>
		<v-card-text>
			<div class="headline secondary--text">Users:</div>
		</v-card-text>
		<v-expansion-panel v-for="(user, i) in users" :key="i">
			<v-expansion-panel-content>
				<div slot="header" class="secondary--text">
					{{user.username}}
				</div>
				<v-container>
					
				</v-container>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-card>
</template>

<script>
	export default {
		data(){
			return {users:[]};
		},
		async created(){
			this.userRes = this.$resource("user{/id}");
			try{
				this.users = (await this.userRes.get()).body;
				console.log(this.users);
			}catch(err){
				this.$emit("error", err);
			}
		}
	}
</script>