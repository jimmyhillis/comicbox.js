/*

JS COMIC BOX

This is a practice application that allows me to
build and work through a basic Comic Book database
made up of a number of Objects which are linked 
together. The purpose being the ability to propagate
and load all related comics. 

Developer: Jimmy Hillis / jimmy.hillis@me.com
Repository: https://github.com/jimmyhillis/JSComicBox/
Version: 0.1
Last Update: 19/03/2012

*/

// Default settings for loading the JSComicBox app
var s = { 'output_element':'content' };

(function JsComicBox(settings) {

	var comicbox = {}, 
		comics = [], // array of comics in your personal
		comic_series = []; // array of comic series e.g. Amazing Spider-Man (1999)

	comicbox._version = "0.1";
	comicbox._developer = "jimmy.hillis@me.com";
	comicbox.output_element = (typeof settings.output_element == String) ?
		settings.output_element :
		'content';

	// Function allows me to write simple markup (generally HTML) to the browser
	// for client + testing purposes
	output = function(str) {
		var content = document.getElementById(comicbox.output_element);
		var element = document.createElement('p');
		element.innerHTML = str;
		content.appendChild(element);
	}

	/* == OBJECT TYPES FOR COMIC BOX == */

	// Comic constructor
	Comic = function(series, issue, year) {
		this.series = series || 'Amazing Spider-Man',
		this.issue = issue || 1,
		this.year = year || 1969
	}
	// Return the title of the comic issue based on SERIES #ISSUE {YEAR}
	Comic.prototype.getTitle = function() {
		return ((typeof this.series === "object") ? 
			this.series.getTitle() : 
			this.series) + ' #' + this.issue + ' [' + this.year + ']';
	};

	// Comic series constructor {e.g. The Amazing Spider-Man (1999)}
	Series = function(name, year, publisher) {
		this.name = name;
		this.year = year;
		this.publisher = publisher;
	};
	// Add prototypal functions to the Comic Series class
	Series.prototype.getTitle = function() {
		return this.name + ' [' + this.year + ']';
	}

	// !=== UX HANDLERS -- SHOULD NOT BE IN THIS APP? === */

	// Load specific requirements
	var newComic = document.getElementById('new_comic_record');
	var newComicSubmit = document.getElementById('new_comic');
	var newComicElements = newComic.elements;

	// Add listener for a submit, and make sure no page reload happens
	var newComicCallback = function() {
		console.log('New record, let\'s start here!');
		var existing_series = false;
		comic_series.forEach(function(element,index) { 
			if(element.name === newComicElements.new_series.value) {
				existing_series = index;
			}
		});
		if(existing_series === false) {
			existing_series = comic_series.push(
				new Series(newComicElements.new_series.value, newComicElements.new_year.value)) - 1;
		}
		// Add new comic to the database
		var new_comic_id = comics.push(new Comic(comic_series[existing_series].name, newComicElements.new_issue.value, newComicElements.new_year.value));
		// Display the title to the end of our list
		output(comics[new_comic_id-1].getTitle().trim() + '<br />');
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

	/* !=== END BAD CODE HERE ===1 */

	/* == COMIC BOX PUBLIC METHODS == */

	// Add a series listing to the Application
	comicbox.list_series = function() {
		var list = "";
		list += '<ul>';
		// Loop through each series and spit out the name
		for (var i = comic_series.length - 1; i >= 0; i--) {
			list += '<li>' + comic_series[i].getTitle() + '</li>';
		};
		list += '</ul>';
		output(list);
	}

	// Launch initial comic box functionality and list
	comicbox.main = function() {

		// Search for existing database within localStorage
		if(localStorage.getItem('comic_series')) {
			output('Loading existing database...');
			JSON.parse(localStorage.getItem('comic_series')).forEach(function(element, index) {
				comic_series.push(new Series(element.name, element.year, element.publisher));
			});
		} 
		// Nothing found, so create a basic example database
		else {
			alert('No DB exists, so I\'ll create a demo for you');
			comic_series.push(new Series('Uncanny X-Men', 1969, 'Marvel'));
			comic_series.push(new Series('Fantastic Four', 1962, 'Marvel'));
			// Store the current Comic Series database into LocalStorage for persistance
			localStorage.setItem('comic_series', JSON.stringify(comic_series));
		}
		
		comicbox.list_series();
				
	};

	return comicbox;

}(s)).main();