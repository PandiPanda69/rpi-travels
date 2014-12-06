express = require('express')
wait = require('wait.for')
dao = require('../dao/marker')
router = express.Router()

okStatus =
  code: 'ok'

# GET all markers
router.get '/', (req, res) ->
  wait.launchFiber getHandler, req, res
  return

# POST new marker
router.post '/', (req, res) ->
  wait.launchFiber postHandler, req, res
  return

# PUT an exisintg marker
router.put '/:id', (req, res) ->
  wait.launchFiber putHandler, req, res
  return

# DELETE a marker
router.delete '/:id', (req, res) ->
  deleteHandler req, res
  return


getHandler = (req, res) ->
  res.json dao.findAll()
  return

postHandler = (req, res) ->
  marker = req.body
  id = wait.forMethod dao, 'add', marker
  
  marker.id = id
  res.json marker

  return

putHandler = (req, res) ->
  markerId = req.params.id
  marker = req.body
  changes = wait.forMethod dao, 'update', markerId, marker

  res.status = 400 if changes is not 1
  res.json marker

  return

deleteHandler = (req, res) ->
  markerId = req.params.id
  dao.delete markerId

  res.json okStatus

  return


module.exports = router

