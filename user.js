#!/usr/bin/env node
var program = require('commander');
var read = require('read');
var fs = require('fs');
var package = require('./package.json');
var config = require('./config.json');
var bcrypt = require('bcrypt');

program
    .version(package.version)
    .option('-a, --add', 'Add user')
    .option('-r, --remove', 'Remove user')
    .option('-R, --remove-all', 'Remove all users')
    .parse(process.argv);

var command = program.add ? 'add' :
    program.remove ? 'remove' :
    program['removeAll'] ? 'remove-all' : null;

var saveConfig = function(exit){
    if(typeof exit === 'undefined')
        exit = false;

    var json = JSON.stringify(config, null, 4);
    fs.writeFile('./config.json', json, function(err){
        if(err)
            console.error(err);

        if(err || exit)
            process.exit(!!err);
    });
}

switch(command) {
    case 'add':
        read({prompt: 'Username: '}, function(err, username){
            if(err){
                console.error(err);
                process.exit(1);
            }
            if(!username){
                console.error('Empty usernames are not allowed.');
                process.exit(1);
            }
            if(config.users[username]){
                console.error('User already exists.');
                process.exit(1);
            }

            read({silent: true, prompt: 'Password: '}, function(err, password){
                if(err){
                    console.error(err);
                    process.exit(1);
                }
                if(!password){
                    console.error('Empty passwords are not allowed.');
                    process.exit(1);
                }

                bcrypt.hash(password, 8, function(err, hash){
                    if(err){
                        console.error(err);
                        process.exit(1);
                    }

                    config.users[username] = hash;
                    saveConfig(true);
                });
            });
        });
        break;

    case 'remove':
        read({prompt: 'Username: '}, function(err, username){
            if(err){
                console.error(err);
                process.exit(1);
            }
            if(!username || !config.users[username]){
                console.error('User does not exist.');
                process.exit(1);
            }

            delete config.users[username];
            saveConfig(true);
        });
        break;

    case 'remove-all':
        config.users = {};
        saveConfig(true);
        break;

    default:
	    console.error('Invalid command.');
	    program.outputHelp();
	    process.exit(1);
        break;
}
