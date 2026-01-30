import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Event } from './event.model';

export enum TicketStatus {
    AVAILABLE = 'AVAILABLE',
    RESERVED = 'RESERVED',
    SOLD = 'SOLD',
}

registerEnumType(TicketStatus, { name: 'TicketStatus' });

@ObjectType()
export class Ticket {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    eventId: number;

    @Field(() => Int, { nullable: true })
    userId?: number;

    @Field(() => TicketStatus)
    status: TicketStatus;

    @Field()
    seat: string;

    @Field(() => Event)
    event: Event;
}
