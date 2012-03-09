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

// Start building an APP of objects (Comics, Series, etc.)
var COMICBOX = {}

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
// Add a series listing to the Application
COMICBOX.list_series = function() {
	document.writeln('<ul>');
	// Loop through each series and spit out the name
	for (var i = COMICBOX.comic_series.length - 1; i >= 0; i--) {
		document.writeln('<li>' + COMICBOX.comic_series[i].getTitle() + '</li>');
	};
	document.writeln('</ul>');
}

COMICBOX.Series = function(name, year, publisher) {
	return {
		'name': name,
		'year': year,
		'publisher': publisher,
		'getTitle': function() {
			return this.name + '(' + this.year + ')';
		}
	}
}

// Create an array of Comic series
COMICBOX.comic_series = new Array(
		new COMICBOX.Series('Amazing Spider-Man', 1969, 'Marvel'),
		new COMICBOX.Series('Uncanny X-Men', 1969, 'Marvel'),
		new COMICBOX.Series('Fantastic Four', 1962, 'Marvel')
);

// Run some code based on all the COMICBOX methods that I've written

COMICBOX.list_series();

c = new COMICBOX.Comic(COMICBOX.comic_series[1], 2);
document.writeln(c.getTitle().trim() + '<br />');

d = new COMICBOX.Comic(COMICBOX.comic_series[2], 24, 1972);
document.writeln(d.getTitle().trim());