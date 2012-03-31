var TWEETS = (function (username) {

	var 
		tweets = {},
		twitter_url = "https://api.twitter.com/1/statuses/user_timeline.json?",
		entities,
		retweets,
		screen_name,
		tweetcount,
		buildRequest = function() {};

	buildRequest = function() {
		var apiCall = twitter_url + "include_entities=true&include_rts=true" +
			"&screen_name=" + screen_name + "&count=" + tweetcount;
		return apiCall;
	}

	requestTweets = function(url) {
		xmlHttpRequst = new XMLHttpRequest();
		// Open Http Request connection
		xmlHttpRequst.open("GET", url, true);
		// Callback when ReadyState is changed.
		xmlHttpRequst.onreadystatechange = function() {
			if (xmlHttpRequst.readyState == 4) {
				alert(xmlHttpRequst.responseText);
			}
		}
		xmlHttpRequst.send();
	}

	tweets.getTweets = function(username, count, callback) {

		var twitter_api_call;

		screen_name = username;
		tweetcount = count;
		twitter_api_call = buildRequest();

		loadJSONP(twitter_api_call, callback);

	}

	return tweets;

})();

/* 
loadJSOP Gist from Github
https://gist.github.com/132080
*/

var loadJSONP = (function(){
  var unique = 0;
  return function(url, callback, context) {
    
    // Initalize the URL and append callback function
    var name = "_jsonp_" + unique++;
    if (url.match(/\?/)) url += "&callback="+name;
    else url += "?callback="+name;
    
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
