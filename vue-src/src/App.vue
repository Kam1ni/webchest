<template>
	<v-app>
		<template v-if="loggedIn">
			<v-toolbar app color="teal darken-4" dark>
				<v-toolbar-title>MEVN-Drive</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-btn flat @click="logout">Logout</v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<router-view/>
		</template>
		<v-layout row justify-center wrap align-center class="teal-background" fill-height v-if="!loggedIn">
			<v-flex xs10 sm8 md6>
				<app-login @login="onLogin"></app-login>
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
		onLogin(event){
			localStorage.setItem("token", event);
			this.loggedIn = true;
		},
		logout(){
			this.loggedIn = false;
			localStorage.clear();
		}
	},
	created(){
		if (localStorage.getItem("token")){
			this.loggedIn = true;
		}
	}
}
</script>

<style>
.teal-background{
	background-color: #004d40;
}
</style>
