<template>
		<v-container fluid style="padding: 0px;">
			<v-layout row wrap>
				<v-flex xs12>
					<v-breadcrumbs divider="/">
						<v-breadcrumbs-item :large="true" v-for="item in history" :key="item._id">
							{{item.name}}
						</v-breadcrumbs-item>
					</v-breadcrumbs>
				</v-flex>
			</v-layout>
			<v-layout row wrap fill-height @contextmenu.prevent="openMenu($event)" @click="closeContextMenu()">
				<v-flex xs12 fill-height>
					<v-list class="fill-height" v-if="dir">
						<v-list-tile avatar v-for="item in dir.directories" :key="item._id" @click="openDir(item._id)">
							<v-list-tile-avatar>
								<v-icon>folder</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title v-text="item.name"></v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile avatar v-for="item in dir.files" :key="item._id" @click="openDir(item._id)">
							<v-list-tile-avatar>
								<v-icon>file</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title v-text="item.name"></v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
				</v-flex>
				<v-card id="contextMenu" v-if="contextMenuOpen" @blur.native="closeContextMenu()" :style="contextStyle">
					<v-list>
						<v-list-tile @click="newDirClicked()">
							<v-list-tile-avatar>
								<v-icon>folder</v-icon>
							</v-list-tile-avatar>
							<v-list-tile-content>
								New Folder
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
				</v-card>
			</v-layout>
		</v-container>
</template>

<script>
	export default {
		data(){
			return {
				id: null,
				items: [{name: "Dir 1", id: 1}, {name: "Dir 2", id: 2}, {name: "Dir 3", id: 3}],
				dir: null,
				history: [{name:"root", _id:""}],
				contextMenuOpen: false,
				contextStyle: {
					top: 0,
					left: 0
				}
			}
		},
		watch:{
			'$route': async function(){
				this.id = this.$route.params.id;
				try{
					this.dir = await this.dirResource.get({id:this.id}).body;
				}catch(err){
					console.log(err);
				}
        	}
		},
		methods:{
			openDir(id){
				this.$router.push({path:'/storage/' + id});
				console.log()
			},
			openMenu(event){
				this.contextMenuOpen = true;
				this.contextStyle.top = event.y + "px";
				this.contextStyle.left = event.x + "px";
			},
			closeContextMenu(){
				this.contextMenuOpen=false;
			},
			async newDirClicked(){
				console.log("new Dir clicked");
			}
		},
		async created(){
			this.dirResource = this.$resource('dir{/id}');
			try{
				let response = await this.dirResource.get({id:this.id});
				console.log(response);
				this.dir = response.body;
				console.log(this.dir);
			}catch(err){
				console.log(err);
			}
		}

	}
</script>

<style scoped>
	#contextMenu{
		position: absolute;
		display: block;
	}
</style>
