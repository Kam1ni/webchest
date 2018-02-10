<template>
	<transition name="slide-y-transition">
		<v-menu offset-y v-model="show" absolute :position-x="x" :left="left"  :bottom="bottom" :position-y="y">
			<v-list>
				<v-list-tile @click="newDir()">
					<v-list-tile-avatar>
						<v-icon>folder</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						New Folder
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="renameClicked()" v-if="item">
					<v-list-tile-avatar>
						<v-icon>mode_edit</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						Rename
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="moveClicked()" v-if="item">
					<v-list-tile-avatar>
						<v-icon>reply</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						Move
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="deleteItem()" v-if="item">
					<v-list-tile-avatar>
						<v-icon>delete</v-icon>
					</v-list-tile-avatar>
					<v-list-tile-content>
						Delete
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
			<app-text-field-dialog v-model="textEditField.show" :title="textEditField.title" :label="textEditField.label" @submit="textEditField.submit"></app-text-field-dialog>
			<app-nav-dialog v-model="navigationMenu.show" @submit="navigationMenu.submit" :title="navigationMenu.title" :submitButton="navigationMenu.submitButton"></app-nav-dialog>
		</v-menu>
	</transition>
</template>

<script>
	import TextFieldDialogVue from '../common/TextFieldDialog.vue';
	import NavDialog from '../common/NavigationDialog.vue';
	import Dir from '../../classes/dir';
	import File from '../../classes/file';

	export default {
		data(){
			return {
				show: false,
				left: false,
				bottom: false,
				navigationMenu:{
					show:false,
					submit(){

					},
					title: "Move item",
					submitButton: "Move here"
				},
				textEditField:{
					show: false,
					submit(){
					},
					title: "",
					label: ""
				}
			}
		},
		watch: {
			value(newVal, oldVal){
				this.show = newVal;
			},
			show(newVal, oldVal){
				this.$emit("input", this.show);
			},
			x(){
				this.left = this.x > window.innerWidth / 2;
			},
			y(){
				this.bottom = this.y > window.innerHeight / 2;
			}
		},
		props:['x','y','item','value', "dir"],
		methods:{
			newDir(){
				this.textEditField.submit = async (e) => {
					let dir = new Dir({name :e, parent: this.id});
					try{
						await dir.save();
						this.dir.directories.push(dir);
						console.log(dir);
					}catch(err){
						this.$Error.showHttpError(err);
					}
				}
				this.textEditField.title = "New Folder";
				this.textEditField.label = "Folder name";
				this.textEditField.show = true;
			},
			renameClicked(){
				this.textEditField.submit = async (e) => {
					try{
						await this.item.rename(e);
					}catch(err){
						this.$Error.showHttpError(err);
					}
				}
				this.textEditField.title = `Rename "${this.item.name}"`;
				this.textEditField.label = "New name";
				this.textEditField.show = true;
			},
			moveClicked(){
				this.navigationMenu.submit = async (e) =>{
					try{
						await this.item.move(e);
						this.dir.removeItem(this.item);
					}catch(err){
						this.$Error.showHttpError(err);
					}
				}
				this.navigationMenu.title = `Move ${this.item.name}`;
				this.navigationMenu.show = true;
			},
			async deleteItem(){
				try{
					console.log(this.item);
					await this.item.delete();
					this.dir.removeItem(this.item);
				}catch(err){
					this.$Error.showHttpError(err);
				}
			}
		},components:{
			'app-text-field-dialog':TextFieldDialogVue,
			'app-nav-dialog': NavDialog
		}
	}
</script>
