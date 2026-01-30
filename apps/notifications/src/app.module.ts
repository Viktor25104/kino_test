import { Module } from '@nestjs/common';
import { NotificationsController } from './interfaces/events/notifications.controller';
import { NotificationsService } from './application/services/notifications.service';

@Module({
    imports: [],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class AppModule { }
