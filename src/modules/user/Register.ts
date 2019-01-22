import { logger } from './../middleware/logger';
import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { hash } from 'bcryptjs';

import { User } from './../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {

	@UseMiddleware(isAuth, logger)
	@Query(() => String, { name: 'helloWorld', description: 'It is my first function' })
	async hello() {
		return 'Hello world';
	}

	@Mutation(() => User)
	async register(@Arg('data') { email, firstName, lastName, password }: RegisterInput): Promise<User> {
		const hashedPassword = await hash(password, 12);
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword
		}).save();

		await sendEmail(email, await createConfirmationUrl(user.id))

		return user;
	}
}
