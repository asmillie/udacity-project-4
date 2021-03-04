import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId, prepareApiResponse } from '../utils'
import { ToDoRepository } from '../../todo/todo.repository';
import { saveExecutionTimeMetric } from '../../utils/metrics';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTimeMS = new Date().getTime();
  const userId = getUserId(event);
  const toDoRepository = new ToDoRepository();
  const items = await toDoRepository.getAllToDosByUserId(userId);

  await saveExecutionTimeMetric('Lambda','GetTodos',startTimeMS);
  return prepareApiResponse(200, { items });
}
