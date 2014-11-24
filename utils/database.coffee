database = require('sqlite3')
config = require("../config")()


module.exports =
  db: null

  connect: ->
    console.log 'Connection to database ' + config.database_path
    @db = new database.Database config.database_path
    return

  close: ->
    @db.close ->
      console.log 'Database driver shut down.'
      return
    return
