import { User } from './../../entity/User';
import { Resolver, Query, Mutation, Arg, FieldResolver, Root } from 'type-graphql';
import { hash } from 'bcryptjs';

@Resolver(User)
export class RegisterResolver {
	//private readonly salt = '232fdsf43g4hbllk[ck90vu';

	@Query(() => String, { name: 'helloWorld', description: 'It is my first function' })
	async hello() {
		return 'Hello world';
	}

	@FieldResolver()
	async name(@Root() parent: User) {
		return `${parent.firstName} ${parent.lastName}`;
	}

	@Mutation(() => User)
	async register(
		@Arg('firstName') firstName: string,
		@Arg('lastName') lastName: string,
		@Arg('email') email: string,
		@Arg('password') password: string
	): Promise<User> {
		const hashedPassword = await hash(password, 12);
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword
		}).save();

		return user;
	}
}
