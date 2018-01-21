<template>
	<v-container>
		<app-error v-model="error"></app-error>
		<v-layout row wrap>
			<v-flex xs12>
				<v-card>
					<v-form @submit="saveUser">
						<v-card-title primary-title class="secondary--text">
							<div class="headline">
								<span v-if="id">Edit user {{user.username}}</span>
								<span v-else>Create new user</span>
							</div>
						</v-card-title>
						<v-card-text>
							<v-text-field v-model="user.username" label="Username"></v-text-field>
							<v-text-field v-model="user.password" label="Password" type="password"></v-text-field>
							<v-checkbox v-model="user.isAdmin" label="Is Admin"></v-checkbox>
							Max Space (0 is infinite):
							<v-layout row wrap>
								<v-flex xs5 sm6 md8>
									<v-slider v-model="maxSpace" :min="0" :max="1000"></v-slider>
								</v-flex>
								<v-flex xs3 sm2 md2>
									<v-text-field v-model="maxSpace" type="number"></v-text-field>
								</v-flex>
								<v-flex xs4 sm4 md2>
									<v-select v-model="maxSpaceMultiplier" :items="multipliers"></v-select>
								</v-flex>
							</v-layout>
						</v-card-text>
						<v-card-actions>
							<v-btn flat @click="saveUser">Save</v-btn>
							<v-btn flat to="/settings" exact>Cancel</v-btn>
						</v-card-actions>
					</v-form>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		data(){
			return {
				id: null,
				user: {},
				error: null,
				maxSpaceMultiplier: 1,
				multipliers:[
					{text:"bytes", value:1},
					{text:"kB", value:1000},
					{text:"MB", value:1000000},
					{text:"GB", value:1000000000},
					{text:"TB", value:1000000000000}
				]
			}
		},
		computed:{
			maxSpace:{
				get(){
					return this.user.maxSpace / this.maxSpaceMultiplier;
				},
				set(value){
					this.user.maxSpace = value*this.maxSpaceMultiplier;
				}
			}
		},
		methods:{
			async saveUser(){
				console.log("Saving");
				if (this.user.password == ""){
					this.user.password = undefined;
				}
				try{
					if (this.id){
						await this.userRes.update({id:this.id}, this.user);
					}else{
						await this.userRes.save({}, this.user);
					}
					this.$router.push("/settings");
				}catch(err){
					console.log(err);
					this.error = err;
				}
			}
		},
		async created(){
			this.userRes = this.$resource("user{/id}");
			this.id = this.$route.params.id;
			if (this.id){
				console.log(this.id);
				try{
					this.user = (await this.userRes.get({id: this.id})).body;
				}catch(err){
					this.error = err;
				}
			}else{
				this.user = {
					username:"",
					password:"",
					isAdmin: false,
					maxSpace: 0
				}
			}
		}
	}
</script>
