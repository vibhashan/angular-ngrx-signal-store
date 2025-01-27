import { Injectable } from '@angular/core';
import Todo from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5000/todos';

  constructor() {}

  async getAll() {
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const todos: Todo[] = await res.json();
      return todos;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async add(title: string) {
    try {
      const todos = await this.getAll();
      const todo = {
        id: (Number(todos[todos.length - 1].id) + 1).toString(),
        title,
        isCompleted: false,
      };
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return todo;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async delete(id: string) {
    try {
      const res = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(todo: Todo, isCompleted: boolean) {
    try {
      todo = { ...todo, isCompleted };
      const res = await fetch(`${this.apiUrl}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return todo;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
