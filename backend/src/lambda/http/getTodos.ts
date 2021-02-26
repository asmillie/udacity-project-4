import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId, prepareApiResponse } from '../utils'
import { ToDoRepository } from '../../todo/todo.repository';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const toDoRepository = new ToDoRepository();
  const items = await toDoRepository.getAllToDosByUserId(userId);

  return prepareApiResponse(200, { items });
}
