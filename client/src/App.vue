<template>
	<v-app>
		<template v-if="loggedIn">
			<AppNav v-model="drawer" :user="user"/>
			<AppHeader @drawer="drawer = !drawer"/>
			
			<v-content>
				<transition name="slide-x-transition" mode="out-in">
					<router-view/>
				</transition>
			</v-content>
		</template>

		<app-login  v-else></app-login>
	</v-app>
</template>

<script>
import Login from './components/login/Login.vue';
import Nav from './components/TheNav.vue';
import Header from './components/TheHeader.vue';

export default {
	name: 'App',
	data(){
		return {
			loggedIn: false,
			drawer: null,
			user: null
		}
	},
	components: {
		'app-login': Login,
		'AppNav': Nav,
		'AppHeader': Header
	},
	created(){
		this.loggedIn = this.$AuthService.isLoggedIn();
		this.user = this.$AuthService.user;
		this.$AuthService.on("user", (user)=>{
			this.loggedIn = this.$AuthService.isLoggedIn();
			this.user = this.$AuthService.user;
		});
	}
}
</script>
