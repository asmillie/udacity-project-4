import { S3Event, SNSEvent, SNSHandler } from "aws-lambda";
import { ToDoRepository } from "../../todo/todo.repository";
import { saveExecutionTimeMetric } from "../../utils/metrics";

export const handler: SNSHandler = async (event: SNSEvent) => {
    const startTimeMS = new Date().getTime();
    const toDoRepository = new ToDoRepository();
    for (const record of event.Records) {
        const s3Event: S3Event = JSON.parse(record.Sns.Message);
        for (const eventRecord of s3Event.Records) {
            await toDoRepository.saveAttachmentUrl(eventRecord.s3.object.key);
        }
    }
    await saveExecutionTimeMetric('ProcessTodoItemNotifications',startTimeMS);
}