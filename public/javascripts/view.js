function View() {
}

View.prototype = {
	init: function() {
		this.overlay()
		this.makeSymbolsClickable()
		this.updateAddress()
		this.locationListener()
	},

	makeSymbolsClickable: function() {
		var symbols = document.getElementsByClassName('symbol')
		for (var i=0; i<symbols.length; i++){
			symbols[i].addEventListener('click',this.toggleActive)
		}
	},

	showLocationsWindow: function() {
		$('.location-console').removeClass('hidden')
	},

	toggleDirectionsWindow: function() {
		$('.directions-console').toggleClass('hidden')
	},

	adjustDirLocButtons: function() {
		$('.directions-toggle').addClass('hidden')
		var locations = Map.startingPoints.length
		for (var i=0;i<locations;i++) {
			$('#dir-loc' + (i + 1)).removeClass('hidden')
		}
	},

	showLocDirections: function(num) {
		$('.directions').addClass('hidden')
		$('#directions' + num).removeClass('hidden')
	},

	showVenueInfo: function() {
		var venueInfo = document.querySelector('.venue-info')
		venueInfo.classList.remove('hidden')
	},

	locationListener: function() {
		var locationForm = $('.location-form')
		locationForm.on('click', function(e) {
			e.preventDefault()
			var address = e.target.form[0].value + ' ' + e.target.form[1].value
			if (Map.startingPoints.length === 0) {
				Map.initialManualLocation(address)
			} else {
				Map.findLocation(address, function() {
					Map.recenterMap()
					View.adjustDirLocButtons()
					if (Map.startingPoints.length === 4) {
						var button = $('.loc-two-submit')
						button.addClass('disabled')
						button.attr('disabled', 'disabled')
					}
				})
			}
		})
	},

	enterAddress: function() {
		$('.find-location').addClass('hidden')
		$('.enter-address').removeClass('hidden')
	},

	initiateSpinner: function() {
		$('.spinner').removeClass('hidden')
		$('.landing-button').addClass('disabled')
	},

	showVenueButtons: function() {
		$('.button-holder').removeClass('hidden')
	},

	hideVenueButtons: function() {
		$('.button-holder').addClass('hidden')
	},

	geoLocationError: function() {
		$('.find-location').addClass('hidden')
		$('.geo-error').removeClass('hidden')
		$('.enter-address').removeClass('hidden')
	},

	updateAddress: function() {
		var updateButtons = document.getElementsByClassName('update-button')
		for (var i=0; i < updateButtons.length; i++) {
			updateButtons[i].addEventListener('click', function() {
				Map.updateMap()
			})
		}
	},

	displaySteps: function(human, steps) {
		var container = document.getElementById('directions' + (human+1))
		container.innerHTML = ''
		steps.forEach(function(step) {
			var direction = document.createElement('div')
			var icon
			var rightRegExp = /right/g
			var leftRegExp = /left/g
			if (step.maneuver.type === 'continue') {
				icon = '<i class="dir-icons fa fa-arrows-v"></i> '
			} else if (step.maneuver.type === 'depart') {
				icon = '<i class="dir-icons fa fa-road"></i> '
			} else if (step.maneuver.type === 'arrive') {
				icon = '<i class="dir-icons fa fa-bullseye"></i> '
			} else if (step.maneuver.type === 'u-turn') {
				icon = '<i class="dir-icons fa fa-repeat"></i> '
			} else if (step.maneuver.type === 'enter roundabout') {
				icon = '<i class="dir-icons fa fa-spinner"></i> '
			} else if (rightRegExp.test(step.maneuver.type)) {
				icon = '<i class="dir-icons fa fa-share"></i> '
			} else if (leftRegExp.test(step.maneuver.type)) {
				icon = '<i class="dir-icons fa fa-reply"></i> '
			} else {
				icon = '<i class="dir-icons fa fa-tachometer"></i> '
			}

			direction.innerHTML = icon + step.maneuver.instruction + '<br>'
			container.appendChild(direction)
		})
	},

	renderVenueInfo: function(venue) {
		this.renderVenueTopBlock(venue)
		this.renderVenueBottomBlock(venue)
	},

	renderVenueTopBlock: function(venue) {
		var photo
		if (venue.photos.groups[0]) {
			photo = venue.photos.groups[0].items[0].prefix + "120x120" + venue.photos.groups[0].items[0].suffix
		}
		var template = $('#venue-template-top').html()
		Mustache.parse(template)
		var rendered = Mustache.render(template, {venue: venue, photo: photo})
		$('#venue-info-top').html(rendered)
	},

	renderVenueBottomBlock: function(venue) {
		var price
		if (venue.price) {
			price = Array(venue.price.tier+1).join("$")
		}
		var info = {
			venue: venue,
			price: price
		}
		var rating
		if (venue.rating) {
			stars = this.calculateStars(venue.rating)
			info["rating"] = stars
		}
		var template = $('#venue-template-bottom').html()
		Mustache.parse(template)
		var rendered = Mustache.render(template, info)
		$('#venue-info-bottom').html(rendered)
	},

	setInitialVenue: function(type) {
		var button = document.getElementById(type)
		button.classList.add('symbol-active')
	},

	calculateStars: function(rating) {
		var fullStar = 'fa-star'
			, halfStar = 'fa-star-half-o'
			, emptyStar = 'fa-star-o'
			, starsData = {
				"stars": [
					{ "type": halfStar },
					{ "type": halfStar },
					{ "type": halfStar },
					{ "type": halfStar },
					{ "type": halfStar }
				]
			}

		var fullStars = rating / 2 | 0
		var remainder = rating / 2 - fullStars
		var halfStars = 0
		if (remainder >= .75) {
			fullStars++
		} else if (remainder >= .35) {
			halfStars = 1
		}
		var emptyStars = 5 - (fullStars + halfStars)
		for (var i=0;i<fullStars;i++) {
			starsData.stars[i]["type"] = fullStar
		}
		for (var i=0;i<emptyStars;i++) {
			starsData.stars[4-i]["type"] = emptyStar
		}
		return starsData
	},

	overlay: function() {
		el = document.getElementById("overlay");
		el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
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
			Map.locationTypes.push(locationType)
			Map.populateTheMiddle()
		} else {
			var i = Map.locationTypes.indexOf(locationType)
			Map.locationTypes.splice(i,1)
			Map.populateTheMiddle()
		}
	}
}
