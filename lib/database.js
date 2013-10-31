var fs = require('fs');
var database = require('../database.json');

database.save = function(cb){
    var _database = {};

    for(var keys = Object.keys(this), i = 0; i < keys.length; i++){
        if(keys[i] !== 'save'){
            _database[keys[i]] = this[keys[i]];
        }
    }

    var json = JSON.stringify(_database);
    fs.writeFile('./database.json', json, cb);
};

module.exports = database;
