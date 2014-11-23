express = require("express")
path = require("path")
favicon = require("serve-favicon")
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
routes = require("./routes/index")
config = require("./config")()


app = express()

# Boilerplate conf
if config.mode is "dev"
	app.use logger('dev')
else
	app.use logger()

app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: false)
app.use cookieParser()
app.use express.static(path.join(__dirname, "public"))

# View engine setup
app.set "views", path.join(__dirname, "views")
app.set "view engine", "jade"


# Request mapping
app.use "/", routes

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
app.listen config.port, () -> 
  console.log 'Started on ' + config.port
  return


module.exports = app
