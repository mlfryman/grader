/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var s1, s2, s3;
var sObj1 = {name:'Wesley Crusher', color:'pink'};

describe('Student', function(){
  before(function(done){
    dbConnect('grader-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      s1 = new Student(sObj1);
      s2 = new Student({name:'Diana Troy', color:'blue'});
      s3 = new Student ({name:'Jean Luc Picard', color:'red'});

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
    it('should create a student with proper attributes', function(){
      s1 = new Student(sObj1);
      expect(s1.name).to.equal('Wesley Crusher');
      expect(s1.color).to.equal('pink');
      expect(s1.tests).to.have.length(0);
      expect(s1).to.be.instanceof(Student);
      expect(s1._suspended).to.eql({suspended:'no', color:'green'});
      expect(s1._honorRoll).to.eql({honor:'no', color:'red'});
    });
  });

  describe('#avg', function(){
    it('should return the average of all test scores', function(){
      s1 = new Student(sObj1);
      s1.tests = [95, 85, 75, 65, 55];
      expect(s1.avg()).to.be.closeTo(75, 0.1);
      s1.tests = [];
      expect(s1.avg()).to.equal(0);
    });
  });

  describe('#letter', function(){
    it('should return a letter grade vased on #avg', function(){
      s1 = new Student(sObj1);
      s1.tests = [95, 85, 75, 65, 55];
      expect(s1.letter()).to.equal('C');
    });
  });

  describe('#update', function(){
    it('should update _honor based on scores', function(){
      s1 = new Student(sObj1);
      s1.tests = [96];
      s1.update();
      expect(s1._honorRoll).to.eql({honor:'yes', color:'green'});
    });

    it('should suspend a student based on fails', function(){
      s1 = new Student(sObj1);
      s1.tests = [34,16,45,72];
      s1.update();
      expect(s1._suspended).to.eql({ suspended:'yes', color:'red'});
    });
  });

  describe('#addTest', function(){
    it('should add test to student\'s tests array', function(){
      s1 = new Student(sObj1);
      s1.addTest({score: '67.1'});
      expect(s1.tests).to.have.length(1);
      expect(typeof s1.tests[0]).to.equal('number');
    });
  });

  describe('#save', function(){
    it('should save a student to the database', function(done){
      s1 = new Student(sObj1);
      s1.save(function(){
        expect(s1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.find', function(){
    it('should return an array of all the students', function(done){
      Student.find(function(students){
        expect(students).to.have.length(3);
        expect(students[0]).to.respondTo('avg');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find one student from an id string', function(done){
      Student.findById(s2._id.toString(), function(student){
        expect(student).to.eql(s2);
        done();
      });
    });
  });

});
