export interface ToDo {
    todoId: string;
    userId: string;
    createdAt: string;
    name: string;
    dueDate: string;
    done: boolean;
    attachmentUrl?: string;
}