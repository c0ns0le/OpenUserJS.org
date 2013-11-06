'use strict';

var sys = require("sys"),  
	http = require("http"),  
	path = require("path"),  
	url = require("url"),  
	fs = require("fs");  
	
var HOST = 'localhost',
	PORT = 1337;

// http://roguejs.com/2011-11-30/console-colors-in-node-js/
var colors = {
	bright	: '\u001b[1m',
	red		: '\u001b[31m',
	green	: '\u001b[32m',
	yellow	: '\u001b[33m',
	blue	: '\u001b[34m',
	magenta	: '\u001b[35m',
	cyan	: '\u001b[36m',
	white	: '\u001b[37m',
	reset	: '\u001b[0m'
};

var app = function onCallback(request, response){
	var my_path = url.parse(request.url).pathname;  
	var full_path = path.join(process.cwd(), my_path);  
	fs.exists(full_path, function(exists){  
		console.log(request.url);
		if(request.url === '/'){  
			fs.readFile("index.html", "binary", function(err, file) {    
				 if(err) {    
					 response.writeHeader(500, { "Content-Type": "text/plain" });    
					 response.write(err + "\n");    
					 response.end();    
				 } else{  
					response.writeHeader(200);    
					response.write(file, "binary");    
					response.end();  
				}  
			});  
		} else if(!exists){  
			response.writeHeader(404, { "Content-Type": "text/plain" });    
			response.write("404 Not Found\n");    
			response.end();  
		} else{  
			fs.readFile(full_path, "binary", function(err, file) {    
				 if(err) {    
					 response.writeHeader(500, { "Content-Type": "text/plain" });    
					 response.write(err + "\n");    
					 response.end();    
				 } else{  
					response.writeHeader(200);    
					response.write(file, "binary");    
					response.end();  
				}  
			});  
		}  
	});  
};

http.createServer(app).listen(PORT, HOST, function onCallback() {
	console.log(colors.green + 'Server running on http://' + HOST + ':' + PORT + '...' + 
				'\n' + colors.magenta + 'Press Ctrl+C to stop!' + colors.reset);
}).on('error', function onError(e) {
	if (e.code === 'EADDRINUSE') {
		console.log(colors.bright + colors.red + 'Port (' + PORT + ') already in use!' + colors.reset);
	}
});