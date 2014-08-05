/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var s1, s2, s3;

describe('Student', function(){
  before(function(done){
    dbConnect('grader-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      var o1 = {name:'Wesley Crusher', color:'pink'};
      var o2 = {name:'Diana Troy', color:'blue'};
      var o3 = {name:'Jean Luc Picard', color:'red'};

      s1 = new Student(o1);
      s2 = new Student(o2);
      s3 = new Student(o3);

      s1.save(function(){
       s2.save(function(){
         s3.save(function(){
           done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Student object', function(){
      var o = {name:'Wesley Crusher', color:'pink'};
      var wesley = new Student(o);

      expect(wesley).to.be.instanceof(Student);
      expect(wesley.name).to.equal('Wesley Crusher');
      expect(wesley.color).to.equal('pink');
      expect(wesley._isSuspended).to.be.false;
      expect(wesley._isHonor).to.be.false;
      expect(wesley.tests).to.have.length(0);
      expect(wesley.fails).to.be.equal(0);
    });
  });

  describe('#save', function(){
    it('should save a student to the database', function(done){
      var o = {name:'Wesley Crusher', color:'pink'};
      var wesley = new Student(o);

      wesley.save(function(){
        expect(wesley._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all students from database', function(done){
      Student.all(function(students){
        expect(students).to.have.length(3);
        expect(students[0]).to.respondTo('addTest');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a student by its id', function(done){
      Student.findById(s1._id.toString(), function(student){
        expect(student.name).to.equal('Wesley Crusher');
        expect(student).to.respondTo('addTest');
        done();
      });
    });
  });

  describe('#addTest', function(){
    it('should add a new test to student\'s test array', function(){
      var o = {name:'Wesley Crusher', color:'pink'};
      var wesley = new Student(o);
      
      wesley.addTest();

      expect(wesley.tests).to.have.length(1);
      expect(wesley._isSuspended).to.be.false;
    });
  });




});
