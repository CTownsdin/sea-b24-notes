'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('resource_backend_service.js testing', function() {

  beforeEach(angular.mock.module('notesApp'));
  var Service;
  var $httpBackend;
  var notesService;
  var testNote = {'_id': '1', 'noteBody': 'hipster ipsum'};

  beforeEach(angular.mock.inject(function(ResourceBackend, _$httpBackend_){
    Service = ResourceBackend;
    $httpBackend = _$httpBackend_;
    notesService = new Service('notes');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // index()
  it('should make a get request to notes w index()', function() {
    $httpBackend.expectGET('/api/notes').respond(200, []);
    var promise = notesService.index();
    promise.success(function(data) {
      expect(Array.isArray(data)).toBe(true);
    });

    $httpBackend.flush();
  });

  // saveNew()
  it('should save a new note, w saveNew()', function() {
    $httpBackend.expectPOST('/api/notes').respond(200, testNote);
    notesService.saveNew(testNote)
    .success(function(data) {
      expect(data.noteBody).toEqual('hipster ipsum');
      expect(data._id).toEqual('1');
    });

    $httpBackend.flush();
  });

  // save()
  it('should save-update a note, w save()', function() {
    $httpBackend.expectPUT('/api/notes/1').respond(200, testNote);
    notesService.save(testNote)
    .success(function(data) {
      expect(data.noteBody).toEqual('hipster ipsum');
      expect(data._id).toEqual('1');
    });

    $httpBackend.flush();
  });

  // delete()
  it('should delete a note, w delete()', function() {
    $httpBackend.expectDELETE('/api/notes/1').respond(200);
    notesService.delete( testNote )
    .success(function(data) {
      console.log('delete response data: ' + data);
    });

    $httpBackend.flush();
  });

});
