import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthResolver } from './interfaces/http/health.resolver';
import { TicketsResolver } from './interfaces/http/tickets.resolver';
import { AuthGuard } from './guards/auth.guard';
import { ReserveTicketHandler } from './commands/reserve-ticket.handler';
import { GetTicketsHandler } from './queries/get-tickets.handler';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'apps/tickets/src/schema.gql'),
            context: ({ req }) => ({ req }),
        }),
        CqrsModule,
        ClientsModule.register([
            {
                name: 'AUTH_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'auth',
                    protoPath: join(__dirname, 'proto/auth.proto'),
                    url: process.env.AUTH_GRPC_URL || 'auth:50051',
                },
            },
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
                    },
                    consumer: {
                        groupId: 'tickets-producer-group',
                    },
                },
            },
        ]),
    ],
    controllers: [],
    providers: [
        HealthResolver,
        TicketsResolver,
        AuthGuard,
        ReserveTicketHandler,
        GetTicketsHandler,
        PrismaService
    ],
})
export class AppModule { }
