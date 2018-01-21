<template>
	<v-dialog v-model="value" scrollable max-width="700px">
		<v-card>
			<v-card-title>
				<div>
					<div class="headline">
						{{title}}
					</div>
					<div>
						/<a @click="hisDirClicked({_id:null}, 0)">root</a>
						<template v-for="(dir, index) in history">
							/
							<a @click="hisDirClicked(dir, index+1)" :key="dir._id">{{dir.name}}</a>
						</template>
					</div>
				</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text style="height: 400px">
				<v-list v-if="dir">
					<v-list-tile v-for="directory in dir.directories" :key="directory._id" @click="dirClicked(directory)">
						<v-list-tile-avatar>
							<v-icon>folder</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-title>
							{{directory.name}}
						</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn flat @click="submit">{{submitButton}}</v-btn>
				<v-btn flat @click="cancel">Cancel</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		data(){
			return {
				dir: null,
				history: []
			};
		},
		watch:{
			async value(newVal, oldVal){
				if (newVal && newVal != oldVal){
					this.history = [];
					this.dirResource = this.$resource("dir{/id}");
					try{
						let response = await this.dirResource.get({});
						this.dir = response.body;
					}catch(err){
						console.log(err.body.message);
					}
				}
			}
		},
		methods:{
			async dirClicked(dir){
				try{
					let response = await this.dirResource.get({id:dir._id});
					response = response.body;
					console.log(response);
					this.dir = response;
					this.history.push({_id:response._id, name:response.name});
				}catch(err){
					console.log(err);
				}
			},
			async hisDirClicked(dir, index){
				try{
					let response = await this.dirResource.get({id:dir._id});
					this.dir = response.body;
					this.history.splice(index, 1);
				}catch(err){
					console.log(err.body.message);
				}
			},
			submit(){
				this.$emit("input", false);
				this.$emit("submit", this.dir);
			},
			cancel(){
				this.$emit("input", false);
				this.textValue = "";
			}
		},
		props:["title", "value", "submitButton"]
	}
</script>
