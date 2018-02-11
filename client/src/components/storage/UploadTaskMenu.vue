<template>
	<div>
		<v-menu offset-y :nudge-width="300">
			<v-icon slot="activator" class="clickable">file_upload</v-icon>
			<v-toolbar>
				<v-toolbar-title>Uploads</v-toolbar-title>
			</v-toolbar>
			<v-card>
				<v-card-text>
					<span v-if="tasks.length == 0">No tasks panding!</span>
					<v-list v-else>
						<v-list-tile v-for="(task, i) in tasks" :key="i">

						</v-list-tile>
					</v-list>
				</v-card-text>
				<v-divider/>
				<v-card-actions>
					<input multiple type="file" webkitdirectory directory @change="onFileChange($event)" @click.stop class="inputfile"/>
					<v-btn @click.stop="upload" flat v-if="files.length > 0">Upload</v-btn>
				</v-card-actions>
			</v-card>
		</v-menu>
		<v-progress-circular v-if="showProgressBar" color="teal" :value="totalProgress" :rotate="-90">{{totalProgress}}</v-progress-circular>
	</div>
</template>

<script>
	export default {
		data(){
			return {show:false, menu:true, files: []};
		},
		watch:{
			show(newVal, oldVal){
				this.$emit("input", newVal);
			},
			value(newVal, oldVal){
				this.show = newVal;
			}
		},
		computed:{
			totalProgress(){
				return Math.round(this.tasks.reduce(function(total, val){return total + val.progressPercent},0));
			},
			showProgressBar(){
				return this.tasks.length > 0;
			}
		},
		methods:{
			onFileChange(event){
				console.log(event.target.files);
				this.files = event.target.files;
			},
			upload(){
				
			}
		},
		props: ["value", "tasks"]
	}
</script>
