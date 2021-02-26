import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { ToDoRepository } from '../../todo/todo.repository'
import { prepareApiResponse } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todoRepository = new ToDoRepository();
  await todoRepository.deleteToDo(todoId);

  return prepareApiResponse(200);
}
