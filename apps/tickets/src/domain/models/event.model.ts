import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Ticket } from './ticket.model';

@ObjectType()
export class Event {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field()
    date: Date;

    @Field(() => [Ticket], { nullable: 'itemsAndList' })
    tickets?: Ticket[];
}
