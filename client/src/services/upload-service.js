import Vue from 'vue';
import Dir from '../classes/dir';
import File from '../classes/file';

export default {
	install(Vue, options){
		Vue.prototype.$Uploader = new Vue({
			data(){
				return {uploads:[]}
			},
			methods:{
				async dropUpload(event){
					let dt = event.dataTransfer;
					for (let file of dt.items){
						let entry = file.webkitGetAsEntry();
						if (entry.isFile){
							let uploader = new File.Uploader(entry, this.dir);
							let file = await uploader.upload();
						}else{
							let uploader = new Dir.Uploader(entry, this.dir);
							await uploader.prepareUploader();
							this.uploads.push(uploader);
							uploader.on("done", ()=>{
								setTimeout(()=>{
									this.uploads.splice(this.uploads.indexOf(uploader), 1);
								}, 3000);
							});
							let directory = await uploader.upload();
						}
					}
				},
				async upload(item){

				}
			}
		});
	}
}