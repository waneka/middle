var Midstyle = {

	init: function(){
		this.updateGravatarImages()
		this.setAddresses()
		this.makeSymbolsClickable()
		this.updateAddress()
	},

	makeSymbolsClickable: function(){
		var symbols = document.getElementsByClassName('symbol')
		for (var i=0; i<symbols.length; i++){
			symbols[i].addEventListener('click',this.toggleActive)
		}
	},

	updateAddress: function() {
		var updateButtons = document.getElementsByClassName('update-button')
		for (var i=0; i < updateButtons.length; i++) {
			updateButtons[i].addEventListener('click', this.updateTheMap)
		}
	},

	updateTheMap: function() {
		GMap.updateMap()
	},

	toggleActive: function(e){
		if (e.target.classList.contains('fa')) {
			e.target.parentElement.classList.toggle('symbol-active')
			var locationType = e.target.parentElement.dataset.id
		} else {
			e.target.classList.toggle('symbol-active')
			var locationType = e.target.dataset.id
		}
		if (e.target.classList.contains('symbol-active') ||
			e.target.parentElement.classList.contains('symbol-active')){
			GMap.locationTypes.push(locationType)
			GMap.populateTheMiddle(locationType)
		} else {
			var i = GMap.locationTypes.indexOf(locationType)
			GMap.locationTypes.splice(i,1)
			GMap.populateTheMiddle(locationType)
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

	setAddresses: function(){
		document.getElementById('address1').value = App.user.address[1]
		document.getElementById('address1-mobile').value = App.user.address[1]
		document.getElementById('address2').value = App.user.address[2]
		document.getElementById('address2-mobile').value = App.user.address[2]
	},

	hash: function(email){
		return calcMD5(email)
	}
}