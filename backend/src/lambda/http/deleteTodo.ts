import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { ToDoRepository } from '../../todo/todo.repository'
import { prepareApiResponse } from '../utils'
import { saveExecutionTimeMetric } from '../../utils/metrics'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTimeMS = new Date().getTime();
  const todoId = event.pathParameters.todoId;
  const todoRepository = new ToDoRepository();
  await todoRepository.deleteToDo(todoId);

  await saveExecutionTimeMetric('DeleteTodo',startTimeMS);
  return prepareApiResponse(200);
}
