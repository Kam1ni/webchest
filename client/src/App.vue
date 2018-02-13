<template>
	<v-app>
		<template v-if="$Auth.user">
		  	<v-navigation-drawer app clipped fixed v-model="drawer">
				<AppNav/>
			</v-navigation-drawer>
			
			<AppHeader @drawer="drawer = !drawer"/>
			<v-content>
				<transition name="slide-x-transition" mode="out-in">
					<router-view/>
				</transition>
			</v-content>
		</template>
		<app-login  v-else></app-login>
		<AppError/>
	</v-app>
</template>

<script>
import Login from './components/login/Login.vue';
import Nav from './components/TheNav.vue';
import Header from './components/TheHeader.vue';
import Err from './components/TheError.vue'

export default {
	name: 'App',
	data(){
		return {
			drawer: null,
		}
	},
	components: {
		'app-login': Login,
		'AppNav': Nav,
		'AppHeader': Header,
		'AppError': Err
	}
}
</script>
