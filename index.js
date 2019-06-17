const express = require('express')
const fs = require('fs')
const request = require('request-promise-native')
const mustache = require('mustache')

const app = express()

const PORT = 3000

app.use(express.static(`${__dirname}/static/`))

app.get('/', (req, res) => {
    res.send('Hello GDG Galway!')
})

app.get('/todos', async (req, res) => {
    // Get the content of 'todos.html'
    const template = fs.readFileSync('templates/todos.html', 'UTF-8')
    // Get our list of todos in JSON format
    const todos = await request('https://jsonplaceholder.typicode.com/todos?userId=1', { json: true })
    // Generate the HTML content from our list of todos
    const html = mustache.render(template, { todos })
    // Serve the final content
    res.send(html)
})

app.get('/todos/:status', async (req, res) => {
    // Get our dynamic status parameter
    const {status} = req.params
    // Is the status we're looking for Completed or not?
    const completed = status === 'completed'
    // Get the content of 'todos.html'
    const template = fs.readFileSync('templates/todos.html', 'UTF-8')
    // Get our list of todos in JSON format
    const todos = await request('https://jsonplaceholder.typicode.com/todos?userId=1', { json: true })
    // Generate the HTML content from our list of filtered todos based on their status
    const html = mustache.render(template, {
        todos: todos.filter(todo => todo.completed === completed)
    })
    // Serve the final content
    res.send(html)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})