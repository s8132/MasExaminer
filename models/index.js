
var db = {};


if(!db.hasOwnProperty('seq')){
	var Sequelize = require('sequelize');
	var sequ = new Sequelize('mas', 'root', null, {
		host: 'localhost'
	});

}

db = {
	Sequelize: Sequelize,
	seq: sequ,
	User: sequ.import(__dirname+'/User')
};

// db.User.hasMany(db.Zdjecie);
// db.Kolej.hasMany(db.Zdjecie);
// db.Kolej.hasMany(db.Stacja);
// db.Stacja.hasMany(db.Zdjecie);

module.exports = db;