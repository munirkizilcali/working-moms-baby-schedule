const url = 'http://localhost:3000/api/v1/users'
const babyUrl = 'http://localhost:3000/api/v1/babies'
const eventUrl = 'http://localhost:3000/api/v1/events'
const babyUserUrl = 'http://localhost:3000/api/v1/baby_users'
const userGreeting = document.querySelector('.greeting')
const babyList = document.querySelector('.baby-list')

const eventTypes = ['BedTime', 'Bottle', 'BottleFeeding', 'BreastFeeding', 'ChangeDiaper', 'FormulaFeeding', 'Scale', 'SolidFoodFeeding', 'Temperature', 'WakeUpTime']
let currentUser = 0

function babyForm() {
	return document.querySelector('.new-baby-form')	
} 

function userData() {
	return fetch(`${url}`)
		.then(resp=>resp.json())
}

function userSelector(currentUser) {
	let str = `<select name="currentUser" class='current-user-select' onchange='changeCurrentUser(this)'>`
	if (currentUser !== 0) {
		users.forEach((user)=>str += `<option value=${user.id} ${user.id === currentUser.id ? 'selected' : ''}>${user.name}</option>`)				
	} else {
		users.forEach((user)=>str += `<option value=${user.id} ${user.id === currentUser.id ? 'selected' : ''}>${user.name}</option>`)
	}
	str += `</select>`
	return str
}

function changeCurrentUser(selector) {
	currentUser = users.find((user)=>user.id === parseInt(selector.value))
	document.querySelector('.user-switch-div').dataset.userId = currentUser.id
	screenRefresh()
}

function screenRefresh() {
	currentUser = 0
	users = []
	babies = []
	events = []
	return userData()
	.then((json) => {
		return createUserInstances(json)})
	.then(()=>{
		currentUser = users.find((user)=>user.id === parseInt(document.querySelector('.user-switch-div').dataset.userId))
		document.querySelector('.user-switch-div').innerHTML = userSelector(currentUser)
		userGreeting.innerHTML = `Hello ${currentUser.name}`
		babyList.innerHTML = currentUser.renderBabyList()
		document.querySelector('.children-list').innerHTML = currentUser.renderChildrenList()
		document.querySelector('.new-baby-div').innerHTML = `
			<form class='new-baby-form'>
			<h4>New Baby</h4>
				<label for='name'>Baby Name</label>
				<input type="text" name="name" class='name'><br>
				<label for='birth'>Birth Day</label>
				<input type="date" name="birth" class='birth'><br>
				<select name="sex" class='sex'>
					<option value="">Select gender</option>
					<option value='m'>Baby Boy</option>
					<option value='f'>Baby Girl</option>
				</select><br>
				<input type="submit" name="submit">
			</form>`
	})
	.then(()=>addNewBabyFormListener())
	.then(()=>addEventFormListeners())
	.then(()=>addCaretakerFormListeners())
}

function createUserInstances(json) {
	return json.forEach((user)=>{
		let userIns = new User(user.id, user.name, user.email)
		createBabyInstances(user, userIns)
	})
	
}

function createBabyInstances(json, user) {
	return json.babies.forEach(baby=>{
		let newBaby = new Baby(baby.id, baby.name, baby.sex, baby.birth, baby.mother_id, user)
		json.baby_users.forEach((babyUser)=> babyUser.baby_id === newBaby.id ? newBaby.careTakerIds.push(babyUser.care_taker_id) : '')
		createEventInstances(json, newBaby)
	})
}

function createEventInstances(json,baby) {
	return json.events.forEach(event=>{
		if (baby.id === event.baby_id){
			let newEvent = new Event(event.id, baby, event.user_id, event.amount_1, event.amount_2, event.notes, event.type, event.bottle_id, event.event_time)
		}
	})
}

