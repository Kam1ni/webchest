<template>
	<v-container v-if="user" fluid>
		<v-layout row wrap>
			<v-flex xs12>
				<app-profile :user="user" @error="error = $event"></app-profile>
			</v-flex>
			<v-flex xs12 mt-4>
				<app-users v-if="user.isAdmin" @error="error = $event"></app-users>
			</v-flex>
		</v-layout>
		<app-error v-model="error"></app-error>
	</v-container>
</template>

<script>
	import AppProfile from './settings/Profile.vue';
	import AppUsers from './settings/Users.vue';

	export default {
		data(){
			return {
				user: null,
				error: null
			}
		},
		created(){
			this.user = this.$AuthService.user;
			this.$AuthService.on("login", (user)=>{
				this.user = user;
			});
		},
		components:{
			'app-profile':AppProfile,
			'app-users':AppUsers
		}
	}
</script>
