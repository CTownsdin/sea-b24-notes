'use strict';

process.env.MONGO_URL = 'mongodb://localhost/notes_test';
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

require('../../server');

var expect = chai.expect;

describe('NotesServer user login testing', function() {

    var id;
    var aJWT;

    // NOTE TO TESTER, manually incriment useremail each time for easy new user testing !
    //
    // TODO:  add something that drops the DB between tests, to make Travis CI happy !

    it('should create a new user', function (done) {
        chai.request('http://localhost:3000')
        .post('/api/users')
        .send({email: 'JohnSmith796@example.com', password: 'S0methingAw3some!'})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.body).to.have.property('jwt');
            aJWT = res.body.jwt;
            done();
        });
    });

    it('should new notes', function (done) {
        chai.request('http://localhost:3000')
        .post('/v1/api/notes')
        .set({'jwt': aJWT})
        .send({ noteBody: 'get something at the store'})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.body).to.have.property('_id');
            id = (res.body._id);
            expect(res.body.noteBody).to.eql('get something at the store');
            done();
        });
    });

    it('should get an index', function(done) {
        chai.request('http://localhost:3000')
        .get('/v1/api/notes')
        .set({jwt: aJWT})
        .end(function(err, res) {
            expect(err).to.eql(null);
            expect(Array.isArray(res.body)).to.be.true;
            done();
        });
    });

    it('should be able to get a note body', function(done) {
        chai.request('http://localhost:3000')
        .get('/v1/api/notes/' + id)
        .set({jwt: aJWT})
        .end(function( err, res) {
            expect(err).to.eql(null);
            expect(res.body.noteBody).to.eql('get something at the store');
            done();
        });
    });

    it('should be able to update a note', function(done) {
        chai.request('http://localhost:3000')
        .put('/v1/api/notes/' + id)
        .set({jwt: aJWT})
        .send({noteBody: 'read a book'})
        .end(function (err, res) {
            expect(err).to.eql(null);
            expect(res.body.noteBody).to.eql('read a book');
            done();
        });
    });

    it('should be able to delete the note', function(done) {
        chai.request('http://localhost:3000')
        .delete('/v1/api/notes/' + id)
        .set({jwt: aJWT})
        .end(function (err, res) {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('success!');
            done();
        });

    });

});
