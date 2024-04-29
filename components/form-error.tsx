export function FormError({ value }: { value: string[] | undefined }) {
	if (!value || !value.length) return null
	return <div className='text-destructive text-sm'>{value[0]}</div>
}
