var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({where: where}).then(function (todos) {
			res.json(todos);
	}, function (e) {
		res.status(500).json(e);
	});

});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).json({"error": "No todo found with that Id."});
		}
	}, function (e) {
		res.status(500).json(e);
	});
});

// POST  /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id     use _.without
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var foundTodo = _.findWhere(todos, {id: todoId});

	if (foundTodo) {
		todos = _.without(todos, foundTodo);
		res.json(foundTodo);
	} else {
		res.status(404).json({"error": "no todo found with that id"});
	}
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var foundTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!foundTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) { 
		// something bad happened to completed
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length !== 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(foundTodo, validAttributes); // since foundTodo REFERENCES AN OBJECT ATTRIBUTE it AUTOMATICALLY changes the object!
	res.json(foundTodo);

});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT + '.');
	});
});

