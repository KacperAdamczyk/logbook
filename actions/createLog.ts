"use server";

import { actionClient } from "@/actions/safe-action";
import { logFormSchema } from "@/actions/validation/logFormSchema";

export const createLogAction = actionClient.schema(logFormSchema).action(async ({ parsedInput, ctx: {user} }) => {
    
    console.log(user, parsedInput);
});