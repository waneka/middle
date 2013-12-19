var Midstyle = {
	
	init: function(){
		this.updateGravatarImages()
		this.updateAddresses()
		this.makeSymbolsClickable()
		this.allowUpdate()
	},

	makeSymbolsClickable: function(){
		var symbols = document.getElementsByClassName('symbol')
		for (var i=0; i<symbols.length; i++){
			symbols[i].addEventListener('click',this.toggleActive)
		}
	},

	allowUpdate: function(){
		var textareas = document.getElementsByTagName('textarea')
		for (var i=0; i<textareas.length; i++){
			textareas[i].addEventListener('focusin',this.showUpdateButtons)
			textareas[i].addEventListener('focusout',this.hideUpdateButtons)
		}
	},

	toggleActive: function(e){
		e.target.classList.toggle('symbol-active')
		var locationType = e.target.dataset.id
		if (e.target.classList.contains('symbol-active')){
			GMap.locationTypes.push(locationType)
			GMap.populateTheMiddle(locationType)
		} else {
			var i = GMap.locationTypes.indexOf(locationType)
			GMap.locationTypes.splice(i,1)
			GMap.populateTheMiddle(locationType)
		}
	},

	showUpdateButtons: function(){
		var updates = document.getElementsByClassName('update')
		for (var i=0; i<updates.length; i++){
			updates[i].classList.remove('hidden')
		}
	},

	hideUpdateButtons: function(){
		var updates = document.getElementsByClassName('update')
		for (var i=0; i<updates.length; i++){
			updates[i].classList.add('hidden')
		}
	},

	updateGravatarImages: function(){
		var leftGravatars = document.getElementsByClassName('gravatar-left')
		var rightGravatars = document.getElementsByClassName('gravatar-right')
		for (var i=0; i<leftGravatars.length; i++){
			oldSrc = leftGravatars[i].src
			leftGravatars[i].src = oldSrc.replace('00000000000000000000000000000000',this.hash(App.user.email[1]))
		}
		for (var i=0; i<rightGravatars.length; i++){
			oldSrc = rightGravatars[i].src
			rightGravatars[i].src = oldSrc.replace('00000000000000000000000000000000',this.hash(App.user.email[2]))
		}
	},

	updateAddresses: function(){
		document.getElementById('address1').value = App.user.address[1]
		document.getElementById('address1-mobile').value = App.user.address[1]
		document.getElementById('address2').value = App.user.address[2]
		document.getElementById('address2-mobile').value = App.user.address[2]
	},

	hash: function(email){
		return calcMD5(email)
	}
}