let users = []
let babies = []
let events = []


class User {
	constructor(id, name, email) {
		this.id = id
		this.name = name
		this.email = email
		this.babies = []
	}

	renderBabyList() {
	let strng = ''
	this.babies.forEach((baby)=>{
			strng+=`<li>${baby.name} - <button name='delete-baby' class='delete-baby' data-baby-id='${baby.id}' onclick='deleteBaby(this)'>Delete Baby</button>${baby.renderEvents()}</li>`
	})
	return strng
}
}

class Baby {
	constructor(id, name, sex, birth, mother, user) {
		this.id = id
		this.name = name
		this.sex = sex
		this.birth = birth
		this.mother = mother
		this.events = []
		user.babies.push(this)
	}

	renderEvents() {
		let strng = '<ul>'
		this.events.forEach((event)=>{
			strng +=`<li>${event.type} - ${moment(event.eventTime).calendar()} <button data-event-id='${event.id}' onClick='deleteEvent(this)'>X</button></li>`
		})
		strng += `<li>${this.renderEventForm()}</li>`
		return strng + '</ul>'
	}

	renderEventForm() {
		let str = ''
		str += `<form class='event-form' data-id='${this.id}' id='baby-event-${this.id}'>`
		str += `<select name='type' class='type' onchange='changeFields(this)'>
				<option value=''>Add a new event</option>`
		eventTypes.forEach(type=>str+= `<option value='${type}'>${type}</option>`)
		str += `</select><br><div class='changeable'></div>`
		str += `<input type='hidden' name='baby_id' class='baby_id' value='${this.id}'>
				<input type='hidden' name='user_id' class='user_id' value = '${currentUser.id}'>
				</form>`
		return str
	}

	availableBottles() {
		let bottles = this.events.filter((event)=>event.type === 'Bottle')
		// debugger
		let bottleFeedings = this.events.filter((event)=>event.type === 'BottleFeeding')
		if (bottleFeedings.length === 0) {
			return bottles
		} else {
			let avBottles = bottles.filter((bottle)=>{ 
				let drunk = bottleFeedings.find((feeding)=> {
				// debugger
					return (feeding.bottle === bottle.id)
				})
				return !Boolean(drunk)
			})
			return avBottles
		}
	}
}

class Event {
	constructor(id, baby, user, amount1, amount2, notes, type, bottle, eventTime) {
		this.id = id
		this.baby = baby
		this.user = user
		this.amount1 = amount1
		this.amount2 = amount2
		this.notes = notes
		this.type = type
		this.bottle = bottle
		this.eventTime = eventTime
		baby.events.push(this)
	}
}