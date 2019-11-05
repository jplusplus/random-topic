var express = require('express')
var path = require('path')
var fs = require('fs')
var favicon = require('serve-favicon')
var app = express()

var availableTopics = {
  skola: {
    slug: "skola",
    title: "Skolbanditen"
  },
  sverigesradio: {
    slug: "sverigesradio",
    title: "Radiobanditen"
  },
  ds: {
    slug: "ds",
    title: "Ämnen för Dagens Samhälle"
  }
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))

app.get('/', function(req, res){
  res.render('index', {
      topics: availableTopics
  })
})

app.get('/:topic', function(req, res){
  if (!(req.params.topic in availableTopics)){
    res.sendStatus(404)
    return
  }

  var topic = availableTopics[req.params.topic]
  fs.readFile(path.join('topics', topic.slug + ".csv"), function(err, data) {
    if(err) throw err
    var topics = data.toString().split("\n")
    topics = topics.filter(String)
    res.render('bandit', {
      title: topic.title,
      topics: topics
    })
  })
})

// Start server
app.listen(process.env.PORT || 8080, function() {
  console.log('%s listening at %s', process.env.PORT || 8080)
})