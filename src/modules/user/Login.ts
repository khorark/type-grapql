import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { compare } from 'bcryptjs'

import { User } from './../../entity/User'
import { MyContext } from 'src/types/MyContext'

@Resolver()
export class LoginResolver {
	@Mutation(() => User, { nullable: true })
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() ctx: MyContext
	): Promise<User | null | any> {
		const user = await User.findOne({ where: { email } })

		if (!user) {
			return null
		}

		const isValid = await compare(password, user.password)

		if (!isValid) {
			return null
		}
		
		if (!user.confirmed) {
			return null;
		}
        
		ctx.req.session!.userId = user.id

		return user
	}
}
