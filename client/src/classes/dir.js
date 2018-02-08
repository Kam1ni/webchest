import Vue from 'vue';
import File from './file';
import EventEmitter from 'events'

let resource = null;

export function init(){
	resource = Vue.resource("dir{/id}");
}


export default class Dir{
	constructor(data = null){
		this.directories = [];
		this.files = [];
		if (data){
			this.setData(data);
		}
	}
	
	setData(data){
		this._id = data._id;
		this.name = data.name;
		this.parent = data.parent;
		this.owner = data.owner;
		if (data.directories){
			this.directories = [];
			for (let dir of data.directories){
				this.directories.push(new Dir(dir));
			}
		}
		if (data.files){
			this.files = [];
			for (let file of data.files){
				this.files.push(new File(file));
			}
		}
	}

	async save(){
		let data = await this.constructor.saveDirectory(this);
		this.setData(data);
	}

	async delete(){
		await this.constructor.deleteDirectroy(this);
	}

	async rename(newName){
		let oldName = this.name;
		this.name = newName;
		try{
			await this.save();
		}catch(err){
			this.name = oldName;
			throw err;
		}
	}

	removeItem(item){
		for (let file of this.files){
			if (file._id == item._id){
				this.files.splice(this.files.indexOf(file), 1);
			}
		}
		for (let dir of this.directories){
			if (dir._id == item._id){
				this.directories.splice(this.directories.indexOf(dir), 1);
			}
		}
	}

	async download(){
		let response = await Vue.http.get("dir/download/" + this._id, {responseType: 'arraybuffer'});
		let blob = new Blob([response.data], {type:response.headers.get('content-type')});
		let link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = this.name;
		link.click();
	}

	async move(newParent){
		let oldParent = this.parent;
		this.parent = newParent._id;
		if (this.parent == undefined){
			this.parent = null;
		}
		try{
			await this.save();
		}catch(err){
			this.parent = oldParent;
			throw err;
		}
	}

	static async getDirectory(id = null){
		let response = await resource.get({id});
		return new Dir(response.body);
	}

	static async saveDirectory(dir){
		if (!dir._id || dir._id == ""){
			return (await resource.save({}, dir)).body;
		}else{
			return (await resource.update({id:dir._id}, dir)).body;
		}
	}

	static async deleteDirectroy(dir){
		return await resource.delete({id:dir._id});
	}

}

Dir.Uploader = class extends EventEmitter {
	constructor(dirItem, parent = null){
		super();
		this.dirItem = dirItem;
		this.parent = parent ? parent._id : null;
		this.uploadedItems = 0;
		this.itemCount = 0;
		this.directories = [];
		this.files = [];
		this.logProgress = true;
	}

	async prepareUploader(){
		let promise = new Promise((resolve, reject)=>{
			let dirReader = this.dirItem.createReader();
			dirReader.readEntries(async (results) => {
				for (let item of results){
					if (item.isFile){
						let uploader = new File.Uploader(item);;
						this.itemCount++;
						this.files.push(uploader);
					}else{
						let uploader = new Dir.Uploader(item);
						await uploader.prepareUploader();
						this.itemCount += uploader.itemCount;
						this.directories.push(uploader);
					}
				}
				resolve();
			});
		});
		await promise;
	}

	onProgress(progress=1){
		this.uploadedItems += progress;
		this.emit("progress", progress);
		if (this.logProgress)
			console.log(`Uploaded ${this.uploadedItems}/${this.itemCount} (${this.progressPercent})`);
		if (this.progressPercent == 100)
			this.emit("done");
	}

	get progressPercent() {
		return ( 1.0 * this.uploadedItems / this.itemCount) * 100;
	}

	async upload(){
		let dir = new Dir({name: this.dirItem.name, parent: this.parent || null});
		await dir.save();
		for (let fileUploader of this.files){
			fileUploader.parent = dir._id;
			fileUploader.upload().then((file)=>{this.onProgress();}).catch(err=>{console.error(err); this.onProgress();});
		}
		for (let dirUploader of this.directories){
			dirUploader.on("progress", (progress)=>{this.onProgress(progress)});
			dirUploader.parent = dir._id;
			dirUploader.logProgress = false;
			dirUploader.upload().then().catch(err=>{console.error(err)});
		}
		return dir;
	}
}