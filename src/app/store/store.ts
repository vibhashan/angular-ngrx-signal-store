import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import appState from './state/app.state';
import { computed, inject } from '@angular/core';
import { TodoService } from '../services/todo.service';
import Todo from '../models/todo.model';
import TodoState from '../models/todo-state.model';

const appStore = signalStore(
  { providedIn: 'root' },
  withState(appState),
  withMethods((_, todoService = inject(TodoService)) => ({
    getAll: async () => {
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, isLoading: true },
      }));
      const todos = await todoService.getAll();
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, todos, isLoading: false },
      }));
    },

    add: async (title: string) => {
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, isLoading: true },
      }));
      const todo: Todo = await todoService.add(title);
      patchState(_, ({ todoState }) => ({
        todoState: {
          ...todoState,
          todos: [...todoState.todos, todo],
          isLoading: false,
        },
      }));
    },

    delete: async (todo: Todo) => {
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, isLoading: true },
      }));
      await todoService.delete(todo.id);
      patchState(_, ({ todoState }) => ({
        todoState: {
          ...todoState,
          todos: todoState.todos.filter((t) => t.id !== todo.id),
          isLoading: false,
        },
      }));
    },

    update: async (todo: Todo, isCompleted: boolean) => {
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, isLoading: true },
      }));
      todo = await todoService.update(todo, isCompleted);
      patchState(_, ({ todoState }) => ({
        todoState: {
          ...todoState,
          todos: [...todoState.todos.map((t) => (t.id === todo.id ? todo : t))],
          isLoading: false,
        },
      }));
    },

    updateFilter(filter: TodoState['filter']) {
      patchState(_, ({ todoState }) => ({
        todoState: { ...todoState, isLoading: true },
      }));
      patchState(_, ({ todoState }) => ({
        todoState: {
          ...todoState,
          filter,
          isLoading: false,
        },
      }));
    },
  })),
  withComputed((state) => ({
    filteredTodos: computed(() => {
      const todos = state.todoState.todos;
      const filter = state.todoState.filter;
      switch (filter()) {
        case 'all':
          return todos();
        case 'pending':
          return todos().filter((todo) => !todo.isCompleted);
        case 'completed':
          return todos().filter((todo) => todo.isCompleted);
      }
    }),
  }))
);

export default appStore;
