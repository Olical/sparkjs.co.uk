// Set up the fuzzy logic plugin
SparkFn.fuzzy = function(time) {
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
	
	if(isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
		return;
	}
	
	return day_diff == 0 && (
		diff < 60 && "just now" ||
		diff < 120 && "1 minute ago" ||
		diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
		diff < 7200 && "1 hour ago" ||
		diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
		day_diff == 1 && "yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
}

// Reinitialise Spark
SparkIn();

// Set up the function to handle the jsonp response
function displayTweets(data) {
	// Pull out the tweets and set up other variables
	var tweets = data.results,
		i = null;
	
	// Loop through the tweets
	for(i = 0; i < tweets.length; i++) {
		// Add the tweet to the div
		Spark('#tweetlist').element('insert', 'p', {
			innerHTML: tweets[i].text + ' <span class="light">posted ' + Spark.fuzzy(tweets[i].created_at) + '</span>'
		});
	}
	
	// Show the div
	Spark('#tweetlist').transition('fadein');
}

// Wait until the DOM is ready
Spark.ready(function() {
	// Highlight code
	prettyPrint();
	
	// Initiate the jsonp for the tweets
	Spark.jsonp('http://search.twitter.com/search.json', 'displayTweets', 'q=from%3ASparkJavaScript&rpp=5');
	
	// Listen for the learn by example click
	Spark('#lbe').event('click', function(e) {
		if(Spark(e.target).attribute().offsetWidth === 50) {
			Spark(e.target)
				.css({
					cursor: 'default'
				})
				.animate({
					width: 474,
					height: 100,
					marginLeft: 100
				}, false, false, function() {
					Spark('p', e.target)
						.transition('fadein')
						.animate({
							paddingTop: 30,
							paddingLeft: 80
						}, false, 'outElastic', function() {
							Spark(e.target).animate({
								marginLeft: 0
							}, false, 'outBounce');
						});
				});
		}
	});
});