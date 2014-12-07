database = require('../utils/database')
wait = require('wait.for')

class MarkerDao

  constructor: ->
    @insert_stmt = null

  findAll: ->
    wait.forMethod database.db, 'all', 'SELECT * FROM Marker'

  add: (data, callback) ->

    database.db.run """
		INSERT INTO Marker(latitude, longitude, description)
		VALUES(?,?,?)
	""", [data.latitude, data.longitude, data.description], (err) ->
      callback err, @lastID
      return

    return

  update: (id, data, callback) ->

    database.db.run "UPDATE Marker SET description = ? WHERE id = ?", [data.description, id], (err) ->
      callback err, @changes
      return

    return

  delete: (id, callback) ->

    database.db.run "DELETE FROM Marker WHERE id = ?", id, (err) ->
      callback? err, @changes
      return

    return

module.exports = new MarkerDao()
