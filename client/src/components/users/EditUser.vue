<template>
	<v-dialog v-model="show" max-width="500" persistent>
		<slot name="activator" slot="activator"/>
		<v-toolbar>
			<v-toolbar-title>
				{{title}}
			</v-toolbar-title>
		</v-toolbar>
		<v-card v-if="user">
			<v-card-text>
				<v-container grid-list-md>
					<v-layout wrap>
						<v-flex xs12 sm6>
							<v-text-field v-model="user.username" label="Username"></v-text-field>
						</v-flex>
						<v-flex xs12 sm6>
							<v-text-field v-model="user.password" label="Password"></v-text-field>
						</v-flex>
						<v-flex xs12>
							<v-layout wrap>
								<v-flex xs6>
									<v-text-field label="Max Space" type="number" v-model="maxSpace"></v-text-field>
								</v-flex>
								<v-flex xs6>
									<v-select :items="multipliers" v-model="maxSpaceMultiplier"></v-select>
								</v-flex>
							</v-layout>
						</v-flex>
						<v-flex xs12>
							<v-checkbox label="Admin?" v-model="user.isAdmin"/>
						</v-flex>
					</v-layout>
				</v-container>
			</v-card-text>
			<v-divider/>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click.native="save">Save</v-btn>
				<v-btn flat @click.native="cancel">Cancel</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		data(){
			return {
				show:false,
				user:null,
				maxSpaceMultiplier: 1,
				multipliers:[
					{text:"bytes", value:1},
					{text:"kB", value:1000},
					{text:"MB", value:1000000},
					{text:"GB", value:1000000000},
					{text:"TB", value:1000000000000}
				]
			}
		},
		watch:{
			async value(newVal, oldVal){
				console.log(newVal, oldVal);
				if (newVal == ""){
					this.show = true;
					this.user = {};
				}
				else if (newVal){
					try{
						this.show = true;
						this.user = (await this.userRes.get({id:newVal})).body;
					}catch(err){
						this.show = false;
						this.$emit("error", err);
					}
				}
				else{
					this.show = false;
				}
			},
			show(newVal, oldVal){
				if (!newVal)
					this.$emit("input", null);
			}
		},
		methods:{
			async save(){
				try{
					if (this.user._id){
						if (this.user.password == "" != this.user.password == null){
							this.user.password = undefined;
						}
						await this.userRes.update({id: this.user._id}, this.user);
					}else{
						await this.userRes.save({},this.user);
					}
					this.$emit("input", "updated");
				}catch(err){
					console.log(err);
				}
			},
			cancel(){
				this.$emit("input", null);
			}
		},
		computed:{
			title(){
				return this.value == "" ? "New User" : "Edit User";
			},
			maxSpace:{
				get(){
					return this.user.maxSpace / this.maxSpaceMultiplier;
				},
				set(value){
					this.user.maxSpace = value*this.maxSpaceMultiplier;
				}
			}
		},
		props: ["value"],
		created(){
			this.userRes = this.$resource("user{/id}");
		}
	}
</script>
