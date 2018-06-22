let users = []
let babies = []
let events = []

let eventGroups = [
	{
		id: 1,
		content: 'Feeding',
		
		// Optional: a field 'className', 'style', 'order', [properties]
	},
	{
		id: 2,
		content: 'Sleep'
		// Optional: a field 'className', 'style', 'order', [properties]
	},
	{
		id: 3,
		content: 'Diapers'
		// Optional: a field 'className', 'style', 'order', [properties]
	},
	{
		id: 4,
		content: 'Health'
		// Optional: a field 'className', 'style', 'order', [properties]
	}
]


class User {
	constructor(id, name, email) {
		this.id = id
		this.name = name
		this.email = email
		this.babies = []
		this.children = []
		users.push(this)
	}

	renderBabyList() {
		let strng = ''
		this.babies.forEach((baby)=>{
				strng+=`<li>${baby.name} - <button name='delete-baby' class='delete-baby' data-baby-id='${baby.id}' onclick='deleteBaby(this)'>Delete Baby</button>
						<br><div class='baby-event-timeline-${baby.id}'></div>
						${baby.renderEvents()}</li>`
		})
		return strng
	}

	renderChildrenList() {
		let strng = ''
		this.children.forEach((baby)=>{
			strng += `<li>${baby.name} - <button name='delete-baby' class='delete-baby' data-baby-id='${baby.id}' onclick='deleteBaby(this)'>Delete Baby</button>${baby.renderCaretakers()}</li>`
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
		if (this.mother === user.id) {
			user.children.push(this)
		}
		this.careTakerIds = []
		this.timeline = ''
	}

	renderEvents() {
		let strng = '<ul>'
		this.events.forEach((event)=>{
			strng +=`<li>${event.type} - ${moment(event.eventTime).calendar()} <button data-event-id='${event.id}' onClick='deleteEvent(this)'>X</button></li>`
		})
		strng += `<li>${this.renderEventForm()}</li>`
		return strng + '</ul>'
	}

	sleepEvents() {
		return this.events.filter((event)=>event.type==='BedTime' || event.type==='WakeUpTime')
	}

	sleepCycles() {
		let sleeps = []
		let eventArray = this.sleepEvents()
		for(let i = 0; i < eventArray.length; i++){
			if (eventArray[i].type === 'BedTime') {
				let startTime = new moment(eventArray[i].eventTime).format('YYYY-MM-DD HH:mm:ss')
				let j = i+1
				let endTime = ''
				if ( j !== eventArray.length ) {
					endTime = new moment(eventArray[i+1].eventTime).format('YYYY-MM-DD HH:mm:ss')
				} else {
					endTime = new moment().format('YYYY-MM-DD HH:mm:ss')
				}
				sleeps.push({			 
				start: startTime,
				end: endTime,
				content: `<img src='https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/sleeping-face_1f634.png' width="25" height="25"> In Sleep`,
				group: 2
				});
			}
			
		}
		return sleeps
	}

	renderEventsForVis() {
		let visObject = []
		this.events.forEach(event=>{
			let eventGroup = 0
			let eventStyle = ''
			let eventTime = moment(event.eventTime).format('HH:mm')
			let eventAmount1 = ''
			let eventAmount2 = ''
			let eventContent = ''
			
			let eventName = event.type.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
			if (event.type === 'BedTime' || event.type ==='WakeUpTime') {
				eventGroup = 2
			} else if (event.type === 'Bottle' || event.type ==='BottleFeeding' || event.type ==='BreastFeeding' || event.type ==='FormulaFeeding' || event.type ==='SolidFoodFeeding') {
				if (event.type === 'Bottle') {
					eventContent = `<img src="https://png.icons8.com/color/50/000000/manual-breast-pump.png" width='25' height='25'> Breast Pump: ${event.amount1} oz`
				} else if (event.type ==='BottleFeeding') {
					eventContent = `<img src="https://png.icons8.com/color/50/000000/baby-bottle.png" width="25" height="25"> Expressed Milk`
				} else if (event.type === 'BreastFeeding' ) {
					eventContent = `<img src="https://emojipedia-us.s3.amazonaws.com/thumbs/120/apple/129/breast-feeding_1f931.png" width="25" height="25"> ${event.amount1} minutes`
				} else if (event.type ==='FormulaFeeding') {
					eventContent = `<img src="https://png.icons8.com/color/50/000000/baby-bottle.png" width="25" height="25"> Formula: ${event.amount1} oz`
				} else {
					eventContent = `<img src="https://png.icons8.com/color/50/000000/vegan-food.png" width="25" height="25"> ${event.notes}`
				}
				eventGroup = 1
				eventStyle = "color: #336600; background-color: #99FF99;"
			} else if (event.type ==='ChangeDiaper') {
				for(let i=0; i < event.amount1; i++) { eventAmount1 += '<img src="https://cdn.shopify.com/s/files/1/1061/1924/products/Poop_Emoji_7b204f05-eec6-4496-91b1-351acc03d2c7_small.png?v=1480481059" width="25" height="25">'}
				for(let i=0; i < event.amount2; i++) { eventAmount2 += '<img src="https://emojipedia-us.s3.amazonaws.com/thumbs/160/apple/129/splashing-sweat-symbol_1f4a6.png" width="25" height="25">'}
				eventGroup = 3
				eventStyle = "color: #663300; background-color: #FFB266;"
				eventContent = `${eventAmount1} ${eventAmount2}`
			} else {
				eventGroup = 4
				eventStyle = "color: red; background-color: pink;"
				if (event.type === 'Temperature') {
					eventContent = `<img src="https://emojipedia-us.s3.amazonaws.com/thumbs/120/google/119/thermometer_1f321.png" width="25" height="25"> ${event.amount1} F`
				} else if (event.type === 'Scale') {
					eventContent = `<img src="https://png.icons8.com/color/50/000000/scale.png" width="25" height="25"> ${event.amount1} pounds`
				}
			}
			if (eventGroup !== 2){
			visObject.push({
			 start: new moment(event.eventTime).format('YYYY-MM-DD HH:mm:ss'), 
			 content: eventContent,
			 group: eventGroup,
			 style: eventStyle
			})}
		// debugger
		})
		visObject.push(...this.sleepCycles())
		var items = new vis.DataSet(visObject)

		return items
	}
	renderTimeline() {
		// debugger
		let containerClass = `.baby-event-timeline-${this.id}`
		this.timeline = new vis.Timeline(document.querySelector(containerClass), this.renderEventsForVis(), eventGroups, {start: moment().subtract(23, 'hours').format(), end: moment().add(1, 'hours').format()});
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

	renderCareTakerForm() {
		let str = ''
		str += `<form class='care-taker-form' data-baby-id='${this.id}'>`
		str += `<select name='user_id' class='user_id'>
				<option value=''>Add a new caregiver</option>`
		users.forEach(user=>str+= `<option value='${user.id}'>${user.name}</option>`)
		str += `</select>`
		str += `<input type='hidden' name='baby_id' class='baby_id' value='${this.id}'>`
		str += `<input type='submit' name='submit' value='Add'>
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

	renderCaretakers() {
		let str = '<ul>'
		this.careTakerIds.forEach((userId)=>{ 
			let careTaker = users.find((user)=>user.id === userId)
			if (careTaker) {
				str += `<li>${careTaker.name} <button data-caretaker-id='${careTaker.id}' data-baby-id= '${this.id}' onClick='deleteBabyUser(this)'>X</button></li>`
			}
		})
		str+= `<li>${this.renderCareTakerForm()}</li>`
		str+= '</ul>'
		return str
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