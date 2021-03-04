import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId, prepareApiResponse } from '../utils'
import { ToDoRepository } from '../../todo/todo.repository'
import { saveExecutionTimeMetric } from '../../utils/metrics'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTimeMS = new Date().getTime();
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  updatedTodo['todoId'] = todoId;
  updatedTodo['userId'] = userId;
  const todoRepository = new ToDoRepository();

  await todoRepository.updateToDo(updatedTodo);

  await saveExecutionTimeMetric('Lambda','UpdateTodo',startTimeMS);
  return prepareApiResponse(200);
}
