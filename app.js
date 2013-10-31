var express = require('express');
var config = require('./config.json');
var PhoneticKeyGenerator = require('./lib/phonetic');
var keyGenerator = new PhoneticKeyGenerator();
var database = require('./lib/database');
var check = require('validator').check;
var bcrypt = require('bcrypt');

// reload config file without restarting the process
process.on('SIGHUP', function(){
    config = require('./config.json');
    console.log('Reloaded config file.');
});

var generateAlias = function(length, cb){
    var alias = keyGenerator.createKey(length);

    if(database.urls.hasOwnProperty(alias))
        generateAlias(length, cb);
    else
        cb(alias);
}

var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res){
    res.redirect(config['default']);
});

app.get('/:alias', function(req, res){
    var alias = req.params.alias;

    if(!database.urls[alias]){
        res.status(404);
        res.end();
        return;
    }

    res.redirect(database.urls[alias]);
});

app.post('/create', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var url = req.body.url;

    if(!username || !password || !config.users[username]){
        res.status(403);
        res.end();
        return;
    }

    if(!url || !check(url).isUrl()){
        res.status(400);
        res.end();
        return;
    }

    bcrypt.compare(password, config.users[username], function(err, result){
        if(err){
            res.status(500);
            res.end();
            return;
        }

        if(!result){
            res.status(403);
            res.end();
            return;
        }

        generateAlias(config.length, function(alias){
            database.urls[alias] = url;
            database.save(function(err){
                if(err){
                    res.status(500);
                    res.end();
                    return;
                }

                res.status(201);
                res.json({
                    alias: alias
                });
                return;
            });
        });
    });
});

app.use(function(req, res){
    res.status(404);
    res.end();
});

app.listen(config.port, config.host, function(){
    console.log('Nodejshort listening on', config.host + ':' + config.port);
});
