var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.all('/*', function (req, res) {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.listen(port, function() {
  console.log('server running on port ' + port);
});
