<template>
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
			<v-list-tile @click="deleteItem()" v-if="item">
				<v-list-tile-avatar>
					<v-icon>delete</v-icon>
				</v-list-tile-avatar>
				<v-list-tile-content>
					Delete
				</v-list-tile-content>
			</v-list-tile>
		</v-list>
	</v-menu>
</template>

<script>
	export default {
		data(){
			return {
				show: false,
				left: false,
				bottom: false
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
		props:['x','y','item','value','type'],
		methods:{
			newDir(){
				this.$emit("new-dir");
			},
			deleteItem(){
				this.$emit("delete");
			}
		}
	}
</script>
