const express = require('express'),
      path = require('path'),
      serveStatic = require('serve-static')

const app = express(),
      port = process.env.PORT || 3000

app.use(serveStatic(__dirname + '/dist'))
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
