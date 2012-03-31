/*

Developer: Jimmy Hillis / jimmy.hillis@me.com
Repository: https://github.com/jimmyhillis/comicbox.js/
Version: 0.1
Last Update: 19/03/2012

*/

/* == UX HANDLERS == */
// The following code allows me to interface with the JsComicBook
// application, without having loosley related code inside there.
// This will split the presentation + the functionality in a more
// MVC manner (at least it's a start!)

(function () {

	var ui_form = document.getElementById('new_records'),
		current_sort = "name",
		newSeriesCallback, 
		newComicCallback,
		sortComicsCallback,
		commitCallback,
		selectSeriesHelper;

	//var json_response = {"number_of_page_results": 20, "status_code": 1, "error": "OK", "results": [{"start_year": 2006, "count_of_issues": 50, "resource_type": "volume", "id": 18130}, {"start_year": 1984, "count_of_issues": 6, "resource_type": "volume", "id": 3348}, {"start_year": 2004, "count_of_issues": 6, "resource_type": "volume", "id": 10811}, {"start_year": 2004, "count_of_issues": 5, "resource_type": "volume", "id": 10810}, {"start_year": 2003, "count_of_issues": 5, "resource_type": "volume", "id": 17989}, {"start_year": 1982, "count_of_issues": 4, "resource_type": "volume", "id": 3157}, {"start_year": 1988, "count_of_issues": 4, "resource_type": "volume", "id": 4055}, {"start_year": 1989, "count_of_issues": 4, "resource_type": "volume", "id": 4251}, {"start_year": 1995, "count_of_issues": 4, "resource_type": "volume", "id": 7182}, {"start_year": 2000, "count_of_issues": 4, "resource_type": "volume", "id": 9115}, {"start_year": 2004, "count_of_issues": 4, "resource_type": "volume", "id": 10812}, {"start_year": 2003, "count_of_issues": 4, "resource_type": "volume", "id": 11379}, {"start_year": 2002, "count_of_issues": 4, "resource_type": "volume", "id": 18193}, {"start_year": 2002, "count_of_issues": 4, "resource_type": "volume", "id": 18569}, {"start_year": 1997, "count_of_issues": 3, "resource_type": "volume", "id": 6022}, {"start_year": 1993, "count_of_issues": 3, "resource_type": "volume", "id": 7183}, {"start_year": 2003, "count_of_issues": 2, "resource_type": "volume", "id": 18514}, {"start_year": 2006, "count_of_issues": 1, "resource_type": "volume", "id": 18368}, {"start_year": 1997, "count_of_issues": 1, "resource_type": "volume", "id": 18374}, {"start_year": 1997, "count_of_issues": 1, "resource_type": "volume", "id": 18391}], "limit": 20, "offset": 0, "number_of_total_results": 231};
	//console.log(json_response);
	//var this_result;

	//for(var i = json_response.results.length; i--;) {
	//	this_result = json_response.results[i];
	//	console.log('Year was ' + this_result.start_year);
	//}

	//CVrequest = "http://api.comicvine.com/search/?api_key=cee91997ac41e9914b5b27e0648829642c7020c2&format=json&resources=volume&field_list=start_year,id,count_of_issues&query=wolverine&limit=10&filter=publish_year=2011";

	// Init some of the form fields for a better UX experience

	// This event listener adds a new SERIES to the database
	// from the user input, once validataed
	newSeriesCallback = function () {

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

		new_comic = app.addComic(series, issue);
		app.listSeries();
		console.log('Added ' + new_comic + ' new comics!');
		return app;
	};

	deleteComicCallback = function () {
		console.log('Delete this comic... in progress!');
	};

	sortComicsCallback = function () {
		this.value = "Sort by " + current_sort;
		if (current_sort === "name") {
			current_sort = "year";
		} else {
			current_sort = "name";
		}
		return app.sortSeries(current_sort).listSeries();
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
	(function (class_name, callback) {
		var elements = document.getElementsByClassName(class_name),
			i = elements.length, e;
		for (i; i--;) {
			e = elements[i];
			e.onclick = callback;
	  }
	}("deleteAction", deleteComicCallback));

	// Stop the form from submitting, in the event of a crash
	// on the ADD NEW code, should use TRY/CATCH
	ui_form.onsubmit = function () {
		return false;
	}

}());

// == UX Extras and display ==
// This function loads a few external UI features such as 
// my Twitter feed and puts them where they belong. This is
// NON-ESSENTIAL code purely for visual/design needs.

(function loadUX() {

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