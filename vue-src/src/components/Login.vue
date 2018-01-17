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
			<v-snackbar v-model="showError" :right="true" :top="true" :timeout="4000">
				{{errorMessage}}
			</v-snackbar>
		</v-form>
	</v-card>
</template>

<script>
	export default {
		data(){
			return {
				username: "",
				password: "",
				errorMessage: "Error message",
				showError: false				
			}
		},
		methods:{
			async login(){
				try{
					console.log("Logging in");
					let response = await this.$http.post("auth/login", {username: this.username, password: this.password});
					console.log(response);
					console.log(response.body.token);
					this.$emit("login", response.body.token);
				}catch(err){
					console.log(err)
					this.errorMessage = err.body.message;
					this.showError = true;
				}
			}
		}
	}
</script>