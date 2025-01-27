import Todo from './todo.model';

export default interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  filter: 'all' | 'pending' | 'completed';
}
