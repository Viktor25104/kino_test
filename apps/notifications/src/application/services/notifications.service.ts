import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
    logNotification(data: any) {
        console.log(`[Notification] Sending email to ${data.email || 'UNKNOWN'}: parsed ticket ${data.id} reserved for event ${data.eventId}.`);
    }
}
