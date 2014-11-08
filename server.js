var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();
require('./routes/notes_routes')(app);

var url = process.env.MONGOHQ_URL || process.env.MONGOLAB_URI;
mongoose.connect(url);

app.use(bodyparser.json());


app.set('port', process.env.PORT || 3000);


app.listen(app.get('port'), function() {
  console.log('server running on port: %d', app.get('port'));
});
