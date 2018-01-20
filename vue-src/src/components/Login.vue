<template>
	<v-card class="elevation-24">
		<v-form>
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
			<app-error v-if="error">{{error}}</app-error>
		</v-form>
	</v-card>
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
					await this.$AuthService.login(this.username, this.password);
				}catch(err){
					console.log(err)
					if (err.body){
						this.errors = err.body.message;
					}else{
						this.errors = err.message;
					}
				}
			}
		}
	}
</script>