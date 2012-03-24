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
		if (typeof element === "undefined") {
			console.log("Not set, using the default to clear.");
			element_id = comicbox.output_element;
		}
		element = document.getElementById(element_id);
		element.innerHTML = '';
	}

	/* == OBJECT TYPES FOR COMIC BOX == */

	// Comic constructor
	Comic = function (issue, month, year, writer, penciller) {
		this.issue = issue || 1;
		this.month = month || 1;
		this.year = year || 1969;
		this.writer = writer || "";
		this.penciller = penciller || "";
	}
	// Return the title of the comic issue based on SERIES #ISSUE {YEAR}
	Comic.prototype.getTitle = function () {
		return '#' + this.issue + ' ' + this.month + '/' + this.year;
	};

	// Comic series constructor {e.g. The Amazing Spider-Man (1999)}
	Series = function (name, year, publisher) {
		this.name = name;
		this.year = year;
		this.publisher = publisher;
		this.comics = [];
	};
	
	// Returns the complete title for this Series (e.g. Avengers (2011))
	Series.prototype.getTitle = function () {
		return this.name + ' [' + this.year + ']';
	}

	// Determines the equality of 2 series objects
	Series.prototype.isEqual = function (series) { 
		if (this.constructor !== "Series") {
			return false;
		} else if (this.getTitle() === series.getTitle()) {
			return true;
		};
		return false;
	}

	// Adds a new Comic to the current series
	Series.prototype.addComic = function (comic) {
		// Confirm param is a Comic object
		if (typeof comic !== "object") {
			return false;
		} else if (!(comic instanceof Comic)) {
			return false;
		};
		// Add the comic object to this Series array of scomics
		this.comics.push(comic);
		return this;
	}

	// Returns a {String} list of all current Issues of this Series
	Series.prototype.listComics = function () {
		
		var i, issues = "";

		for (i = this.comics.length; i--;) {
			issues = issues + "#" + this.comics[i].issue + " ";
		};

		return issues.trim();
	}

	/* == COMIC BOX PUBLIC METHODS == */

	// Creates and adds a new Series to the current database
	// @param name {String} The name of this series
	// @param year {Number} The year this series started
	// @param publisher {Object} The publisher of this series
	// @return new Series object
	comicbox.addSeries = function (name, year, publisher) {
		
		var new_index, new_series, i;
		
		// Create a new Series object
		new_series = new Series(name, year, publisher);
		// Check if series already exists, and return that if so
		for (i = comic_series.length; i--;) {
			if (comic_series[i].isEqual(new_series)) {
				console.log('It\'s here, so lets not bother!');
				return comic_series[i];
			}
		}
		// Not found, add a new one
		new_index = comic_series.push(new Series(name, year, publisher));
		new_series = comic_series[new_index-1];
		this.sortSeries();
		return new_series;
	}

	// Searches existing Series for a matching title
	// @param title {String} Entire specified title in the Name [YYYY] format
	// @return Series object if found false if not
	comicbox.findSeries = function (title) {
		
		var i;
		
		for (i = comic_series.length; i--;) {
			if (comic_series[i].getTitle() === title) {
				console.log('Found it, better return it!');
				return comic_series[i];
			}
		}
		return false;
	}

	// Orders the comic series database in order by the supplied property
	// @param field {String} ["name", "year"]
	// @return this
	// @chainable
	comicbox.sortSeries = function (field) {
		
		field = typeof field !== "undefined" ? field : "name";
		
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
		if (a.year < b.year) {
			return 1;
		} else if (a.year > b.year) {
			return -1;
		} else {
			return 0;
		}
	};
	var byName = function (a, b) {
		if (a.getTitle() < b.getTitle()) {
			return 1;
		} else if (a.getTitle() > b.getTitle()) {
			return -1;
		} else {
			return 0;
		}
	};

	// Outputs an HTML markup of all series in the database
	// @return this
	// @chainable
	comicbox.listSeries = function (with_comics) {
		
		var list = "";
		with_comics = with_comics || true;

		list += '<ul>';
		// Loop through each series and spit out the name
		for (var i = comic_series.length - 1; i >= 0; i--) {
			list = list + '<li>';
			list = list + comic_series[i].getTitle();
			if (with_comics) {
				list = list + " (" + comic_series[i].listComics() + ")";
			}
			list = list + '</li>';
		};
		list += '</ul>';
		clear();
		output(list);

		return this;
	}

	// Adds a Comic to the specified Series within your database
	// @param series {Series Object} The series this new issue belongs too
	// @param issue {Number} The issue number of this comic
	// @return new Comic
	comicbox.addComic = function (title, issue) {

		var series, new_comic;

		// Validate input
		if (!title || !issue) {
			return false;
		}

		// Look for an index and load the actual Series
		if (typeof title === "string") {
			series = this.findSeries(title);
		} else {
			return false;
		}

		// Create a new comic and add it to the correct Series
		new_comic = new Comic(issue);
		series.addComic(new_comic);

		return new_comic;
	}

	// Saves the current database to localStorage for persistence 
	// @return this
	// @chainable
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
		if (localStorage.getItem('comic_series')) {
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
		}
		this.sortSeries().listSeries();
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
	var ui_form = document.getElementById('new_records'),
		current_sort = "name";

	// Init some of the form fields for a better UX experience


	// This event listener adds a new SERIES to the database
	// from the user input, once validataed
	var newSeriesCallback = function () {

		var new_series,
			title = ui_form.new_series_name.value || false,
			year = ui_form.new_series_year.value || false;

		// Very basic form validation to confirm they are entered
		if (!title || !year) {
			alert('You must enter in all fields before adding a new Series');
			return false;
		}

		new_series = app.addSeries(title, year);
		app.listSeries();

		return app;
	};

	// This event listener adds a new COMIC to the database
	// from the user input, once validataed
	// @purpose
	// @return suc
	var newComicCallback = function () {
		// Function variables for the new series + user input
		var new_series,
			series = ui_form.new_comic_series.value || false,
			issue = ui_form.new_comic_issue.value || false;
		// Very basic form validation to confirm they are entered
		if (!series || !issue) {
			alert('You must enter in all fields before adding a new Comic');
			return false;
		}
		var new_comic = app.addComic(series, issue);
		app.listSeries();
		console.log('Added a new Comic: ' + new_comic.getTitle());
		return app;
	};

	var sortComicsCallback = function () {
		this.value = "Sort by " + current_sort;
		if (current_sort === "name") {
			current_sort = "year";
		} else {
			current_sort = "name";
		}
		return app.sortSeries(current_sort).listSeries();
	}

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
	ui_form.new_series_submit.onclick = newSeriesCallback;
	ui_form.new_comic_submit.onclick = newComicCallback;
	ui_form.commit.onclick = commitCallback;
	ui_form.sort.onclick = sortComicsCallback;

	// Stop the form from submitting, in the event of a crash
	// on the ADD NEW code, should use TRY/CATCH
	ui_form.onsubmit = function () {
		return false;
	}

}());