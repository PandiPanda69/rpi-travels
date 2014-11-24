# Configuration of the app

config =
	dev:
		mode: "dev"
		port: 8080
		database_path: './database/travels.db'
	prod:
		mode: "prod"
		port: 81

module.exports = (mode) ->
	config[mode or process.argv[2] or 'prod'];
