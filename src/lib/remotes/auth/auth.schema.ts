import { z } from "zod";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const signUpSchema = z
	.object({
		name: z.string().nonempty("Name is required"),
		email: z.email(),
		_password: passwordSchema,
		_confirmPassword: passwordSchema,
	})
	.refine((data) => data._password === data._confirmPassword, {
		path: [],
		message: "Passwords don't match",
	});

export const signInSchema = z.object({ email: z.email(), _password: passwordSchema });
