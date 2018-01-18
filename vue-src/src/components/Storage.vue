<template>
	<v-container fluid style="padding: 0px;" @contextmenu.prevent="showMenu($event)">
		<app-nav :current="dir"/>
		<v-layout row wrap >
			<v-flex xs12>
				<v-list v-if="dir">
					<v-list-tile @contextmenu.prevent.stop="showMenu($event, item, 'dir', index)" avatar v-for="(item, index) in dir.directories" :key="item._id" @click="openDir(item._id)">
						<v-list-tile-avatar>
							<v-icon>folder</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-text="item.name"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile @contextmenu.prevent.stop="showMenu($event, item, 'file', index)" avatar v-for="(item, index) in dir.files" :key="item._id" @click="openDir(item._id)">
						<v-list-tile-avatar>
							<v-icon>file</v-icon>
						</v-list-tile-avatar>
						<v-list-tile-content>
							<v-list-tile-title v-text="item.name"></v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-flex>
			<app-context-menu :x="contextX" :y="contextY" v-model="showContextMenu" :item="clickedItem.item" :type="clickedItem.type" @delete="deleteClicked" @rename="renameClicked" @new-dir="newDirClicked" @move="moveClicked"></app-context-menu>
			<app-text-field-dialog v-model="textEditField.show" :title="textEditField.title" :label="textEditField.label" @submit="textEditField.submit"></app-text-field-dialog>
			<app-nav-dialog v-model="navigationMenu.show" @submit="navigationMenu.submit" :title="navigationMenu.title" :submitButton="navigationMenu.submitButton"></app-nav-dialog>
		</v-layout>
	</v-container>
</template>

<script>
	import TextFieldDialogVue from './common/TextFieldDialog.vue';
	import ContextMenu from './storage/ContextMenu.vue'
	import Nav from './storage/Nav.vue';
	import NavDialog from './common/NavigationDialog.vue';

	export default {
		data(){
			return {
				id: null,
				items: [{name: "Dir 1", id: 1}, {name: "Dir 2", id: 2}, {name: "Dir 3", id: 3}],
				dir: null,
				showContextMenu: false,
				contextX: 0,
				contextY: 0,
				textEditField:{
					show: false,
					submit(){
					},
					title: "",
					label: ""
				},
				clickedItem: {
					item: null,
					type: null,
					index: 0
				},
				navigationMenu:{
					show:false,
					submit(){

					},
					title: "Move item",
					submitButton: "Move here"
				}
			}
		},
		watch:{
			'$route': async function(){
				this.id = this.$route.params.id;
				try{
					this.dir = (await this.dirResource.get({id:this.id})).body;
				}catch(err){
					console.log(err);
				}
        	}
		},
		methods:{
			openDir(id){
				this.$router.push({path:'/storage/' + id});
			},
			showMenu(e, item, type, index){
				this.clickedItem.item = item;
				this.clickedItem.type = type;
				this.clickedItem.index = index;
				this.showContextMenu = false;
				this.contextX = e.x;
				this.contextY = e.y;
				this.$nextTick(() => {
          			this.showContextMenu = true
        		});
			},
			newDirClicked(){
				this.textEditField.submit = async (e) => {
					let dir = {name :e, parent: this.id};
					console.log(dir);
					try{
						let response = await this.dirResource.save({}, dir);
						console.log(response);
						this.dir.directories.push(response.body);
					}catch(err){
						this.showError(err);
					}
				}
				this.textEditField.title = "New Folder";
				this.textEditField.label = "Folder name";
				this.textEditField.show = true;
			},
			renameClicked(){
				this.textEditField.submit = async (e) => {
					let oldName = this.clickedItem.item.name;
					this.clickedItem.item.name = e;
					try{
						if (this.clickedItem.type == 'dir'){
							this.dir.directories[this.clickedItem.index] = await this.dirResource.update({id:this.clickedItem.item._id}, this.clickedItem.item);
						}else {
							this.dir.files[this.clickedItem.index] = await this.fileResource.update({id:this.clickedItem.item._id}, this.clickedItem.item);
						}
					}catch(err){
						this.clickedItem.item.name = oldName;
						this.showError(err);
					}
				}
				this.textEditField.title = `Rename "${this.clickedItem.item.name}"`;
				this.textEditField.label = "New name";
				this.textEditField.show = true;
			},
			moveClicked(){
				this.navigationMenu.submit = async (e) =>{
					if (e._id != this.dir._id){
						if (e._id == undefined){
							e._id = null;
						}
						let oldParent = this.clickedItem.item.parent;
						this.clickedItem.item.parent = e._id;
						try{
							if (this.clickedItem.type == 'dir'){
								await this.dirResource.update({id:this.clickedItem.item._id}, this.clickedItem.item);
								this.dir.directories.splice(this.clickedItem.index,1);
							}else {
								await this.fileResource.update({id:this.clickedItem.item._id}, this.clickedItem.item);
								this.dir.files.splice(this.clickedItem.index,1);
							}
						}catch(err){
							this.clickedItem.item.parent = oldParent;
							this.showError(err);
						}
					}
				}
				this.navigationMenu.title = `Move ${this.clickedItem.item.name}`;
				this.navigationMenu.show = true;
			},
			async deleteClicked(){
				try{
					if (this.clickedItem.type == 'file'){
						await this.fileResource.delete({id: this.clickedItem.item._id})
					}else{
						await this.dirResource.delete({id:this.clickedItem.item._id})
						this.dir.directories.splice(this.dir.directories.indexOf(this.clickedItem.item), 1);
					}
				}catch(err){
					this.showError(err);
				}
			},
			showError(err){
				console.log(err.body.message || err.message);
			}
		},
		async created(){
			this.id = this.$route.params.id;
			this.dirResource = this.$resource('dir{/id}');
			try{
				let response = await this.dirResource.get({id:this.id});
				this.dir = response.body;
			}catch(err){
				console.log(err);
			}
			this.fileResource = this.$resource('file{/id}');
		},
		components:{
			'app-text-field-dialog':TextFieldDialogVue,
			'app-nav':Nav,
			'app-context-menu': ContextMenu,
			'app-nav-dialog': NavDialog
		}
	}
</script>

<style scoped>
	#contextMenu{
		position: absolute;
		display: block;
	}
</style>
