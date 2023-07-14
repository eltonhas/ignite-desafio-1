import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
      this.#database = JSON.parse(data)
      }).catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  select(table, search) {
    let data = this.#database[table] ?? []
      
    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  update(id, table, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const task = this.#database[table][rowIndex]
      const updatedTask = {
        id,
        title: data.title,
        description: data.description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: data.updated_at
      }

      this.#database[table][rowIndex] = updatedTask
      this.#persist()
      
      return updatedTask
    } else {
      return 'Task Not Found'
    }
  }

  complete(id, table, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const task = this.#database[table][rowIndex]
      const updatedTask = {
        id,
        title: task.title,
        description: task.description,
        completed_at: data.completed_at,
        created_at: task.created_at,
        updated_at: data.updated_at
      }

      this.#database[table][rowIndex] = updatedTask
      this.#persist()
      
      return updatedTask
    } else {
      return 'Task Not Found'
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()

      return 'Task Deleted'
    } else {
      return 'Task Not Found'
    }
  }
}