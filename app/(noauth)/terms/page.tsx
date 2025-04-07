// BUG: This is Knownst's Terms of Service, not QuickList's.

import { TermsLayout } from '@/components/layout/terms-layout'
import Link from 'next/link'

export default function TermsPage() {
	return (
		<TermsLayout title='Terms of Service'>
			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>1. Acceptance of Terms</h2>
				<p className='text-muted-foreground'>
					By accessing and using Knownst, you agree to be bound by these Terms of Service. If you do not agree with any part of
					these terms, please do not use our service.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>2. Description of Service</h2>
				<p className='text-muted-foreground'>
					Knownst is a knowledge management platform that helps organizations store, organize, and retrieve information
					efficiently. Our service includes document storage, search functionality, and AI-powered insights.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>3. User Accounts</h2>
				<p className='text-muted-foreground'>
					To use Knownst, you must create an account. You are responsible for maintaining the confidentiality of your account
					credentials and for all activities that occur under your account.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>4. Privacy and Data Protection</h2>
				<p className='text-muted-foreground'>
					We take your privacy seriously. Our collection and use of personal information is governed by our{' '}
					<Link href='/privacy' className='text-primary hover:text-primary/80 transition-colors underline'>
						Privacy Policy
					</Link>
					.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>5. Intellectual Property</h2>
				<p className='text-muted-foreground'>
					The content you upload to Knownst remains your property. By using our service, you grant us a license to store, process,
					and display your content for the purpose of providing our service.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>6. Service Modifications</h2>
				<p className='text-muted-foreground'>
					We reserve the right to modify or discontinue any part of our service at any time. We will notify users of any
					significant changes.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>7. Limitation of Liability</h2>
				<p className='text-muted-foreground'>
					Knownst is provided &quot;as is&quot; without any warranties. We are not liable for any damages arising from your use of
					our service.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>8. Changes to Terms</h2>
				<p className='text-muted-foreground'>
					We may update these terms from time to time. Continued use of our service after changes constitutes acceptance of the
					new terms.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>9. Contact</h2>
				<p className='text-muted-foreground'>
					If you have any questions about these terms, please contact us at{' '}
					<a href='mailto:support@knownst.com' className='text-primary hover:text-primary/80 transition-colors underline'>
						support@knownst.com
					</a>
					.
				</p>
			</section>
		</TermsLayout>
	)
}
