import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthResolver } from './interfaces/http/health.resolver';


@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'apps/tickets/src/schema.gql'),
        }),
    ],
    controllers: [],
    providers: [ HealthResolver ],
})
export class AppModule { }
