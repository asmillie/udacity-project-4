import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { ToDoService } from "./todo.service";

export class ToDoRepository {
    
    private readonly todoService: ToDoService;
    
    constructor() {
        this.todoService = new ToDoService();
    }

    async getAllToDosByUserId(userId): Promise<TodoItem[]> {
        return await this.todoService.getAllToDosByUserId(userId);
    }

    async createToDo(createToDoRequest: CreateTodoRequest): Promise<TodoItem> {
        return await this.todoService.createToDo(createToDoRequest);
    }

    async updateToDo(updateToDoRequest: UpdateTodoRequest): Promise<TodoItem | undefined> {
        return await this.todoService.updateToDo(updateToDoRequest);
    }

    async deleteToDo(id: string) {
        await this.todoService.deleteToDo(id);
    }

    getUploadUrl(id: string): string {
        return this.todoService.getUploadUrl(id);
    }
}