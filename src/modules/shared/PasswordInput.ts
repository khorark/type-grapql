import { Field, InputType, ClassType } from 'type-graphql'
import { Min } from 'class-validator'

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
	@InputType()
	class PasswordInput extends BaseClass {
		@Field()
		@Min(5)
		password: string
	}

	return PasswordInput
}
