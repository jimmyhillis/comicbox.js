// COMIC BOOK JAVASCRIPT APPLICATION
// This is a practice application that allows me to
// build and work through a basic Comic Book database
// made up of a number of Objects which are linked 
// together. The purpose being the ability to propagate
// and load all related comics.

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

// Start building an APP of objects (Comics, Series, etc.)
var COMICBOX = {}

// Object format for a single comic issue
COMICBOX.Comic = function(series, issue, year) {
	return {
		'series': series || 'Amazing Spider-Man',
		'issue': issue || 1,
		'year': year || 1969,
		'getTitle': function() {
			return this.series.getTitle() + ' #' + this.issue;
		}
	}
}

// Object format for a Comic Book Series (eg. The Amazing Spider-Man (1999))
COMICBOX.Series = function(name, year, publisher) {
	return {
		'name': name,
		'year': year,
		'publisher': publisher,
		'getTitle': function() {
			return this.name + ' (' + this.year + ')';
		}
	}
}

// Add a series listing to the Application
COMICBOX.list_series = function() {
	var list = "";
	list += '<ul>';
	// Loop through each series and spit out the name
	for (var i = COMICBOX.comic_series.length - 1; i >= 0; i--) {
		list += '<li>' + COMICBOX.comic_series[i].getTitle() + '</li>';
	};
	list += '</ul>';
	document.write(list);
}

// Create an array of Comic series
COMICBOX.comic_series = new Array(
		new COMICBOX.Series('Amazing Spider-Man', 1969, 'Marvel'),
		new COMICBOX.Series('Uncanny X-Men', 1969, 'Marvel'),
		new COMICBOX.Series('Fantastic Four', 1962, 'Marvel')
);

// MAIN CODE AND TESTS FOR THE ABOVE CODE

COMICBOX.main = function() {
	COMICBOX.list_series();
	c = new COMICBOX.Comic(COMICBOX.comic_series[1], 2);
	document.write(c.getTitle().trim() + '<br />');
	d = new COMICBOX.Comic(COMICBOX.comic_series[2], 24, 1972);
}();