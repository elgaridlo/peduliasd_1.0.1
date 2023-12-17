const express = require('express');
const app = express()

const authsRoutes = require('../auth/auth.routes')
const articlesRoutes = require('../backoffice/article/article.routes')
const productsRoutes = require('../backoffice/product/product.routes')
const programmesRoutes = require('../backoffice/programme/programme.routes')
const casdiRoutes = require('../backoffice/casdi/casdi.routes')
const uploadRoutes = require('../backoffice/upload/upload.routes')

const API_URL = '/api'

app.use(API_URL + '/users', authsRoutes)
app.use(API_URL + '/article', articlesRoutes)
app.use(API_URL + '/product', productsRoutes)
app.use(API_URL + '/educationprogram', programmesRoutes)
app.use(API_URL + '/casdi', casdiRoutes)
app.use(API_URL + '/upload', uploadRoutes)


module.exports = app