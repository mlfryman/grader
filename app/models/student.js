'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(obj){
  this.name = obj.name;
  this.color = obj.color;
  this.tests = [];
  this._suspended = {suspended:'no', color:'green'};
  this._honorRoll = {honor:'no', color:'red'};
}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Student.prototype.avg = function(){
  if(!this.tests.length){return 0;}

  var sum = this.tests.reduce(function(a,b){return a + b;});
  return sum/this.tests.length;

};

Student.prototype.letter = function(){
  var avg = this.avg();
  if(avg < 60){
    return 'F';
  }else if(avg < 70){
    return 'D';
  }else if(avg < 80){
    return 'C';
  }else if(avg < 90){
    return 'B';
  }else{
    return 'A';
  }
};

Student.prototype.update = function(){
  if(!this.tests.length){return;}

  if(this.avg() > 95){
    this._honorRoll = {honor:'yes', color:'green'};
  }

  var count = 0;
  for(var i = 0; i < this.tests.length; i++){
    count += (this.tests[i] < 60) ? 1 : 0;
    if(count >= 3){
      this._suspended = {suspended:'yes', color:'red'};
      break;
    }
  }
};

Student.prototype.addTest = function(obj){
  var score = parseFloat(obj.score);
  this.tests.push(score);
  this.update();
};

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.find = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(o){return reProto(o);});
    cb(students);
  });
};

Student.findById = function(id, cb){
  id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:id}, function(err, obj){
    var student = reProto(obj);
    cb(student);
  });
};

module.exports = Student;

// Helper Functions
function reProto(obj){
  return _.create(Student.prototype, obj);
}
