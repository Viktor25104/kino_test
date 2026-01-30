import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTicketsQuery } from './get-tickets.query';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@QueryHandler(GetTicketsQuery)
export class GetTicketsHandler implements IQueryHandler<GetTicketsQuery> {
    constructor(private prisma: PrismaService) { }

    async execute(query: GetTicketsQuery) {
        return this.prisma.ticket.findMany({
            where: { eventId: query.eventId },
            include: { event: true }
        });
    }
}
