const url = 'http://localhost:3000/api/v1/users'
const babyUrl = 'http://localhost:3000/api/v1/babies'
const eventUrl = 'http://localhost:3000/api/v1/events'
const userId = 1
const userGreeting = document.querySelector('.greeting')
const babyList = document.querySelector('.baby-list')
const babyForm = document.querySelector('.new-baby-form')
const eventTypes = ['BedTime', 'Bottle', 'BottleFeeding', 'BreastFeeding', 'ChangeDiaper', 'FormulaFeeding', 'Scale', 'SolidFoodFeeding', 'Temperature', 'WakeUpTime']

function userData() {
	return fetch(`${url}/${userId}`)
		.then(resp=>resp.json())
}

function renderBabyList(json) {
	let strng = ''
	json.babies.forEach((baby)=>{
			strng+=`<li>${baby.name}${renderBabyEvents(baby, json)}</li>`
	})
	return strng
}

function renderBabyEvents(baby, json) {
	let strng = '<ul>'
	json.events.forEach((event)=>{
		if (event.baby_id === baby.id) {
			strng+=`<li>${event.type} - ${event.event_time}</li>`
		}
	})
	strng += `<li>${renderEventForm(baby.id)}</li>`
	return strng + '</ul>'
}

function screenRefresh() {
	return userData()
	.then((json) => {
		userGreeting.innerHTML = `Hello ${json.name}`
		babyList.innerHTML = renderBabyList(json)
	})
}

function addNewBaby() {
	return fetch(babyUrl, {
		method: 'post',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		},
		body: JSON.stringify(getBabyFormData())
	}).then(resp=>resp.json())
}

function addNewBabyFormListener() {
	babyForm.addEventListener('submit', function(e) {
		e.preventDefault();
		let input = getBabyFormData()
		let filled = true
		for(let item in input) {
			if (input[item] === ''){
				filled = false
			}
		}
		if (filled === true) {
			addNewBaby().then(json=>console.log(json))
		} else {
			alert('Missing Fields in the new baby form!')
		}
	})
}

function renderEventForm(babyId) {
	let str = ''
	str += `<form class='event-form' id='baby-event-${babyId}'>`
	str += `<select name='type' class='type'>
			<option value=''>Add a new event</option>`
	eventTypes.forEach(type=>str+= `<option value='${type}'>${type}</option>`)
	str += `</select><br>`
	str += `<input type='number' name='amount_1' class='amount_1' placeholder='Amount 1'><br>
			<input type='number' name='amount_2' class='amount_2' placeholder='Amount 2'><br>
			<input type='text' name='notes' class='notes' placeholder='Notes'><br>
			<input type='time' name='event_time' class='event_time' placeholder='Notes'><br>`
	str += `<input type='hidden' name='baby_id' class='baby_id' value='${babyId}'>
			<input type='hidden' name='bottle_id' class='bottle_id' value='000'>
			<input type='hidden' name='user_id' class='user_id' value = '${userId}'>
			<input data-baby-id='${babyId}' data-user-id='${userId}' type='submit'>
			</form>`
	return str
}

function getEventFormData(form) {
	let type = form.querySelector('.type').value
	let baby_id = form.querySelector('.baby_id').value
	let user_id = form.querySelector('.user_id').value
	let bottle_id = form.querySelector('.bottle_id').value
	let event_time = form.querySelector('.event_time').value
	let notes = form.querySelector('.notes').value
	let amount_1 = form.querySelector('.amount_1').value
	let amount_2 = form.querySelector('.amount_2').value

	return {type, baby_id, user_id, bottle_id, event_time, notes, amount_1, amount_2}
}

function createBabyEvent(input) {
	console.log(input)
	return fetch(eventUrl, {
		method: 'post',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		},
		body: JSON.stringify(input)
	}).then(resp=>resp.json())
}

function addEventFormListeners() {
	document.querySelectorAll('.event-form').forEach(form=>{
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			let input = getEventFormData(form)
			let filled = true
			for(let item in input) {
				if (input[item] === ''){
					filled = false
				}
			}
			if (filled === true) {
				createBabyEvent(input).then(json=>console.log(json))
			} else {
				alert('Missing Fields in the new event form!')
			}
		})
	})
}



function getBabyFormData() {
	let name = babyForm.querySelector('input.name').value
	let sex = babyForm.querySelector('select.sex').value
	let mother_id = userId
	let birth = babyForm.querySelector('input.birth').value
	return {name, sex, mother_id, birth}
}


document.addEventListener('DOMContentLoaded', function() {
	screenRefresh()
	.then(()=>addNewBabyFormListener())
	.then(()=>addEventFormListeners())
})





