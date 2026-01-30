import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';
import { ReserveTicketCommand } from '../../commands/reserve-ticket.command';
import { GetTicketsQuery } from '../../queries/get-tickets.query';
import { AuthGuard } from '../../guards/auth.guard';
import { Ticket } from '../../domain/models/ticket.model';

@Resolver(() => Ticket)
export class TicketsResolver {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Query(() => [Ticket])
    async tickets(@Args('eventId') eventId: number) {
        return this.queryBus.execute(new GetTicketsQuery(eventId));
    }

    @Mutation(() => Ticket)
    @UseGuards(AuthGuard)
    async reserveTicket(
        @Args('eventId') eventId: number,
        @Args('seat') seat: string,
        @Context() context: any,
    ) {
        const { user } = context.req;
        return this.commandBus.execute(
            new ReserveTicketCommand(eventId, user.id, seat, user.email),
        );
    }
}
