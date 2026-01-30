import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from '../../application/services/notifications.service';

@Controller()
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @EventPattern('ticket.reserved')
    async handleTicketReserved(@Payload() data: any) {
        console.log('Received event ticket.reserved:', data);
        this.notificationsService.logNotification(data);
    }
}
