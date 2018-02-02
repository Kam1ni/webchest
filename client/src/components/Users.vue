<template>
		<v-layout row>
			<v-flex xs12>
				<v-card>
					<v-card-title>
						Users
					</v-card-title>
					<v-list>
						<v-list-tile v-for="(user, i) in users" :key="i">
							<v-list-tile-content>
								{{user.username}}
							</v-list-tile-content>
							<v-list-tile-action >
								<v-icon style="cursor:pointer;" @click="editUser(user)">edit</v-icon>
							</v-list-tile-action>
							<v-list-tile-action>
								<v-icon style="cursor:pointer;" @click="confirmDeleteUser(user)">delete</v-icon>
							</v-list-tile-action>
						</v-list-tile>
					</v-list>
				</v-card>
			</v-flex>
			<app-confirm-dialog v-model="showDeleteUser" @yes="deleteUser" title="Warning">
				<span v-if="toDeleteUser">Are you sure you want to delete {{toDeleteUser.name}}</span>
			</app-confirm-dialog>
			<app-edit-user v-model="editUserId"/>
			<v-btn fab right bottom fixed color="primary" @click="addUser"><v-icon>add</v-icon></v-btn>
		</v-layout>
</template>

<script>
	import EditUser from './users/EditUser.vue';
	export default {
		data(){
			return {
				users:[],
				editUserId: null,
				showDeleteUser: false,
				toDeleteUser: null
			};
		},
		watch:{
			editUserId(newVal, oldVal){
				if (newVal == "updated"){
					this.editUserId = null;
					this.getUsers();
				}
			}
		},
		computed:{
			maxSpace:{
				get(){
					return this.user.maxSpace / this.maxSpaceMultiplier;
				},
				set(value){
					this.user.maxSpace = value*this.maxSpaceMultiplier;
				}
			}
		},
		methods: {
			confirmDeleteUser(user){
				this.toDeleteUser = user; 
				this.showDeleteUser = true;
			},
			async deleteUser(){
				console.log("deleting");
				try{
					await this.userRes.delete({id:this.toDeleteUser._id});
				}catch(err){
					console.log(err);
					this.$emit("error", err);
				}
				this.toDeleteUser = null;
				this.getUsers();
			},
			editUser(user){
				this.editUserId = user._id;
			},
			addUser(){
				this.editUserId = "";
			},
			async getUsers(){
				try{
					this.users = (await this.userRes.get()).body;
				}catch(err){
					this.$emit("error", err);
				}
			}
		},
		created(){
			this.userRes = this.$resource("user{/id}");
			this.getUsers();
		},
		components:{
			"app-edit-user":EditUser
		}
	}
</script>