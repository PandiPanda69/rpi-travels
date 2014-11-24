express = require('express')
wait = require('wait.for')
dao = require('../dao/marker')
router = express.Router()

# GET all markers
router.get '/', (req, res) ->
  wait.launchFiber(getHandler, req, res)
  return

# POST new marker
router.post '/', (req, res) ->
  wait.launchFiber(postHandler, req, res)
  return

# PUT an exisintg marker
router.put '/:id', (req, res) ->
  console.log req.params.id
  return

# DELETE a marker
router.delete '/:id', (req, res) ->
  console.log req.params.id
  return


getHandler = (req, res) ->
  res.json dao.findAll()
  return

postHandler = (req, res) ->
  marker = req.body
  id = wait.forMethod dao, 'add', req.body
  
  marker.id = id
  res.json marker

  return

module.exports = router

