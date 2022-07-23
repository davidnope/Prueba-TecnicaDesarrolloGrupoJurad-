const express = require('express');
const path = require('path')
const router = express.Router();

const homeController = require(path.join(__dirname, '../controllers/homeController'))

router.get('/', homeController.ListLibros)

module.exports = router;