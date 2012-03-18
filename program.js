// COMIC BOOK JAVASCRIPT APPLICATION
// This is a practice application that allows me to
// build and work through a basic Comic Book database
// made up of a number of Objects which are linked 
// together. The purpose being the ability to propagate
// and load all related comics.

(function JSCOMICBOX() {

	// Create some basic required prototypes
	String.prototype.trim = function() {
		return this.replace(/^s+|\s+$/g, '');
	}

	// Simple write function which will allow me to
	// write directly to my prettified HTML markup.
	// Hack, but was sick of looking at an ugly page!
	document.write = function(str) {
		var content = document.getElementById('content');
		var element = document.createElement('p');
		element.innerHTML = str;
		content.appendChild(element);
	}

	// Create array of comics and comic series
	// ... basically the "database"
	this.comics = [];
	this.comic_series = [];

	// Object format for a single comic issue
	this.Comic = function(series, issue, year) {
		return {
			'series': series || 'Amazing Spider-Man',
			'issue': issue || 1,
			'year': year || 1969,
			'getTitle': function() {
				return ((typeof this.series === "object") ? this.series.getTitle() : this.series) + ' #' + this.issue;
			}
		}
	}

	// Object format for a Comic Book Series (eg. The Amazing Spider-Man (1999))
	this.Series = function(name, year, publisher) {
		return {
			'name': name,
			'year': year,
			'publisher': publisher,
			'getTitle': function() {
				return this.name + ' (' + this.year + ')';
			}
		}
	}

	this.ComicSeries = function() {
		return {
			'getTitle': function() {
				return this.name + ' (' + this.year + ')';
			}
		}
	};

	// Add a series listing to the Application
	this.list_series = function() {
		var list = "";
		list += '<ul>';
		// Loop through each series and spit out the name
		for (var i = this.comic_series.length - 1; i >= 0; i--) {
			list += '<li>' + this.comic_series[i].getTitle() + '</li>';
		};
		list += '</ul>';
		document.write(list);
	}

	// UX HANDLERS

	// Load specific requirements
	var newComic = document.getElementById('new_comic_record');
	var newComicSubmit = document.getElementById('new_comic');
	var newComicElements = newComic.elements;

	// Add listener for a submit, and make sure no page reload happens
	var newComicCallback = function() {
		console.log('New record, let\'s start here!');
		var existing_series = false;
		this.comic_series.forEach(function(element,index) { 
			if(element.name === newComicElements.new_series.value) {
				existing_series = index;
			}
		});
		if(existing_series === false) {
			existing_series = this.comic_series.push(
				new this.Series(newComicElements.new_series.value, newComicElements.new_year.value)) - 1;
		}
		// Add new comic to the database
		var new_comic_id = this.comics.push(new this.Comic(this.comic_series[existing_series].name, newComicElements.new_issue.value, newComicElements.new_year.value));
		// Display the title to the end of our list
		document.write(this.comics[new_comic_id-1].getTitle().trim() + '<br />');
		// Stop browser acting on submit with page refresh
		return false;
	}

	// Attach events to form listeners to the submit button
	// and cancel out the form from refreshing, if there is a
	// JS error
	newComic.new_comic.onclick = newComicCallback;
	newComic.onsubmit = function() {
		return false;
	}

	// MAIN CODE AND TESTS FOR THE ABOVE CODE

	this.main = function() {

		if(localStorage.getItem('comic_series')) {
			document.write('Loading existing database...');
			JSON.parse(localStorage.getItem('comic_series')).forEach(function(element, index) {
				this.comic_series.push(new Series(element.name, element.year, element.publisher));
			});

		} else {
			alert('No DB exists, so I\'ll create a demo for you');
			this.comic_series.push(new this.Series('Uncanny X-Men', 1969, 'Marvel'));
			this.comic_series.push(new this.Series('Fantastic Four', 1962, 'Marvel'));
			// Store the current Comic Series database into LocalStorage for persistance
			localStorage.setItem('comic_series', JSON.stringify(this.comic_series));
		}
		
		this.list_series();
		
		//for (var i = this.comics.length - 1; i >= 0; i--) {
		//	document.write(this.comics[i].getTitle().trim() + '<br />');
		//};
		
	}();

}());