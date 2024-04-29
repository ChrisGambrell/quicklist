import { ZodTypeAny, z } from 'zod'

type ActionReturn<T extends ZodTypeAny | undefined> = {
	errors?: T extends ZodTypeAny ? z.inferFlattenedErrors<T>['fieldErrors'] : {}
}

// TODO: Key not working
export function FormError<T extends ZodTypeAny>({ state, id }: { state: ActionReturn<T> | Response | null; id: string }) {
	if (state instanceof Response) return null
	else if (!state?.errors || !state.errors[id] || !state.errors[id]!.length) return null
	return <div className='text-destructive text-sm'>{state.errors[id]![0]}</div>
}
