var fs = require('fs');
var request = require('request');

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
}

function setSelfHref(obj, uri) {
    extend(obj, {"_links":{"self":{"href": uri}}});
}

fs.readFile('install.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var obj;
    try {
        obj = JSON.parse(data);
    } catch(e) {
        console.log(e);
        return;
    }

    var timestamp = Date.now() / 1000 | 0;

    for (var key in obj) {
        var batch = obj[key],
            commit = [];
        for (var i = 0; i < batch.length; i++) {
            var payload = batch[i],
                url = key + '/' + (i + 1);
            setSelfHref(payload, url);
            commit.push({
                index: i + 1,
                timestamp: timestamp,
                up: {
                    method: 'POST',
                    resource: key,
                    payload: payload
                },
                down: {
                    method: 'DELETE',
                    resource: url
                }
            });
        }

        var data = {
            targets: ['sink'],
            syncPoint: 0,
            commit: commit 
        };

        request.post({
            url: 'http://agile-oasis-7393.herokuapp.com/sync', 
            headers: {'Content-Type': 'application/json'},
            body: data,
            json: true,
            auth: {
                user: 'root',
                pass: 'root'
            }
        }, function (error, response, body) {
            console.log(JSON.stringify(body, null, 4));
            console.log('----------------------------------------------------------');
        });

    }

});

