

userGreeting = document.querySelector('.greeting')
babyList = document.querySelector('.baby-list')
const url = 'http://localhost:3000/api/v1'
const current_user_id = 1
const babies = []
const events = []
const users = []
const classNames = []
let user = 0

class jsModel {

		constructor(id, Json) {
		this.id = id
		if (Json){
			for (let key in Json) {
				this[key] = Json[key]
			}
		}
	}

	static fetchData(id) {
		return fetch(`${this.url()}/${id}`)
			.then(resp=>resp.json())
	}

	static instanceFromId(id) {
		return this.fetchData(id)
		.then(json=>new this(id, json))
	}

	static all() {
		return fetch(this.url())
			.then(resp=> resp.json())
			.then(json=>json.forEach(item=>this.instanceFromId(item.id)))
	}

}

class User extends jsModel{
	constructor(id, Json) {
		super(id, Json)
		if (this.babies) {
			this.babies.forEach(baby => new Baby(baby.id, baby))
			// for (let baby of this.babies) {
			// 	Baby.instanceFromId(baby.id)
			// }
		}
		
		this.babies = babies
		babies.length = 0
		users.push(this)
		return this
	}

	greetUser() {
		return `Hello ${this.name}`
	}

	listBabies() {
		return this.babies
	}

	renderBabyList() {
		let list = ''
		this.babies.forEach(baby=>list+=`<li>${baby.name}</li>`)
		babyList.innerHTML = list
		return list
	}

	static url() {
		return `${url}/users`
	}
}

class Baby extends jsModel {
	constructor(id, Json) {
		super(id, Json)
		if (this.events) {
			for (let evnt of this.events) {
				Event.instanceFromId(evnt.id)
			}
		}
		this.events = events
		events.length = 0

		babies.push(this)
	}
	static url() {
		return `${url}/babies`
	}
}

class Event extends jsModel {
	constructor(id, Json) {
		super(id, Json)
		events.push(this)
	}
	static url() {
		return `${url}/events`
	}
}

function loadUserData() {
	return User.instanceFromId(1)
	.then(()=>{user = users[0]; return user})
	.then((user)=> userGreeting.innerHTML = user.greetUser())
	.then()
}



loadUserData()







