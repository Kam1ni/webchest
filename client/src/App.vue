<template>
	<v-app style="overflow: hidden">
		<template v-if="loggedIn">
			<v-navigation-drawer app clipped fixed v-model="drawer">
				<v-list>
					<v-list-tile to="/storage" active-class="primary white--text">
						<v-list-tile-content>
							Storage
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile to="/settings" active-class="primary white--text">
						<v-list-tile-content>
							Settings
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile @click="logout" active-class="primary white--text">
						<v-list-tile-content>
							Logout
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-navigation-drawer>

			<v-toolbar app fixed clipped-left class="primary" dark>
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        		<span class="hidden-xs-only">MEVN-drive</span>
			</v-toolbar>

			<v-content>
				<transition name="slide-x-transition" mode="out-in">
					<router-view/>
				</transition>
			</v-content>
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
			loggedIn: false,
			drawer: null
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
