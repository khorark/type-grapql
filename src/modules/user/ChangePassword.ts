import { MyContext } from 'src/types/MyContext'
import { hash } from 'bcryptjs'
import { ChangePasswordInput } from './changePassword/ChangePasswordInput'
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'

import { User } from './../../entity/User'
import { redis } from '../../../src/redis'
import { forgotPasswordPrefix } from '../constants/redisPrefixes'

@Resolver()
export class ChangePasswordResolver {
	@Mutation(() => User, { nullable: true })
	async changePassword(
		@Arg('data') { token, password }: ChangePasswordInput,
		@Ctx() ctx: MyContext
	): Promise<User | null> {
		const userId = await redis.get(forgotPasswordPrefix + token)

		if (!userId) {
			return null
		}

		const user = await User.findOne(userId)

		if (!user) {
			return null
		}

		await redis.del(forgotPasswordPrefix + token)

		user.password = await hash(password, 12)

        await user.save()
        
        ctx.req.session!.userId = user.id

		return user
	}
}
