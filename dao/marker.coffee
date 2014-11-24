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
	""", [data.coords.lat, data.coords.lng], (err) ->
      callback err, @lastID
      return

    return

  update: (id, data) ->
    return

  delete: (id) ->
    return

module.exports = new MarkerDao()
