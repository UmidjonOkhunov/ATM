const blogsRouter = require("express").Router();
// const config = require("../utils/config");

const atmRouter = require('express').Router();

const generateId = () => {
    const maxId = dummyInfo.length > 0
      ? Math.max(...dummyInfo.map(n => n.id))
      : 0
    return maxId + 1
  }

let dummyInfo = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

atmRouter.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

atmRouter.get('/info', (request, response) => {
    response.json(dummyInfo)
})

atmRouter.get('/info/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = dummyInfo.find(note => note.id === id)

    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

atmRouter.post('/info', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    dummyInfo = dummyInfo.concat(note)

    response.json(note)
  })

atmRouter.delete('/info/:id', (request, response) => {
    const id = Number(request.params.id)
    dummyInfo = dummyInfo.filter(note => note.id !== id)
  
    response.status(204).end()
  })


module.exports = atmRouter;