/**
* tweets.js
*
* @author Jimmy Hillis <jimmy.hillis@me.com>
* @see http://github.com/jimmyhillis/tweets.js
* @version 0.1
*
* For API information and guides:
* @see http://github.com/jimmyhillis/tweets.js/README.md 
* 
* A very simple async Twitter tweet pulling script for quickly 
* loading a number of tweets into your page (or any JS script). 
* This module will create NO markup and should be used when a
* dev wants to setup their own markup or use the tweets for
* another JS purpose (counting, searching, etc.)
*
*/

var TWEETS = (function (username) {

	var 
		// depdendancies

		// constants
		API_URL = "https://api.twitter.com/1/statuses/user_timeline.json?",
		
		// public
		getTweets = function () {},

		// private
		userCallback = function () {},
		buildRequest = function () {},
		passTweetToCallback = function () {};

	/* Builds a Twitter API request string for retrieving
	 * the latest Tweets from a users feed
	 *
	 * @return string
	 *		Returns a HTTP request URL for the users feed via Twitter REST API
	 */
	buildRequest = function(local) {
		
		return API_URL + "include_entities=true&include_rts=true" +
			"&screen_name=" + local.screen_name + "&count=" + local.tweetcount;

	}

	/* Calls user callback function after ensuring the
	 * feed was cached in localStore for further
	 * requestes to the same feed.
	 */
	passTweetToCallback = function(twitterTweets) {

		cachedTweets = {}

		/* Cache the returned Tweets for
		 * any other load within 30 minutes. 
		 */

		cachedTweets.cachetime = new Date().getTime();
		cachedTweets.tweets = twitterTweets;

		localStorage.setItem('TWEETS', JSON.stringify(cachedTweets));
		userCallback(cachedTweets.tweets);

	}

	getTweets = function(username, count, callback) {

		var twitter_api_call,
			twitter_api_url = '',
			cachedTweets,
			refreshCacheTime = new Date();

		/* If user hasn't provided a callback 
		 * then don't bother and return false
		 */
		if (typeof callback === "function") {
			userCallback = callback;
		}
		else {
			return false;
		}

		/* Lets be sure we haven't already cached 
		 * the users Tweet stream in localStorage
		 * for the current session.
		 */
		if (localStorage.getItem('TWEETS')) {

			/* If the feed hasn't been updated for 3 hours
			 * then you can refresh it.
			 */
			refreshCacheTime.setHours(refreshCacheTime.getHours() - 3);
			cachedTweets = JSON.parse(localStorage.getItem('TWEETS'));

			if (cachedTweets.cachetime >= refreshCacheTime) {
				console.log('use local cache');
				return userCallback(cachedTweets.tweets);
			}			

		} 

		console.log("No tweets, let's do this oldschool!");
		
		/* Build a TWITTER API request and load it 
		 * with JSONP and pass the data to the callback */
		twitter_api_call = buildRequest({ 'screen_name': username, 'tweetcount': count });
		loadJSONP(twitter_api_call, passTweetToCallback);

	}

	return {
		'getTweets': getTweets
	};

})();

/* 
loadJSOP Gist from Github
https://gist.github.com/132080
*/

var loadJSONP = (function() {

  var unique = 0;
  
  return function (url, callback, context) {
    
    // Initalize the URL and append callback function
    var name = "_jsonp_" + unique++;
    
    // Check if the URL already has GET variables attached
    if (url.match(/\?/)) {
    	url = url + "&callback=" + name;
    } else {
    	url = url + "?callback=" + name;
    }
    
    // Create script
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    
    // Setup handler
    window[name] = function(data){
      callback.call((context || window), data);
      document.getElementsByTagName('head')[0].removeChild(script);
      script = null;
      delete window[name];
    };
    
    // Load JSON
    document.getElementsByTagName('head')[0].appendChild(script);

  };

})();
