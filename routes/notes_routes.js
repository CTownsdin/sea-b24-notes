'use strict';
var Note = require('../models/note');

module.exports = function (app, auth) {      //  adding auth mw anywhere needed!
  app.get('/api/notes', auth, function (req, res) {  // NOTE! auth'd route, auth required
    Note.find({}, function (err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });                       // probably need to add auth mw everwhere.
                            // app.use    can do this for every route
                            //

  app.get('/api/notes/:id', function (req, res) {
    Note.findOne({'_id': req.params.id}, function (err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.post('/api/notes', function (req, res) {
    var note = new Note(req.body);
    note.save(function (err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.put('/api/notes/:id', function (req, res) {
    var note = req.body;
    delete note._id;
    Note.findOneAndUpdate({'_id': req.params.id}, note, function (err, data) {
      if (err) return res.status(500).send('there was an error');
      res.json(data);
    });
  });

  app.delete('/api/notes/:id', function (req, res) {
    Note.remove({'_id': req.params.id}, function (err) {
      if (err) return res.status(500).send('there was an error');
      res.json({msg: 'success!'});
    });
  });

  app.get('/', function (req, res) {
    res.json({'msg':'Hello, this server API'});
  });
};
