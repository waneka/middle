(function(){
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