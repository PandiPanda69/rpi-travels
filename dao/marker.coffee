database = require('../utils/database')
wait = require('wait.for')

class MarkerDao

  constructor: ->
    @insert_stmt = null

  findAll: ->
    wait.forMethod database.db, 'all', 'SELECT * FROM Marker'

  add: (data, callback) ->

    database.db.run """
		INSERT INTO Marker(latitude, longitude)
		VALUES(?,?)
	""", [data.latitude, data.longitude], (err) ->
      callback err, @lastID
      return

    return

  update: (id, data, callback) ->

    database.db.run "UPDATE Marker SET latitude = ? WHERE id = ?", [data.latitude, id], (err) ->
      callback err, @changes
      return

    return

  delete: (id, callback) ->

    database.db.run "DELETE FROM Marker WHERE id = ?", id, (err) ->
      callback? err, @changes
      return

    return

module.exports = new MarkerDao()
