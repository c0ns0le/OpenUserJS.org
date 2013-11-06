var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

	
	
function UserScript(){
	this.Id = -1;
	this.Revision = 1;
	
	this.Author = "";
	this.Name = "";
	this.Version = "1.0";
}



function UserScripts(){
	// Reference;
	var that = this;
	
	// List of actions to execute;
	this._actions = [];
	
	// Database;
	this._db = null;
	
	// Execute list of actions;
	this._Execute = function(){
		// Check if a connection has been made;
		if(that._db != null){
			// Execute all actions;
			that._actions.concat().forEach(function(item){
				// Remove the current action;
				that._actions.shift();
				
				item();
			});
		}
	};
	
	// Connect to db;
	MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
		console.log("connected to mongodb");
		if (err) throw err;
		that._db = db.collection('test');
		that._Execute();
	});
	console.log(this._db);
}

UserScripts.prototype.Count = function(fn){
	return this._db.count(function (err, count) {
 		if (err) throw err;
		return fn(count);
    });
};

UserScripts.prototype.Add = function(script){
	this._actions.push(proxy(function(s){
		this.Count(proxy(function (count){
			// Increase id;
			s.Id = count + 1;
			// Insert script into db;
			this._db.insert(s, function(err, records) {
				if (err) throw err;
				console.log("Record added as "+records[0]._id);
			});
		}, this));
	}, this, script));
	
	this._Execute();
};

UserScripts.prototype.Update = function(script){
	this._actions.push(proxy(function(s){
		// Increase revision;
		s.Revision++;
		// Update script in db;
		this._db.update(s, function(err, records) {
			if (err) throw err;
			console.log("Record added as "+records[0]._id);
		});
	}, this, script));
	
	this._Execute();
};



var UserScriptsGuid = 1;



// Copyright jQuery;
function proxy( fn, context ) {
	var args, proxy, tmp;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, otherwise just return undefined.
	if ( typeof fn !== "function" ) {
		return undefined;
	}

	// Simulated bind
	args = [].slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( [].slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || UserScriptsGuid++;
	
	return proxy;
};


/////////////






var userScript1 = new UserScript();
userScript1.Name = "UserScript2";


var userScripts = new UserScripts();
userScripts.Add(userScript1);