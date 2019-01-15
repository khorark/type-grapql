import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema, Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {
	@Query(() => String)
	async hello() {
		return 'Hello world';
	}
}

const main = async () => {
	const schema = await buildSchema({
		resolvers: [ HelloResolver ]
	});

    const appoloServer = new ApolloServer({ schema });
    
    const app = Express();

    appoloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on http://localhost:4000/graphql');
    })
};

main();
