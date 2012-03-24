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
var s = { 'output_element': 'records' };

var app = (function JsComicBox(settings) {
	"use strict";
	var output, clear, Comic, Series,
		comicbox = { },
		comics = [], // array of comics in your personal
		comic_series = []; // array of comic series e.g. Amazing Spider-Man (1999)

	comicbox.version = "0.1";
	comicbox.developer = "jimmy.hillis@me.com";
	comicbox.output_element = "records";

	// Function allows me to write simple markup (generally HTML) to the browser
	// for client + testing purposes
	output = function (str, element) {
		var content = document.getElementById(comicbox.output_element);
		var element = document.createElement('p');
		element.innerHTML = str;
		content.appendChild(element);
	}
	clear = function (element_id) {
		var element; // DOM element to clear
		if(typeof element === "undefined") {
			console.log("Not set, using the default to clear.");
			element_id = comicbox.output_element;
		}
		element = document.getElementById(element_id);
		element.innerHTML = '';
	}

	/* == OBJECT TYPES FOR COMIC BOX == */

	// Comic constructor
	Comic = function (series, issue, year) {
		this.series = series || 'Amazing Spider-Man',
		this.issue = issue || 1,
		this.year = year || 1969
	}
	// Return the title of the comic issue based on SERIES #ISSUE {YEAR}
	Comic.prototype.getTitle = function () {
		return ((typeof this.series === "object") ? 
			this.series.getTitle() : 
			this.series) + ' #' + this.issue + ' [' + this.year + ']';
	};

	// Comic series constructor {e.g. The Amazing Spider-Man (1999)}
	Series = function (name, year, publisher) {
		this.name = name;
		this.year = year;
		this.publisher = publisher;
		this.comics = [];
	};
	// Add prototypal functions to the Comic Series class
	Series.prototype.getTitle = function () {
		return this.name + ' [' + this.year + ']';
	}

	/* == COMIC BOX PUBLIC METHODS == */

	// Add a series listing to the comic box
	comicbox.addSeries = function (name, year, publisher) {
		var new_index, new_series;
		// Check if series already exists, and return that if so
		comic_series.forEach(function (element, index) { 
			if(element.name === name) {
				return element;
			}
		});
		// Not found, add a new one
		new_index = comic_series.push(new Series(name, year, publisher));
		new_series = comic_series[new_index-1];
		this.orderSeries();
		return new_series;
	}
	// Order all comic series by name
	comicbox.orderSeries = function (field) {
		field = typeof field !== "undefined" ? field : "name";
		console.log('here ' + this['by'+field]);
		// Sort the Comic Series array by supplied field
		switch(field) {
			case "name":
				comic_series.sort(byName);
				break;
			case "year":
				comic_series.sort(byYear);
				break;
			default:
				break;
		}
		return this;
	}
	var byYear = function (a, b) {
		console.log('By Year');
		if(a.year < b.year) {
			return 1;
		} else if(a.year > b.year) {
			return -1;
		} else {
			return 0;
		}
	};
	var byName = function (a, b) {
		console.log('By Name');
		if(a.getTitle() < b.getTitle()) {
			return 1;
		} else if(a.getTitle() > b.getTitle()) {
			return -1;
		} else {
			return 0;
		}
	};

	// Output a list of all the current series
	comicbox.listSeries = function () {
		var list = "";
		list += '<ul>';
		// Loop through each series and spit out the name
		for (var i = comic_series.length - 1; i >= 0; i--) {
			list += '<li>' + comic_series[i].getTitle() + '</li>';
		};
		list += '</ul>';
		clear();
		output(list);
		return this;
	}

	// Add a comic to the comic box
	comicbox.addComic = function (series, issue) {
		// Validate input
		if (!series || !issue) {
			return false;
		}
		// Look for an index and load the actual object
		if (typeof series === Number) {
			series = comic_series[series];
		}
		index = comics.push(new Comic(series, issue));
		return comics[index-1];
	}

	// Output a list of all the current series
	comicbox.listComics = function () {
		// @todo priority this listing function needs to be written correctly
		console.log(comics);
		return this;
	}

	// Save the current working "database" for persistance (localStorage)
	comicbox.commit = function () {
		if (comic_series.length > 0) {
			localStorage.setItem('comic_series', JSON.stringify(comic_series));
		}
		if (comics.length > 0) {
			localStorage.setItem('comic', JSON.stringify(comics));
		}
		return this;
	}

	// Launch initial comic box functionality and list
	comicbox.main = function () {
		// Search for existing database within localStorage
		if(localStorage.getItem('comic_series')) {
			output('Loading existing database...');
			JSON.parse(localStorage.getItem('comic_series')).forEach(function (element, index) {
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
		this.orderSeries().listSeries();
	};

	return comicbox;

}(s));

// Launch the App
app.main();

/* == UX HANDLERS == */
// The following code allows me to interface with the JsComicBook
// application, without having loosley related code inside there.
// This will split the presentation + the functionality in a more
// MVC manner (at least it's a start!)
(function () {
	// Load specific requirements
	var newRecordsForm = document.getElementById('new_records');

	// Init some of the form fields for a better UX experience


	// This event listener adds a new SERIES to the database
	// from the user input, once validataed
	var newSeriesCallback = function () {
		// Function variables for the new series + user input
		var new_series,
			title = newRecordsForm.new_series_name.value || false,
			year = newRecordsForm.new_series_year.value || false;
		// Very basic form validation to confirm they are entered
		if(!title || !year) {
			alert('You must enter in all fields before adding a new Series');
			return false;
		}
		var new_series = app.addSeries(title, year);
		app.listSeries();
		console.log('Added a new Series: ' + new_series.getTitle());
		return false;
	};

	// This event listener adds a new COMIC to the database
	// from the user input, once validataed
	// @purpose
	// @return 
	var newComicCallback = function () {
		// Function variables for the new series + user input
		var new_series,
			series = newRecordsForm.new_comic_series.value || false,
			issue = newRecordsForm.new_comic_issue.value || false;
		// Very basic form validation to confirm they are entered
		if(!series || !issue) {
			alert('You must enter in all fields before adding a new Comic');
			return false;
		}
		var new_comic = app.addComic(series, issue);
		console.log('Added a new Comic: ' + new_comic.getTitle());
		return true;
	};

	// Commit callback
	// @purpose This function will commit the current status of the database
	// @return APP for chaining
	var commitCallback = function () { 
		app.commit();
		return app;
	};
	
	// Attach events to form listeners to the submit button
	// and cancel out the form from refreshing, if there is a
	// JS error
	newRecordsForm.new_series_submit.onclick = newSeriesCallback;
	newRecordsForm.new_comic_submit.onclick = newComicCallback;
	newRecordsForm.commit.onclick = commitCallback;

	// Stop the form from submitting, in the event of a crash
	// on the ADD NEW code, should use TRY/CATCH
	newRecordsForm.onsubmit = function () {
		return false;
	}

}());
