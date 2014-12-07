# Configuration of the app

config =
	dev:
		mode: "dev"
		port: 8080
		logger: "dev"
		database_path: './database/travels.db'
	prod:
		mode: "prod"
		port: 81
		logger: "common"
		database_path: './database/travels.db'

module.exports = (mode) ->
	config[mode or process.argv[2] or 'prod'];
