var models = require('../models/models.js');

exports.show = function(req, res, next)
{

var preguntas = 0;
var comentarios = 0;
var promedio = 0;
var sincomentarios = 0;
var concomentarios = 0;

	return models.Quiz.count().
	then(		function(var1){
			preguntas = var1;
			return models.Comment.count();
			}
		).
	then(function(var2){
			comentarios = var2;
			return models.Quiz.findAll({
			include: [{
				model: models.Comment
			}]});
	}).
	then(function(quizes){
		for (var i in quizes) 
		{
			if (quizes[i].Comments.length) 
			{
				++concomentarios;
			}
		}
		sincomentarios = preguntas - concomentarios;
		if(comentarios>0)
		{
			promedio = comentarios/preguntas;
		}
		res.render('statistics/show', {
			preguntas: preguntas,
			comentarios: comentarios,
			promedio: promedio,
			sincomentarios: sincomentarios,
			concomentarios: concomentarios,
			errors: []
		});
	}).catch(function(error){next(error)});
}
