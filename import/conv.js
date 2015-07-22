var fs         = require('fs');

fs.readFile('/home/slack/tmp/convertcsv.json', 'utf8', function (err, data) {
    var obj, 
        items = [];
    try {
        obj = JSON.parse(data);
    } catch (e) {
        console.log(e);
        return;
    }
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i], 
            _item = {};
        for (var key in item) {
            if ('latitude' === key || 'longitude' === key)
                continue;
            _item[key] = item[key];
        }
        _item.position = {
            latitude  : item.latitude,
            longitude : item.longitude
        };
        _item.tin = (Math.random()*100 | 0) + '-' + (Math.random()*100000000 | 0);
        items.push(_item);
    }
    fs.writeFile('./out.json', JSON.stringify(items));
});
