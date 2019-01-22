import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { buildSchema, formatArgumentValidationError } from 'type-graphql'
import { createConnection } from 'typeorm'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'

import { redis } from './redis'

const main = async () => {
	await createConnection()
	const schema = await buildSchema({
		resolvers: [ __dirname + '/modules/**/*.ts' ]
	})

	const appoloServer = new ApolloServer({
		schema,
		formatError: formatArgumentValidationError,
		context: ({ req }: any) => ({ req })
	})

	const app = Express()

	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000'
		})
	)

	const RedisStore = connectRedis(session)

	app.use(
		session({
			store: new RedisStore({
				client: redis as any
			}),
			name: 'qid',
			secret: 'abcd123456',
			resave: false,
			saveUninitialized: false,
			cookie: {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
			}
		})
	)

	appoloServer.applyMiddleware({ app })

	app.listen(4000, () => {
		console.log('server started on http://localhost:4000/graphql')
	})
}

main()
