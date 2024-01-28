var http = require('http');

setInterval(()=> {
    
    const bpm = Math.floor(50 + Math.random() * 180).toString();
    const oxygen = Math.floor(97 + Math.random() * 100).toString();

    var options = {
      host: 'localhost',
      path: '/device/update/HR6754JE8?bpm='+ bpm +'&oxygen='+oxygen,
    };

    var req = http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
    
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        console.log('BODY: ' + body);
        // ...and/or process the entire body here.
      })
    });
    
    req.on('error', function(e) {
      console.log('ERROR: ' + e);
    });

}, 5000);
