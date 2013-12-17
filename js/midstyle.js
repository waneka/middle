(function(){
	updateGravatarImages()
	updateAddresses()
	makeSymbolsClickable()
	allowUpdate()
})()

function makeSymbolsClickable(){
	var symbols = document.getElementsByClassName('symbol')
	for (var i=0; i<symbols.length; i++){
		symbols[i].addEventListener('click',toggleActive)
	}
}

function allowUpdate(){
	var textareas = document.getElementsByTagName('textarea')
	for (var i=0; i<textareas.length; i++){
		textareas[i].addEventListener('focusin',showUpdateButtons)
		textareas[i].addEventListener('focusout',hideUpdateButtons)
	}
}

function toggleActive(e){
	e.target.classList.toggle('symbol-active')
	var locationType = e.target.dataset.id
	if (e.target.classList.contains('symbol-active')){
		GMap.locationTypes.push(locationType)
		GMap.populateTheMiddle(locationType)
	} else {
		var i = GMap.locationTypes.indexOf(locationType)
		console.log(i)
		GMap.locationTypes.splice(i,1)
		GMap.populateTheMiddle(locationType)
	}
	console.log(GMap.locationTypes)
}

function showUpdateButtons(){
	var updates = document.getElementsByClassName('update')
	for (var i=0; i<updates.length; i++){
		updates[i].classList.remove('hidden')
	}
}

function hideUpdateButtons(){
	var updates = document.getElementsByClassName('update')
	for (var i=0; i<updates.length; i++){
		updates[i].classList.add('hidden')
	}
}

function updateGravatarImages(){
	var leftGravatars = document.getElementsByClassName('gravatar-left')
	var rightGravatars = document.getElementsByClassName('gravatar-right')
	for (var i=0; i<leftGravatars.length; i++){
		oldSrc = leftGravatars[i].src
		leftGravatars[i].src = oldSrc.replace('00000000000000000000000000000000',hash(findEmail1()))
	}
	for (var i=0; i<rightGravatars.length; i++){
		oldSrc = rightGravatars[i].src
		rightGravatars[i].src = oldSrc.replace('00000000000000000000000000000000',hash(findEmail2()))
	}
}

function findEmail(n){
	var email = RegExp("email" + n + "=([^&]*)")
	return window.location.search.match(email)[1].replace('%40','@')
}

function findAddress(n){
	var address = RegExp("address" + n + "=([^&]*)")
	var commified = window.location.search.match(address)[1].replace(/%2C/g,',')
	return commified.split('+').join(' ')
}

function updateAddresses(){
	document.getElementById('address1').value = findAddress1()
	document.getElementById('address1-mobile').value = findAddress1()
	document.getElementById('address2').value = findAddress2()
	document.getElementById('address2-mobile').value = findAddress2()
}

function hash(email) {
	return calcMD5(email)
}