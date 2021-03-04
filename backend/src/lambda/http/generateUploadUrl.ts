import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { prepareApiResponse } from '../utils'
import { ToDoRepository } from '../../todo/todo.repository'
import { saveExecutionTimeMetric } from '../../utils/metrics'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const startTimeMS = new Date().getTime();
  const todoId = event.pathParameters.todoId;
  const todoRepository = new ToDoRepository();

  const signedUrl = todoRepository.getUploadUrl(todoId);

  await saveExecutionTimeMetric('Lambda','GenerateUploadURL',startTimeMS);
  return prepareApiResponse(200, { uploadUrl: signedUrl });
}
