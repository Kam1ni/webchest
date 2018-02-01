<template>
	<v-container fluid grid-list-xs>
		<v-layout row>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						Users:
					</v-card-title>
					<v-list>
						<v-list-tile v-for="(user, i) in users" :key="i">
							<v-list-tile-content>
								{{user.username}}
							</v-list-tile-content>
							<v-list-tile-action style="cursor:pointer;" @click="editUser(user._id)">
								<v-icon >edit</v-icon>
							</v-list-tile-action>
							<v-list-tile-action style="cursor:pointer;" @click="deleteUser(user, i)">
								<v-icon>delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card>
			</v-flex>
		</v-layout>
		<v-btn fab right bottom fixed color="primary" to="/users/edit"><v-icon>add</v-icon></v-btn>
	</v-container>
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
			},
			editUser(userId){
				this.$router.push({path: "/users/edit/" + userId});
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