function changeFields(selectField) {

	let type = selectField.value
	let form = selectField.parentElement
	let changeDiv = form.querySelector('.changeable')

	let timeInput = `<input type='datetime-local' value='${moment().format('YYYY-MM-DDTHH:mm')}' name='event_time' class='event_time'><br>`
	let submitInput = `<input data-baby-id='${form.dataset.id}' data-user-id='${currentUser.id}' class='submit' type='submit'>`
	let bottleInput = ''
	let baby = currentUser.babies.find((baby)=>{return baby.id === parseInt(form.dataset.id)})
	baby.availableBottles().forEach((bottle)=>{return bottleInput += `<input type="radio" id="${bottle.id}" name="bottle_id" class='notes' value='${bottle.id}'/><label for='${bottle.id}'>${bottle.amount1} oz - ${moment(bottle.eventTime).fromNow()}</label><br>`})
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
			str = `<input type='number' name='amount_1' class='amount_1' placeholder='Amount of milk (oz)'><br>
				   ${timeInput}
				   ${submitInput}
				   `
			break;
		case 'BottleFeeding':
			if (bottleInput !== '') {
			str = `${bottleInput}
				   ${timeInput}
				   ${submitInput}`
			} else {
			str = 'No available pumped milk.'
			}
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
	.then(()=>{screenRefresh()})
}

function addNewBabyFormListener() {
	babyForm().addEventListener('submit', function(e) {
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
	let bottle_id = form.bottle_id ? form.bottle_id.value : null
	let event_time = form.querySelector('.event_time') ? moment(form.querySelector('.event_time').value).format() : null
	let notes = form.notes ? form.notes.value : null
	let amount_1 = form.querySelector('.amount_1') ? form.querySelector('.amount_1').value : null
	let amount_2 = form.querySelector('.amount_2') ? form.querySelector('.amount_2').value : null

	return {type, baby_id, user_id, bottle_id, event_time, notes, amount_1, amount_2}
}

function getCareTakerFormData(form) {
	let baby_id = form.querySelector('.baby_id') ? form.querySelector('.baby_id').value : null
	let care_taker_id = form.querySelector('.user_id') ? form.querySelector('.user_id').value : null

	return {baby_id, care_taker_id}
}

function addNewCareTaker(input) {
	console.log(input)
	return fetch(babyUserUrl, {
		method: 'post',
		headers: {
			'content-type':'application/json',
			'accept':'application/json'
		},
		body: JSON.stringify(input)
	}).then(()=>screenRefresh())
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
				createBabyEvent(input).then(()=>{ screenRefresh()})
			} else {
				alert('Missing Fields in the new event form!')
			}
		})
	})
}

function addCaretakerFormListeners() {
	document.querySelectorAll('.care-taker-form').forEach(form=>{
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			let input = getCareTakerFormData(form)
			let filled = true
			for(let item in input) {
				if (input[item] === ''){
					filled = false
				}
			}
			if (filled === true) {
				addNewCareTaker(input).then(()=>{ screenRefresh()})
			} else {
				alert('Missing Fields in the new caretaker form!')
			}
		})
	})
}

function getBabyFormData() {
	let name = babyForm().querySelector('input.name').value
	let sex = babyForm().querySelector('select.sex').value
	let mother_id = currentUser.id
	let birth = babyForm().querySelector('input.birth').value
	return {name, sex, mother_id, birth}
}

function deleteEvent(button) {
	fetch(eventUrl + `/${button.dataset.eventId}`, {
		method: 'delete'
	}).then(()=>screenRefresh())
}

function deleteBabyUser(button) {
	fetch(babyUserUrl)
		.then((resp)=>resp.json())
		.then((json)=>{
			let jsonItem = json.find((baby_user)=>baby_user.care_taker_id === button.dataset.caretakerId && baby_user.baby_id === button.dataset.babyId)
			return jsonItem.id
		}).then((id)=>fetch(babyUserUrl + `/${id}`, {
		method: 'delete'
	})).then(()=>screenRefresh())
}

function deleteBaby(button) {
	let confirmation = confirm('Are you sure to delete baby?')
	if (confirmation === true) {
		fetch(babyUrl + `/${button.dataset.babyId}`, {
			method: 'delete'
		}).then(()=>screenRefresh())
	}  
}


document.addEventListener('DOMContentLoaded', function() {
	screenRefresh()
})





