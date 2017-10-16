const mysql = require('mysql')
const express = require('express')
const dbConfig = require('../config/db.js')

const router = express.Router()

router.param('id', function (req, res, next) {
  next()
})

router.get('/', (req, res) => {
  const connection = mysql.createConnection(dbConfig)
  const sql = 'SELECT id,projrct_code,projrct_name,province,city,pm,phone_no,create_date,remark FROM B_Project'
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
  const sql = 'SELECT id,projrct_code,projrct_name,province,city,pm,phone_no,create_date,remark FROM B_Project WHERE id=?'
  connection.query(sql, [id], function (err, result) {
    res.json(err ? err : result)
  })
  connection.end()
})

// router.post('/', (req, res) => {
//   const connection = mysql.createConnection(dbConfig)
//   const  sql = 'INSERT INTO B_Project(projrct_code,projrct_name,province,city,pm,phone_no,remark) VALUES(?,?,?,?,?,?,?)';
//   const  sqlParams = ['bp-03', '项目3', '广东', '深圳', '李XX', '14720157689', '备注']
//   connection.query(sql, sqlParams, function (err, result) {
//     if (err) {
//       res.json(err)
//     } else {
//       res.json(result)
//     }
//   })

//   connection.end()
// })

module.exports = router
