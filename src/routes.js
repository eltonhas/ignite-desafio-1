import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

const titleAndDescriptionVerification = (title, description) => {
  if (!title) {
    return 'Titulo não encontrado'
  }

  if (!description) {
    return 'Descrição não encontrada'
  }

  return 'success'
}

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('task', search ? { title: search, description: search } : null)
      
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      const { title, description } = req.body

      const bodyVerification = titleAndDescriptionVerification(title, description)

      if (bodyVerification !== 'success') {
        return res.writeHead(400).end(bodyVerification)
      }
 
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      const response = database.insert('task', task)

      return res.writeHead(201).end(JSON.stringify(response))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const bodyVerification = titleAndDescriptionVerification(title, description)

      if (bodyVerification !== 'success') {
        return res.writeHead(400).end(bodyVerification)
      }

      const data = {
        title,
        description,
        updated_at: new Date()
      }

      const response = database.update(id, 'task', data)

      return response === 'Task Not Found' ? res.writeHead(400).end(JSON.stringify(response)) :
        res.writeHead(204).end(JSON.stringify(response))
      
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/complete/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const data = {
        completed_at: new Date(),
        updated_at: new Date(),
      }

      const response = database.complete(id, 'task', data)

      return response === 'Task Not Found' ? res.writeHead(400).end(JSON.stringify(response)) :
        res.writeHead(204).end(JSON.stringify(response))
      
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const response = database.delete('task', id)

      return response === 'Task Not Found' ? res.writeHead(400).end(JSON.stringify(response)) :
        res.writeHead(204).end(JSON.stringify(response))
    }
  }
]