const path = require('path')
const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, '../public')

const express = require('express')
const app = express()

app.use(express.static(publicPath))
app.listen(port, () => console.log(`Now live on port ${port}`))