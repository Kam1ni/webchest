<template>
	<v-layout row wrap fill-height>
		<v-flex xs12>
			<app-nav :current="dir">
				<app-upload-task-menu slot="toolbar-items" :tasks="tasks"/>
			</app-nav>
		</v-flex>
		<v-flex :teal="dragover" class="item-container" dark xs12 fill-height row @drop.prevent="onFileDrop" @dragleave="dragover=false" @dragover.prevent="dragover=true" @contextmenu.prevent="showMenu($event)">
			<v-list v-if="dir" style="background:transparent;">
				<v-list-tile @contextmenu.prevent.stop="showMenu($event, item, 'dir', index)" avatar v-for="(item, index) in dir.directories" :key="item._id" @click="openDir(item._id)">
					<v-list-tile-avatar>
						<v-icon>folder</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.name"></v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action @click.stop="downloadItem(item)">
						<v-icon>file_download</v-icon>
					</v-list-tile-action>
				</v-list-tile>
				<v-list-tile @contextmenu.prevent.stop="showMenu($event, item, 'file', index)" avatar v-for="(item, index) in dir.files" :key="item._id" @click.stop>
					<v-list-tile-avatar>
						<v-icon>insert_drive_file</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						<v-list-tile-title v-text="item.name"></v-list-tile-title>
					</v-list-tile-content>
					<v-list-tile-action @click.stop="downloadItem(item)">
						<v-icon>file_download</v-icon>
					</v-list-tile-action>
				</v-list-tile>
			</v-list>
		</v-flex>
		<app-context-menu :x="contextMenu.x" :y="contextMenu.y" v-model="contextMenu.show" :item="clickedItem.item" :type="clickedItem.type" @error="showError($event)" :dir="dir"></app-context-menu>
		<app-error v-model="error"></app-error>
	</v-layout>
</template>

<script>
	import ContextMenu from './ContextMenu.vue'
	import Nav from './Nav.vue';
	import UploadTaskMenu from './UploadTaskMenu.vue';
	import Dir from '../../classes/dir';
	import File from '../../classes/file';
	
	export default {
		data(){
			return {
				id: null,
				items: [{name: "Dir 1", id: 1}, {name: "Dir 2", id: 2}, {name: "Dir 3", id: 3}],
				dir: null,
				contextMenu:{
					show:false,
					x:0,
					y:0
				},
				clickedItem: {
					item: null,
					type: null,
					index: 0
				},
				error: "",
				dragover: false,
				tasks: []
			}
		},
		watch:{
			'$route': async function(){
				this.id = this.$route.params.id;
				try{
					this.dir = await Dir.getDirectory(this.id);
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
				this.contextMenu = {
					show: false,
					x: e.x,
					y: e.y
				};
				this.$nextTick(() => {
					this.contextMenu.show = true;
        		});
			},
			showError(err){
				if (err.body){
					this.error = err.body.message;
				}else{
					this.error = err.message;
				}
				console.log(err.stack);
			},
			async onFileDrop(event){
				this.dragover = false;
				let dt = event.dataTransfer;
				for (let file of dt.items){
					try{
						let entry = file.webkitGetAsEntry();
						if (entry.isFile){
							let uploader = new File.Uploader(entry, this.dir);
							let file = await uploader.upload();
							this.dir.files.push(file);
						}else{
							let uploader = new Dir.Uploader(entry, this.dir);
							await uploader.prepareUploader();
							this.tasks.push(uploader);
							uploader.on("done", ()=>{
								setTimeout(()=>{
									this.tasks.splice(this.tasks.indexOf(uploader), 1);
								}, 3000);
							});
							let directory = await uploader.upload();
							this.dir.directories.push(directory);
						}
					}catch(err){
						this.showError(err);
					}
				}
			},
			async downloadItem(item){
				console.log("Downloading");
				try{
					await item.download();
				}catch(err){
					console.log(err);
					this.showError(item);
				}
			}
		},
		async created(){
			this.id = this.$route.params.id;
			this.dirResource = this.$resource('dir{/id}');
			try{
				this.dir = await Dir.getDirectory(this.id);
			}catch(err){
				console.log(err);
			}
			this.fileResource = this.$resource('file{/id}');
		},
		components:{
			'app-nav':Nav,
			'app-context-menu': ContextMenu,
			'app-upload-task-menu':UploadTaskMenu
		}
	}
</script>

<style scoped>
	#contextMenu{
		position: absolute;
		display: block;
	}
	.item-container{
		transition: background-color 0.25s;
	}
</style>
