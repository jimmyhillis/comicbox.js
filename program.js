/* 
 * This file is a simple example UX for the Comicbox.js
 * application I've programmed. The functionality below
 * allows a HTML UI to be built and interface a user with
 * the comicbox.js application.
 *
 * @author Jimmy Hillis <jimmy.hillis@me.com>
 * @see https://github.com/jimmyhillis/comicbox.js/
 * @version 0.1
 * @updated 05/04/2012
 */

/* == UX HANDLERS == */
// The following code allows me to interface with the JsComicBook
// application, without having loosley related code inside there.
// This will split the presentation + the functionality in a more
// MVC manner (at least it's a start!)

(function () {

	var 
		// depdencies
		app = COMICBOX,

		ui_form = document.getElementById('new_records'),
		current_sort = "name",
		newSeriesCallback, 
		newComicCallback,
		sortComicsCallback,
		commitCallback,
		selectSeriesHelper;

	// This event listener adds a new SERIES to the database
	// from the user input, once validataed
	newSeriesCallback = function () {

		var title = ui_form.new_series_name.value || false,
			year = ui_form.new_series_year.value || false;

		// Very basic form validation to confirm they are entered
		if (!title || !year) {
			alert('You must enter in all fields before adding a new Series');
			return false;
		}

		app.addSeries(title, year);
		app.listSeries();
		attachCallback("deleteAction", deleteComicCallback);

		return app;
	};

	// This event listener adds a new COMIC to the database
	// from the user input, once validataed
	// @purpose
	// @return suc
	newComicCallback = function () {
		
		// Function variables for the new series + user input
		var new_comic = {},
			series = ui_form.new_comic_series.value || false,
			issue = ui_form.new_comic_issue.value || false;
		
		// Very basic form validation to confirm they are entered
		if (!series || !issue) {
			alert('You must enter in all fields before adding a new Comic');
			return false;
		}

		new_comic = app.addComic(series, issue).listSeries();
		attachCallback("deleteAction", deleteComicCallback);

		return app;
	};

	deleteComicCallback = function () {
		
		var series_title;

		console.log('Delete this comic... in progress!');
		series_title = this.parentNode.getElementsByClassName('series_title')[0].innerHTML;
		app.removeSeries(series_title).listSeries();
		attachCallback("deleteAction", deleteComicCallback);

	};

	sortComicsCallback = function () {
		this.value = "Sort by " + current_sort;
		if (current_sort === "name") {
			current_sort = "year";
		} else {
			current_sort = "name";
		}

		app.sortSeries(current_sort).listSeries();
		attachCallback("deleteAction", deleteComicCallback);

		return app;
	};

	// Commit callback
	// @purpose This function will commit the current status of the database
	// @return APP for chaining
	commitCallback = function () { 
		app.commit();
		return app;
	};

	selectSeriesHelper = function() {
		var found_series;
		if(this.value.length > 3) {
			// Search and replace input with found series, if nay
			found_series = app.findSeries(this.value, true);
			if (found_series) {
				this.value = found_series.getTitle();				
			}
		} // fi enough characters to search
	};
	
	// Attach events to form listeners to the submit button
	// and cancel out the form from refreshing, if there is a
	// JS error
	ui_form.new_series_submit.onclick = newSeriesCallback;
	ui_form.new_comic_submit.onclick = newComicCallback;
	ui_form.commit.onclick = commitCallback;
	ui_form.sort.onclick = sortComicsCallback;
	ui_form.new_comic_series.onkeyup = selectSeriesHelper;

	// Simple function to add listener to ALL class elements
	(attachCallback = function (class_name, callback) {
		var elements = document.getElementsByClassName(class_name),
			i = elements.length, e;
		for (i; i--;) {
			e = elements[i];
			e.onclick = callback;
	  }
	})("deleteAction", deleteComicCallback);

	// Stop the form from submitting, in the event of a crash
	// on the ADD NEW code, should use TRY/CATCH
	ui_form.onsubmit = function () {
		return false;
	}

}());

/* This function simply uses the TWEETS
 * library to load my Twitter feed and put the
 * first 3 tweets into the UX.
 */
(function () {

	var appendTweets;

	appendTweets = function appendTweets(tweets) {

		var i, max, element, tweet_txt, url, real_url,
			content = document.getElementById('twitter-content');

		for(i = 0, max = tweets.length; i < max; i++) {
			
			element = document.createElement('p');

			if (tweets[i].entities.urls.length > 0) {
				url = tweets[i].text.substring(tweets[i].entities.urls[0].indices[0], tweets[i].entities.urls[0].indices[1]);
				// Turn it into a real URL
				real_url = '<a href="' + url + '">' + url + '</a>';
				tweets[i].text = tweets[i].text.replace(url, real_url);
			}

			element.innerHTML = tweets[i].text;
			content.appendChild(element);
		
		}

	}

	TWEETS.getTweets("ppjim3", 3, appendTweets);

}());