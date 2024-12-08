// BUG: Need to fix this
export async function getRemainingCredits() {
	const { data: purchasedCredits } = { data: 0 } //await supabase.rpc('get_total_credits')
	const { data: usedCredits } = { data: 0 } //await supabase.rpc('get_used_credits')

	return (purchasedCredits ?? 0) - (usedCredits ?? 0)
}
