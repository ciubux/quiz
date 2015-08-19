var getfecha = function getDateTime(date) {
	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;
	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;
	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;
	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;
	    return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;
	};

// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if (req.session.user) {	
	
	var fechaActual = new Date();
        fechaActual.setMinutes(fechaActual.getMinutes()-2);
	var fechaSession = req.session.fecha;
	console.log('Fecha actual: '+getfecha(fechaActual));
	console.log('Fecha session: '+fechaSession);

	if(getfecha(fechaActual) > fechaSession )
	{
		 res.redirect('/login');	
	}
	else
	{
	        next();
	}
    } else {
        res.redirect('/login');
    }
};


// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");        
            return;
        }

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};
	req.session.fecha = getfecha(new Date());

        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion 
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
