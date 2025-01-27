import { Component, effect, inject, viewChild } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import appStore from '../../store/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Todo from '../../models/todo.model';
import TodoState from '../../models/todo-state.model';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatLabel,
    MatFormField,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  store = inject(appStore);
  todos = this.store.filteredTodos;
  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    effect(() => {
      const filter = this.filter();
      filter.value = this.store.todoState.filter();
    });
  }

  async addTodo(title: string) {
    await this.store.add(title);
  }

  async deleteTodo(todo: Todo, event: MouseEvent) {
    if (confirm('Are you sure you want to delete this todo?')) {
      event.stopPropagation();
      await this.store.delete(todo);
    }
  }

  async updateTodo(todo: Todo, isCompleted: boolean) {
    await this.store.update(todo, isCompleted);
  }

  filterTodos(event: MatButtonToggleChange) {
    const filter = event.value as TodoState['filter'];
    this.store.updateFilter(filter);
  }
}
