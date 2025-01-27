import { Component, inject, OnInit } from '@angular/core';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import appStore from './store/store';

@Component({
  selector: 'app-root',
  imports: [TodoListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  store = inject(appStore);

  async ngOnInit() {
    await this.store.getAll();
  }
}
