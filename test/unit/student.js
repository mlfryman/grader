/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');

var s1, s2, s3;
var o1 = {name:'Wesley Crusher', color:'pink'};

describe('Student', function(){
  before(function(done){
    dbConnect('grader-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      s1 = new Student(o1);
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
      s1 = new Student(o1);
      expect(s1).to.be.instanceof(Student);
      expect(s1.name).to.equal('Wesley Crusher');
      expect(s1.color).to.equal('pink');
      expect(s1.tests).to.have.length(0);
    });
  });

  describe('#avg', function(){
    it('should return the mean score of all tests', function(){
      s1.tests = [70, 80, 90];
      expect(s1.avg()).to.be.closeTo(80, 0.1);
    });
  });

  describe('#letter', function(){
    it('should return A', function(){
      s1.tests = [95];
      expect(s1.letter()).to.equal('A');
    });
    it('should return B', function(){
      s1.tests = [85];
      expect(s1.letter()).to.equal('B');
    });
    it('should return C', function(){
      s1.tests = [75];
      expect(s1.letter()).to.equal('C');
    });
    it('should return D', function(){
      s1.tests = [65];
      expect(s1.letter()).to.equal('D');
    });
    it('should return F', function(){
      s1.tests = [55];
      expect(s1.letter()).to.equal('F');
    });
  });

  describe('#addTest', function(){
    it('should add test score to student\'s record in db', function(done){
      s1.addTest({score: '90.3'}, function(){
        Student.findById(s1._id.toString(), function(student){
          expect(student.tests).to.have.length(1);
          expect(student.tests[0]).to.be.closeTo(90.3, 0.1);
          done();
        });
      });
    });
  });

  describe('#getColor', function(){
    it('should return blue for numbers 90-100', function(){
      expect(s1.getColor(95)).to.equal('blue');
    });
    it('should return green for numbers 80-89', function(){
      expect(s1.getColor(85)).to.equal('green');
    });
    it('should return orange for numbers 70-79', function(){
      expect(s1.getColor(75)).to.equal('orange');
    });
    it('should return red for numbers 60-69', function(){
      expect(s1.getColor(65)).to.equal('red');
    });
    it('should return brown for numbers less than 60', function(){
      expect(s1.getColor(55)).to.equal('brown');
    });
  });

  describe('#save', function(){
    it('should save a student to the database', function(done){
      s1 = new Student(o1);
      s1.save(function(){
        expect(s1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all students in database', function(done){
      Student.findAll(function(students){
        expect(students).to.have.length(3);
        expect(students[0]).to.respondTo('avg');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should return a student record by it\'s ID from database', function(done){
      Student.findById(s1._id.toString(), function(student){
        expect(student).to.eql(s1);
        expect(student).to.respondTo('avg');
        done();
      });
    });
  });
});
