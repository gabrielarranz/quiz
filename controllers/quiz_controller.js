var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
// GET /quizes?search=patron
exports.index = function(req, res) {
  var consulta;
  // en función de la existencia del parámetro preparamos query
  if (req.query.search) {
    query = {
      where: ["pregunta like ?", '%' + req.query.search + '%'],
      order: ["pregunta"]
    };
  }
  else {
    query = {} ;
  }
  models.Quiz.findAll(consulta).then(
    function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: []});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /author
exports.author = function(req, res) {
   res.render('author', {nombre: 'gabrielarranz', errors: []});
};


// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

  quiz.validate().then (
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        // save: guarda en DB campos pregunta y respuesta de quiz
        quiz .save({fields: ["pregunta", "respuesta"]}).then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
};
