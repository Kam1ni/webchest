<template>
	<v-layout row justify-center wrap align-center primary fill-height>
		<v-flex xs10 sm8 md6>
			<v-card class="elevation-24">
				<v-form @submit="login()">
					<v-card-title primary-title>
						<div class="headline">
							Login
						</div>
					</v-card-title>
					<v-card-text>
						<v-text-field label="Username" v-model="username" required></v-text-field>
						<v-text-field label="password" v-model="password" required type="password"></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-btn flat @click="login()">Login</v-btn>
					</v-card-actions>
					<app-error v-model="error"></app-error>
				</v-form>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data(){
			return {
				username: "",
				password: "",
				error: null
			}
		},
		methods:{
			async login(){
				try{
					await this.$Auth.login(this.username, this.password);
				}catch(err){
					console.log(err)
					if (err.body){
						this.error = err.body.message;
					}else{
						this.error = err.message;
					}
				}
			}
		},
	}
</script>