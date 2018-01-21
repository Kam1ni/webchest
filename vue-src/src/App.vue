<template>
	<v-app style="overflow: hidden">
		<template v-if="loggedIn">
			<v-toolbar app color="teal darken-4" dark>
				<v-toolbar-title>MEVN-Drive</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat to="/storage">Storage</v-btn>
					<v-btn flat to="/settings">Settings</v-btn>
					<v-btn flat @click="logout">Logout</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<router-view/>
		</template>
		<v-layout row justify-center wrap align-center class="teal-background" fill-height v-if="!loggedIn">
			<v-flex xs10 sm8 md6>
				<app-login></app-login>
			</v-flex>
		</v-layout>
	</v-app>
</template>

<script>
import Login from './components/Login.vue';

export default {
	name: 'App',
	data(){
		return {
			loggedIn: false
		}
	},
	components: {
		'app-login': Login
	},
	methods: {
		async logout(){
			try{
				await this.$AuthService.logout();
			}catch(err){

			}
		},
		profile(){
			this.$router.push("/profile");
		}
	},
	created(){
		this.loggedIn = this.$AuthService.isLoggedIn();
		this.$AuthService.on("login", (user)=>{
			this.loggedIn = true;
		});
		this.$AuthService.on("logout", ()=>{
			this.loggedIn = false;
		});
	}
}
</script>

<style>
.teal-background{
	background-color: #004d40;
}
</style>
