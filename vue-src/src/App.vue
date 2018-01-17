<template>
	<v-app>
		<div v-if="loggedIn">
			<v-toolbar app color="teal darken-4" dark>
				<v-toolbar-title>MEVN-Drive</v-toolbar-title>
			</v-toolbar>
			<v-content>
				<v-container fluid>
					<router-view/>
				</v-container>
			</v-content>
			<v-footer app>

			</v-footer>
		</div>
		<v-layout row justify-center wrap align-center class="teal-background" fill-height>
			<v-flex xs10 sm8 md6>
				<app-login v-if="!loggedIn"></app-login>
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
	}
}
</script>

<style>
.teal-background{
	background-color: #004d40;
}
</style>
