Grader
======
### Badges
[![Build Status](https://travis-ci.org/mlfryman/grader.svg)](https://travis-ci.org/mlfryman/grader)
[![Coverage Status](https://coveralls.io/repos/mlfryman/grader/badge.png)](https://coveralls.io/r/mlfryman/grader)

### About
Grader is a Node.js application to be used in an education context. It allows teachers to keep track of their students' grades.

### Models
```
Priority
------------
name
color
value
------------
-.collection
------------
#save
------------
.all
.findById
  
```
```
Task
------------
name
due
photo
.isComplete
tags
priorityID
------------
-.collection
------------
#save
------------
.all
.findById
  
```
### Features
- Object Oriented
- MVC
- TDD
- Mocha
- MongoDB
- Jade
- Express

### Running Tests
```
$ npm install
$ npm test
```
### Contributors
- [Melanie Fryman](https://github.com/mlfryman)

### License
- [MIT](LICENSE)
