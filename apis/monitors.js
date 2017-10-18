const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('../config/db.js')

const router = express.Router()

router.use(bodyParser.json())

router.param('id', function (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT id,monitor_code,monitor_name,project_code,building_code,port_name,baud_rate,stop_bit,parity_check,channel_count,create_date,remark FROM B_Monitor'
  connection.query(sql, function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.send('ID must be integer')
  }
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT id,monitor_code,monitor_name,project_code,building_code,port_name,baud_rate,stop_bit,parity_check,channel_count,create_date,remark FROM B_Monitor WHERE id=?'
  connection.query(sql, [id], function (err, result) {
    res.json(err ? err : result[0])
  })
  connection.end()
})

router.post('/', (req, res) => {
  const keys = Object.keys(req.body)
  const sql = `INSERT INTO B_Monitor(${keys.join(',')}) VALUES(${keys.map(key => '?').join(',')})`
  const sqlParams = keys.map(key => req.body[key])
  console.log(sql)
  console.log(sqlParams)

  const connection = mysql.createConnection(dbConfig)
  connection.query(sql, sqlParams, function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.send('ID must be integer')
  }

  const keys = Object.keys(req.body).filter(key => key !== 'id' && key !== 'create_date')
  const sql = `UPDATE B_Monitor SET ${keys.map(key => `\`${key}\`=?`).join(',')} WHERE Id=?`
  const sqlParams = keys.map(key => req.body[key])
  sqlParams.push(id)

  console.log(sql)
  console.log(sqlParams)

  const connection = mysql.createConnection(dbConfig)
  connection.query(sql, sqlParams, function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.send('ID must be integer')
  }
  const connection = mysql.createConnection(dbConfig)
  const sql = 'DELETE FROM B_Monitor WHERE id=?'
  connection.query(sql, [id], function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

module.exports = router
