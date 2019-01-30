import { CreateUserResolver, CreateProductResolver } from './../user/CreateUser'
import { MeResolver } from './../user/Me'
import { ForgotPasswordResolver } from './../user/ForgotPassword'
import { ConfirmUserResolver } from './../user/ConfirmUser'
import { ChangePasswordResolver } from './../user/ChangePassword'
import { buildSchema } from 'type-graphql'
import { LoginResolver } from '../user/Login'
import { LogoutResolver } from '../user/Logout'
import { RegisterResolver } from '../user/Register'

export const createSchema = () =>
	buildSchema({
		resolvers: [
			ChangePasswordResolver,
			ConfirmUserResolver,
			ForgotPasswordResolver,
			LoginResolver,
			LogoutResolver,
			MeResolver,
			RegisterResolver,
			CreateUserResolver,
			CreateProductResolver
		],
		authChecker: ({ context: { req } }) => !!req.session.userId
	})
