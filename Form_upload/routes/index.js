var express = require('express')
var router = express.Router()

const productSchema = require('../models/product')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' })
})

router.get('/xem', function(req, res) {
  productSchema.find({},(err,dulieu) => {
    res.render('xem', { title: "Xem du lieu", data:dulieu })
    }
  )
})

module.exports = router
