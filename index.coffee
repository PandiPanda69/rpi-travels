express = require("express")
path = require("path")
favicon = require("serve-favicon")
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
routes = require("./routes/index")
markers = require("./routes/marker")
database = require("./utils/database")
config = require("./config")()


app = express()

# Boilerplate conf
app.use logger(config.logger, config.logger_options)

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser()
app.use express.static(path.join(__dirname, "public"))

# View engine setup
app.set "views", path.join(__dirname, "views")
app.set "view engine", "jade"


# Request mapping
app.use "/", routes
app.use "/marker", markers

# catch 404 and forward to error handler
app.use (req, res, next) ->
  err = new Error("Not Found")
  err.status = 404
  next err
  return


# error handlers

# development error handler
# will print stacktrace
if config.mode is "dev"
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render "error",
      message: err.message
      error: err

    return


# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  res.status err.status or 500
  res.render "error",
    message: err.message
    error: {}

  return

# Start listening
server = app.listen config.port, -> 
  console.log 'Started on ' + config.port
  database.connect()
  return

# Register events to properly close server
cleanup = ->
  server.close ->
    console.log 'Closing server...'
    database.close()
    return
  return
  

process.on 'SIGTERM', cleanup
process.on 'SIGINT',  cleanup

module.exports = app
