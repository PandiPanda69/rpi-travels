express = require('express')
router = express.Router()

# GET on homepage
router.get '/', (req, res) ->
  res.render 'index'
  return

module.exports = router

