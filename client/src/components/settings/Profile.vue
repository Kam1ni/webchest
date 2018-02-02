<template>
	<v-card>
		<v-card-text>
			<div class="headline secondary--text">Profile:</div>
			<div>
				Username: {{user.username}}
			</div>
			<v-expansion-panel>
				<v-expansion-panel-content>
					<div slot="header" class="secondary--text">
						Change Password
					</div>
					<v-container>
						<v-form v-model="password.valid" @submit="changePassword">
							<v-text-field v-model="password.currentPassword" label="Current Password" type="password"></v-text-field>
							<v-text-field v-model="password.newPassword" label="New Password" type="password"></v-text-field>
							<v-text-field v-model="password.repeatPassword" :rules="password.repeatPassRule" label="Repeat new Password" type="password"></v-text-field>
							<v-btn @click.stop="changePassword()">Change password</v-btn>
						</v-form>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>
			<v-expansion-panel>
				<v-expansion-panel-content>
					<div slot="header" class="secondary--text">
						Logged in devices
					</div>
					<v-container>
						<v-list>
							<v-list-tile v-for="(token, i) in user.tokens" :key="i" v-if="token.token != $AuthService.token">
								<v-list-tile-content>
									{{token.deviceName}}
								</v-list-tile-content>
								<v-list-tile-avatar @click="removeToken(token.token)">
									<v-icon>delete</v-icon>
								</v-list-tile-avatar>
							</v-list-tile>
						</v-list>
					</v-container>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-card-text>
	</v-card>
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
				}
			}
		},
		methods:{
			async changePassword(){
				try{
					await this.$AuthService.changePassword(this.password.currentPassword, this.password.newPassword);
				}catch(err){
					this.$emit("error", err);
				}
			},
			async removeToken(token){
				try{
					await this.$AuthService.removeToken(token);
				}catch(err){
					this.$emit("error", err)
				}
			}
		},
		props:["user"]
	}
</script>