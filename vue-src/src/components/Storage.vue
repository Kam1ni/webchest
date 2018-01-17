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
			<v-layout row wrap fill-height >
				<v-flex xs12 fill-height @contextmenu.prevent="showMenu($event)">
					<v-list class="fill-height" v-if="dir" >
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
				<v-menu offset-y v-model="showContextMenu" absolute :position-x="contextX" :position-y="contextY">
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
				</v-menu>
				<app-text-field-dialog v-model="textEditField.show" :title="textEditField.title" :label="textEditField.label" @submit="textEditField.submit"></app-text-field-dialog>
			</v-layout>
		</v-container>
</template>

<script>
	import TextFieldDialogVue from './common/TextFieldDialog.vue';

	export default {
		data(){
			return {
				id: null,
				items: [{name: "Dir 1", id: 1}, {name: "Dir 2", id: 2}, {name: "Dir 3", id: 3}],
				dir: null,
				history: [{name:"root", _id:""}],
				showContextMenu: false,
				contextX: 0,
				contextY: 0,
				textEditField:{
					show: false,
					submit(){
					},
					title: "",
					label: ""
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
			showMenu(e){
				this.showContextMenu = false;
				this.contextX = e.x;
				this.contextY = e.y;
				this.$nextTick(() => {
          			this.showContextMenu = true
        		});
			},
			newDirClicked(){
				console.log("new Dir clicked");
				this.textEditField.submit = async (e) => {
					let dir = {name :e, parent: this.id};
					console.log(dir);
					try{
						let response = await this.dirResource.save({}, dir);
						console.log(response);
						this.dir.directories.push(response);
					}catch(err){
						console.log(err.body.message);
					}
				}
				this.textEditField.title = "New Folder";
				this.textEditField.label = "Folder name";
				this.textEditField.show = true;
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
		},
		components:{
			'app-text-field-dialog':TextFieldDialogVue
		}
	}
</script>

<style scoped>
	#contextMenu{
		position: absolute;
		display: block;
	}
</style>
