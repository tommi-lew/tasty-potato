var http = require("http");
var nodeio = require('node.io');

http.createServer(function(request, response) {
	if (request.url == '/') {
		require('node.io').scrape(function() {
		    this.getHtml('http://www.cinemaonline.sg/movies/nowshowing.aspx', function(err, $) {
				// handle request / parsing errors
	            if (err) this.exit(err.html);

				var movies = [];

				var divContainingTable = $("div[class=content]")[4];
				var table = divContainingTable.children[0];
				var tableRows = table.children;

				for (var i=0; i<tableRows.length; i++) {				
					if (typeof tableRows[i].children[1] != "undefined")
						movies.push(tableRows[i].children[1].children[0].children[0].data);
				 }
				
				var results = {};
				results['movies'] = movies;

				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write(JSON.stringify(results));
				response.end();
	        });
		});
	}  // if (request.url == '/') {
}).listen(process.env.PORT || 8888);