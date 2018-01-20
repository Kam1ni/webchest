<template>
	<v-container v-if="$AuthService.user">
		<v-layout row wrap>
			<v-flex xs12>
				<v-card>
					<v-card-text>
						<div class="headline secondary--text">Security:</div>
						<div>
							Username: {{$AuthService.user.username}}
						</div>
						<v-expansion-panel>
							<v-expansion-panel-content>
								<div slot="header" class="secondary--text">
									Change Password
								</div>
								<v-container>
									<v-form v-model="password.valid" @submit="changePassword">
										<v-text-field v-model="password.currentPassword" label="Current Password"></v-text-field>
										<v-text-field v-model="password.newPassword" label="New Password"></v-text-field>
										<v-text-field v-model="password.repeatPassword" :rules="password.repeatPassRule" label="Repeat new Password"></v-text-field>
										<v-btn @click.stop="changePassword()">Change password</v-btn>
									</v-form>
								</v-container>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
		<app-error v-model="error"></app-error>
	</v-container>
</template>

<script>
	export default {
		data(){
			return {
				password:{
					valid: false,
					currentPassword: "",
					newPassword: "",
					repeatPassword: "",
					repeatPassRule: [
						(v) => {
							return v == this.password.newPassword || "Passwords don't match";
						}
					]
				},
				error: null
			}
		},
		methods:{
			async changePassword(){
				try{
					await this.$AuthService.changePassword(this.password.currentPassword, this.password.newPassword);
				}catch(err){
					console.log(err);
					if (err.body){
						this.error = err.body.message;
					}else{
						this.error = err.message;
					}
				}
			}
		}
	}
</script>
