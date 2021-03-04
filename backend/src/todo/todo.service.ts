import * as AWSXRay from 'aws-xray-sdk';
import { v4 as uuid } from 'uuid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem } from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { createLogger } from '../utils/logger';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { S3 } from 'aws-sdk';

const AWS = AWSXRay.captureAWS(require('aws-sdk'));

export class ToDoService {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly s3: S3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly todoTbl = process.env.TODO_ITEMS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX,
        private readonly s3BucketName = process.env.TODO_ITEMS_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly logger = createLogger('ToDoService')
    ) {}

    async getAllToDosByUserId(userId: string): Promise<TodoItem[]> {
        this.logger.info(`Getting all todos for User Id ${userId}`);
        if (!userId) {
            throw new Error('Missing userId while getting all todos');
        }

        return await this.docClient.query({
            TableName: this.todoTbl,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise().then(data => {
            return data.Items as TodoItem[];
        }, err => {
            this.logger.error(`Error getting todo items for user id ${userId}: ${err}`);
            throw new Error(`Error getting todo items for user id ${userId}`);
        });
    }

    async createToDo(createToDoRequest: CreateTodoRequest): Promise<TodoItem> {
        this.logger.info(`Creating todo for User Id ${createToDoRequest.userId}`);

        const dueDate = new Date(createToDoRequest.dueDate).toISOString();

        const Item = {
            todoId: uuid(),
            createdAt: new Date().toISOString(),
            done: false,
            ...createToDoRequest,
            dueDate
        };

        return await this.docClient.put({
            TableName: this.todoTbl,
            Item
        }).promise().then(() => {
            return Item as TodoItem;
        }, err => {
            this.logger.error(`Error creating new todo item from request: ${JSON.stringify(createToDoRequest)}. Error: ${err}`);
            throw new Error(`Error creating new todo item: ${err}`);
        });
    }

    async updateToDo(updateToDoRequest: UpdateTodoRequest): Promise<TodoItem> {
        this.logger.info(`Updating todo for User Id ${updateToDoRequest.userId}`);
        console.log(`Update Request: ${JSON.stringify(updateToDoRequest)}`);
        await this.docClient.update({
            TableName: this.todoTbl,
            Key: {
                'todoId': updateToDoRequest.todoId
            },
            UpdateExpression: 'set #nameField = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': updateToDoRequest.name,
                ':dueDate': updateToDoRequest.dueDate,
                ':done': updateToDoRequest.done
            },
            ExpressionAttributeNames: {
                '#nameField': 'name'
            },
            ReturnValues: 'ALL_NEW'
        }).promise().then((data) => {
            return data.$response.data as TodoItem;
        }, (err) => {
            this.logger.error(`Error during update operation: ${err}`);
            throw new Error(`An error occurred during update operation: ${err}`);
        }).catch(err => {
            this.logger.error(`Error attempting update operation: ${err}`);
            throw new Error(`An error occurred: ${err}`);
        });

        return undefined;
    }

    async deleteToDo(id: string) {
        this.logger.info(`Deleting todo item id ${id}`);

        await this.docClient.delete({
            TableName: this.todoTbl,
            Key: {
                'todoId': id
            }
        }).promise();
    }

    getUploadUrl(todoId: string): string {
        this.logger.info(`Getting Signed Upload Url for todo Id ${todoId}`);
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: parseInt(this.urlExpiration, 10)
        });
    }

    async saveAttachmentUrl(todoId: string): Promise<void> {
        const imageUrl = `http://${this.s3BucketName}.s3.amazonaws.com/${todoId}`

        await this.docClient.update({
            TableName: this.todoTbl,
            Key: {
                'todoId': todoId
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': imageUrl
            }
        }).promise().catch(err => {
            this.logger.error(`Error adding attachment Url to todo id ${todoId}: ${err}`);
            throw new Error(`Error adding attachment Url: ${err}`);
        });
    }
}