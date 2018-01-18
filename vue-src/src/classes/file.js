import Vue from 'vue';

let resource = null;

export function init(){
	resource = Vue.resource("file{/id}");
};

export default class File {

	constructor(data = null){
		if (data){
			this.setData(data);
		}
	}

	setData(data){
		this._id = data._id;
		this.name = data.name;
		this.parent = data.parent;
		this.owner = data.owner;
	}

	async save(){
		let data = await this.saveFile(this);
		console.log(data);
		this.setData(data);
	}

	async delete(){
		await this.deleteFile(this);
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

	static async getFile(id = null){
		let response = await resource.get({id});
		return new File(response.body);
	}

	static async saveFile(file){
		if (!file._id || file._id == ""){
			return (await resource.save({}, file)).body;
		}else{
			return (await resource.update({id:file._id}, file)).body;
		}
	}

	static async deleteFile(file){
		return await resource.delete({id:file._id});
	}
}
