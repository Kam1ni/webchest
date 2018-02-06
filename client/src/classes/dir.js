import Vue from 'vue';
import File from './file';

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

Dir.Uploader = class {
	constructor(dirItem, parent){
		this.dirItem = dirItem;
		this.parent = parent._id;
		this.progress = 0;
	}

	async upload(){
		let dir = new Dir({name: this.dirItem.name, parent: this.parent || null});
		console.log("Saving dir")
		await dir.save();
		console.log("dir saved")
		let promise = new Promise(async (resolve, reject)=>{
			let dirReader = this.dirItem.createReader();
			dirReader.readEntries(async (results) => {
				try{
					console.log(results);
					for (let item of results){
						if (item.isFile){
							console.log("uploading file");
							let uploader = new File.Uploader(item, dir);;
							uploader.upload().catch((err)=>{
								console.error(err);
							});
						}else{
							console.log("uploading dir");
							let uploader = new Dir.Uploader(item, dir);
							uploader.upload().catch((err)=>{
								console.error(err);
							});
						}
					}
					resolve();
				}catch(err){
					reject(err);
				}
			});
		});
		console.log("Waiting for promise");
		await promise;
		return dir;
	}
}