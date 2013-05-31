module.exports = function(sequelize, DataTypes){
	return sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER, 
			primaryKey: true, 
			autoIncrement: true
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		imie: DataTypes.STRING, 
		nazwisko: DataTypes.STRING, 
		email: {
			type: DataTypes.STRING, 
			allowNull: false
		},
		type: {
			type: DataTypes.INTEGER, 
			allowNull: false
		}
	}, 
	{
		timestamps: false,
		tableName: 'user'
	});
};