import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger';

export class ToDoService {
    private readonly logger;

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTbl = process.env.TODO_ITEMS_TABLE
    ) {
        this.logger = createLogger('ToDoRepository');
    }

    async getAllToDosByUserId(userId: string): Promise<TodoItem[]> {
        this.logger(`Getting all todos for User Id ${userId}`);
        if (!userId) {
            throw new Error('Missing userId while getting all todos');
        }

        const result = await this.docClient.query({
            TableName: this.todoTbl,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        return result.Items as TodoItem[];
    }

    async createToDo(todo: TodoItem): Promise<TodoItem> {
        this.logger(`Creating todo for User Id ${todo.userId}`);

        await this.docClient.put({
            TableName: this.todoTbl,
            Item: todo
        }).promise();

        return todo;
    }

    async updateToDo(todo: TodoItem, todoUpdate: TodoUpdate): Promise<TodoItem | undefined> {
        this.logger(`Updating todo for User Id ${todo.userId}`);

        await this.docClient.update({
            TableName: this.todoTbl,
            Key: {
                'todoId': todo.todoId,
                'userId': todo.userId
            },
            UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            }
        }).promise().then((data) => {
            return data.$response.data as TodoItem;
        }, (err) => {
            this.logger(`Error during update operation: ${err}`);
            throw new Error(`An error occurred during update operation: ${err}`);
        }).catch(err => {
            this.logger(`Error attempting update operation: ${err}`);
            throw new Error(`An error occurred: ${err}`);
        });

        return undefined;
    }

    async deleteToDo(id: string) {
        this.logger(`Deleting todo item id ${id}`);

        await this.docClient.delete({
            TableName: this.todoTbl,
            Key: {
                'todoId': id
            }
        }).promise();
    }
}