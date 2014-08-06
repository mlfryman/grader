'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');

function Student(o){
  this.name = o.name;
  this.color = o.color;
  this.tests = [];

  this._isSuspended = {suspended:'no', color:'green'};
  this._honorRoll = {honor:'no', color:'red'};
}

Object.defineProperty(Student, 'collection', {
  get: function(){return global.mongodb.collection('students');}
});

Student.prototype.avg = function(){
  if(!this.tests.length){return 0;}

  var sum = 0;
  for(var i = 0; i < this.tests.length; i++) {
    sum += parseInt(this.tests[i]);
    this.avg = (sum/this.tests.length).toFixed(2);
  }
  return this.avg;
};

Student.prototype.letter = function(){
  if(!this.tests.length){return 'N/A';}

  var avg = this.avg();
  if(avg >= 90){
    return 'A';
  }else if(avg >= 80){
    return 'B';
  }else if(avg >= 70){
    return 'C';
  }else if(avg >= 60){
    return 'D';
  }else{
    return 'F';
  }
};

Student.prototype._isSuspended = function(){
  if(!this.tests.length){return false;}
  var fails = 0;
  for(var i = 0; i < this.tests.length; i++){
    fails += (this.tests[i] < 60 ? 1 : 0);
    if(fails >= 3){
      this._isSuspended = true;
      break;
    }
  }
};

Student.prototype._honorRoll = function(){
  if(!this.tests.length){return false;}
  if(this.avg() > 95){
    this._honorRoll = true;
  }
};

Student.prototype.addTest = function(obj, cb){
  this.tests.push(obj.score * 1);
  this.save(cb);
};

Student.prototype.getColor = function(num){
  if(num < 60){
    return 'brown';
  }else if(num < 70){
    return 'red';
  }else if(num < 80){
    return 'orange';
  }else if(num < 90){
    return 'green';
  }else{
    return 'blue';
  }
};

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.findAll = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var students = objects.map(function(obj){return changePrototype(obj);});
    cb(students);
  });
};

Student.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findOne({_id:_id}, function(err, obj){
    var student = changePrototype(obj);
    cb(student);
  });
};

module.exports = Student;

// Private Helper Function
function changePrototype(obj){
  var student = _.create(Student.prototype, obj);
  return student;
}
