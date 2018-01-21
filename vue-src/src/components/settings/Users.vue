<template>
	<v-card>
		<v-card-text>
			<div class="headline secondary--text">Users:
				<v-btn round color="primary" to="/settings/users" small class="right"><v-icon>add</v-icon></v-btn>
			</div>
		</v-card-text>
		<v-list>
			<v-list-tile v-for="(user, i) in users" :key="i">
				<v-list-tile-title>
					{{user.username}}
				</v-list-tile-title>
				<v-list-tile-sub-title>
					<v-chip small color="primary" text-color="white" v-if="user.isAdmin" >Admin</v-chip>
				</v-list-tile-sub-title>
				<router-link :to="'/settings/users/' + user._id" tag="v-list-tile-action" style="cursor: pointer;">
					<v-icon>edit</v-icon>
				</router-link>
				<v-list-tile-action>
					<a @click="deleteUser(user, i)"><v-icon>delete</v-icon></a>
				</v-list-tile-action>
			</v-list-tile>
		</v-list>
	</v-card>
</template>

<script>
	export default {
		data(){
			return {users:[]};
		},
		methods: {
			async deleteUser(user, i){
				console.log("deleting");
				try{
					await this.userRes.delete({id:user._id});
					this.users.splice(i,1);
				}catch(err){
					console.log(err);
					this.$emit("error", err);
				}
			}
		},
		async created(){
			this.userRes = this.$resource("user{/id}");
			try{
				this.users = (await this.userRes.get()).body;
			}catch(err){
				this.$emit("error", err);
			}
		}
	}
</script>