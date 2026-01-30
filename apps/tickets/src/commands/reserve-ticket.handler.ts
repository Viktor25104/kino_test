import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReserveTicketCommand } from './reserve-ticket.command';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TicketStatus } from '../domain/models/ticket.model';

@CommandHandler(ReserveTicketCommand)
export class ReserveTicketHandler implements ICommandHandler<ReserveTicketCommand> {
    constructor(
        private prisma: PrismaService,
        @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka
    ) { }

    async execute(command: ReserveTicketCommand): Promise<any> {
        const { eventId, userId, seat, email } = command;

        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event) throw new NotFoundException('Event not found');

        const existing = await this.prisma.ticket.findFirst({
            where: { eventId, seat, status: { not: TicketStatus.AVAILABLE } }
        });
        if (existing) throw new BadRequestException('Seat already reserved');

        const ticket = await this.prisma.ticket.create({
            data: {
                eventId,
                userId,
                seat,
                status: TicketStatus.RESERVED
            },
            include: { event: true }
        });

        this.kafkaClient.emit('ticket.reserved', {
            id: ticket.id,
            eventId: ticket.eventId,
            userId: ticket.userId,
            email: email,
            seat: ticket.seat,
            timestamp: new Date().toISOString()
        });

        return ticket;
    }
}
