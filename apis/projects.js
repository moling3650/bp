const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('../config/db.js')

const router = express.Router()

router.use(bodyParser.json())

router.param(['id', 'code'], function (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT id,project_code,project_name,province,city,pm,phone_no,create_date,remark FROM B_Project'
  connection.query(sql, function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  if (!id) {
    return res.send('project ID must be integer')
  }
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT id,project_code,project_name,province,city,pm,phone_no,create_date,remark FROM B_Project WHERE id=?'
  connection.query(sql, [id], function (err, result) {
    res.json(err ? err : result[0])
  })
  connection.end()
})

router.post('/', (req, res) => {
  const keys = Object.keys(req.body).filter(key => !/^(id|create_date)$/i.test(key))
  const sql = `INSERT INTO B_Project(${keys.join(',')}) VALUES(${keys.map(key => '?').join(',')})`
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
    return res.send('project ID must be integer')
  }

  const keys = Object.keys(req.body).filter(key => !/^(id|create_date)$/i.test(key))
  const sql = `UPDATE B_Project SET ${keys.map(key => `\`${key}\`=?`).join(',')} WHERE Id=?`
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
    return res.send('project ID must be integer')
  }
  const connection = mysql.createConnection(dbConfig)
  const sql = 'DELETE FROM B_Project WHERE id=?'
  connection.query(sql, [id], function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

router.get('/:code/uppers', (req, res) => {
  const code = req.params.code
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT upper_code AS value,upper_name AS label FROM B_Upper_Monitor WHERE project_code=?'
  connection.query(sql, [code], function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

module.exports = router
