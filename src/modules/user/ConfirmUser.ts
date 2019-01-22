import { Resolver, Mutation, Arg } from 'type-graphql'

import { User } from './../../entity/User'
import { redis } from '../../../src/redis'

@Resolver()
export class ConfirmUserResolver {
	@Mutation(() => Boolean, { nullable: true })
	async confirmUser(@Arg('token') token: string): Promise<boolean> {
		const userId = await redis.get(token)

		if (!userId) {
			return false
		}

		await User.update({ id: parseInt(userId, 10) }, { confirmed: true })

		return true
	}
}
