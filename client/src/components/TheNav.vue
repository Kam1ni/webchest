<template>
  	<v-navigation-drawer v-if="$Auth.user" app clipped fixed v-model="drawer">
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
	</v-navigation-drawer>
</template>

<script>
	export default {
		data(){
			return {drawer: false};
		},
		watch:{
			value(newVal){
				this.drawer = newVal;
			},
			drawer(newVal){
				this.$emit("input", newVal);
			}
		},
		props: ["value"],
		methods: {
			async logout(){
				try{
					await this.$Auth.logout();
			}catch(err){
				
				}
			},
		}
	}
</script>
