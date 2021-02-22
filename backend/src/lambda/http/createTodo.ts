import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { ToDoRepository } from '../../todo/todo.repository'
import { getUserId, prepareApiResponse } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  newTodo['userId'] = userId;
  const toDoRepository = new ToDoRepository();

  const result = await toDoRepository.createToDo(newTodo);

  return prepareApiResponse(201, result);
}
