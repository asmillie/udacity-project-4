import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";
import { ToDoService } from "./todo.service";

export class ToDoRepository {
    
    private readonly todoService: ToDoService;
    
    constructor() {
        this.todoService = new ToDoService();
    }

    async getAllToDosByUserId(userId): Promise<TodoItem[]> {
        return await this.todoService.getAllToDosByUserId(userId);
    }

    async createToDo(todo: TodoItem): Promise<TodoItem> {
        return await this.todoService.createToDo(todo);
    }

    async updateToDo(todo: TodoItem, todoUpdate: TodoUpdate): Promise<TodoItem | undefined> {
        return await this.todoService.updateToDo(todo, todoUpdate);
    }

    async deleteToDo(id: string) {
        await this.todoService.deleteToDo(id);
    }
}