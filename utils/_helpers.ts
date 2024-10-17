// BUG: Use prisma
// export async function getRemainingCredits() {
// 	const { supabase } = await getAuth()

// 	const { data: purchasedCredits } = await supabase.rpc('get_total_credits')
// 	const { data: usedCredits } = await supabase.rpc('get_used_credits')

// 	return (purchasedCredits ?? 0) - (usedCredits ?? 0)
// }
