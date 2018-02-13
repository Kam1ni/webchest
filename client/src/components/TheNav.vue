<template>
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
		<v-list-tile to="/users" v-if="$Auth.user.isAdmin" active-class="primary white--text">
			<v-list-tile-content>
				Users
			</v-list-tile-content>
		</v-list-tile>
		<v-list-tile @click="logout" active-class="primary white--text">
			<v-list-tile-content>
				Logout
			</v-list-tile-content>
		</v-list-tile>
	</v-list>
</template>

<script>
	export default {
		methods: {
			async logout(){
				try{
					await this.$Auth.logout();
				}catch(err){
					this.$Error.showHttpError(err);
				}
			},
		}
	}
</script>
