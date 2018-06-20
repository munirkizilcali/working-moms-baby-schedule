const url = 'http://localhost:3000/api/v1/users'
const babyUrl = 'http://localhost:3000/api/v1/babies'
const eventUrl = 'http://localhost:3000/api/v1/events'
const userId = 1
const userGreeting = document.querySelector('.greeting')
const babyList = document.querySelector('.baby-list')
const babyForm = document.querySelector('.new-baby-form')
const eventTypes = ['BedTime', 'Bottle', 'BottleFeeding', 'BreastFeeding', 'ChangeDiaper', 'FormulaFeeding', 'Scale', 'SolidFoodFeeding', 'Temperature', 'WakeUpTime']
let currentUser = 0
function userData() {
	return fetch(`${url}/${userId}`)
		.then(resp=>resp.json())
}

function screenRefresh() {
	return userData()
	.then((json) => {
		createUserInstance(json);
		userGreeting.innerHTML = `Hello ${currentUser.name}`
		babyList.innerHTML = currentUser.renderBabyList()
	}).then(()=>addNewBabyFormListener())
	.then(()=>addEventFormListeners())
}

function createUserInstance(json) {
	currentUser = new User(json.id, json.name, json.email)
	createBabyInstances(json, currentUser)
}

function createBabyInstances(json, user) {
	json.babies.forEach(baby=>{
		let newBaby = new Baby(baby.id, baby.name, baby.sex, baby.birth, baby.mother_id, currentUser)
		createEventInstances(json, newBaby)
	})
}

function createEventInstances(json,baby) {
	json.events.forEach(event=>{
		if (baby.id === event.baby_id){
			let newEvent = new Event(event.id, baby, currentUser, event.amount_1, event.amount_2, event.notes, event.type, event.bottle_id, event.event_time)
		}
	})
}

function changeFields(selectField) {

	let type = selectField.value
	let form = selectField.parentElement
	let changeDiv = form.querySelector('.changeable')

	let timeInput = `<input type='datetime-local' value='${moment().format('YYYY-MM-DDTHH:mm')}' name='event_time' class='event_time'><br>`
	let submitInput = `<input data-baby-id='${form.dataset.id}' data-user-id='${currentUser.id}' class='submit' type='submit'>`
	let bottleInput = `<input type='hidden' name='bottle_id' class='bottle_id' value='000'>`
	changeDiv.innerHTML=''
	// form.removeChild(form.querySelector('input.event_time'))
	// form.removeChild(form.querySelector('input.amount_1'))
	// form.removeChild(form.querySelector('input.amount_2'))
	// form.removeChild(form.querySelector('input.submit'))
	// form.removeChild(form.querySelector('input.notes'))
	let str = ''
	switch (type) {
		case 'BedTime':
			str = `${timeInput}
				   ${submitInput}`
			break;
		case 'Bottle':
			str = `${timeInput}
				   ${submitInput}
				   ${bottleInput}`
			break;
		case 'BottleFeeding':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Amount 1'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'BreastFeeding':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Duration (minutes)'><br>
				   <input type="radio" id="left" name="notes" class='notes' value='left'/><label for='left'>Left</label>
				   <input type="radio" id="right" name="notes" class='notes' value='right'/><label for='right'>Right</label>
				   <input type="radio" id="both" name="notes" class='notes' value='both'/><label for='both'>Both</label>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'ChangeDiaper':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Pee Amount (0-3)'><br>
				   <input type='number' name='amount_2' class='amount_2' placeholder='Poop Amount (0-3)'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'FormulaFeeding':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Formula Amount (oz)'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'Scale':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Weigth (Pounds)'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'SolidFoodFeeding':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Amount (ounces)'><br>
				   <input type='text' name='notes' class='notes' placeholder='Type of Food'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'Temperature':
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Temperature (F)'><br>
				   ${timeInput}
				   ${submitInput}`
			break;
		case 'WakeUpTime':
			str = `${timeInput}
				   ${submitInput}`
			break;
		// case default:
			
	}
	changeDiv.innerHTML += str
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


function getEventFormData(form) {
	let type = form.querySelector('.type') ? form.querySelector('.type').value : null
	let baby_id = form.querySelector('.baby_id') ? form.querySelector('.baby_id').value : null
	let user_id = form.querySelector('.user_id') ? form.querySelector('.user_id').value : null
	let bottle_id = form.querySelector('.bottle_id') ? form.querySelector('.bottle_id').value : null
	let event_time = form.querySelector('.event_time') ? moment(form.querySelector('.event_time').value).format() : null
	let notes = form.notes ? form.notes.value : null
	let amount_1 = form.querySelector('.amount_1') ? form.querySelector('.amount_1').value : null
	let amount_2 = form.querySelector('.amount_2') ? form.querySelector('.amount_2').value : null

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
	}).then(()=>screenRefresh())
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
				createBabyEvent(input).then(()=>screenRefresh())
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

function deleteEvent(button) {
	fetch(eventUrl + `/${button.dataset.eventId}`, {
		method: 'delete'
	}).then(()=>screenRefresh())
}

function deleteBaby(button) {
	fetch(babyUrl + `/${button.dataset.babyId}`, {
		method: 'delete'
	}).then(()=>screenRefresh())
}

document.addEventListener('DOMContentLoaded', function() {
	screenRefresh()
})





