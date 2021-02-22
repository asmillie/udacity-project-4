import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { prepareApiResponse } from '../utils'
import { ToDoRepository } from '../../todo/todo.repository'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todoRepository = new ToDoRepository();

  const signedUrl = todoRepository.getUploadUrl(todoId);

  return prepareApiResponse(200, signedUrl);
}
