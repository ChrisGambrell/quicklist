// BUG: This is Knownst's Privacy Policy, not QuickList's.

import { TermsLayout } from '@/components/layout/terms-layout'

export default function PrivacyPage() {
	return (
		<TermsLayout title='Privacy Policy'>
			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>1. Information We Collect</h2>
				<p className='text-muted-foreground mb-3'>We collect information that you provide directly to us, including:</p>
				<ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
					<li>Name and contact information</li>
					<li>Account credentials</li>
					<li>Documents and content you upload</li>
					<li>Usage data and analytics</li>
				</ul>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>2. How We Use Your Information</h2>
				<p className='text-muted-foreground mb-3'>We use the information we collect to:</p>
				<ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
					<li>Provide and maintain our service</li>
					<li>Process your documents and content</li>
					<li>Improve our service and user experience</li>
					<li>Communicate with you about our service</li>
				</ul>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>3. Data Storage and Security</h2>
				<p className='text-muted-foreground'>
					We implement appropriate security measures to protect your personal information. Your data is stored on secure servers
					and transmitted using industry-standard encryption.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>4. Data Sharing</h2>
				<p className='text-muted-foreground mb-3'>We do not sell your personal information. We may share your data with:</p>
				<ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
					<li>Service providers who assist in our operations</li>
					<li>Law enforcement when required by law</li>
					<li>Business partners with your consent</li>
				</ul>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>5. Your Rights</h2>
				<p className='text-muted-foreground mb-3'>You have the right to:</p>
				<ul className='list-disc pl-6 space-y-2 text-muted-foreground'>
					<li>Access your personal information</li>
					<li>Correct inaccurate data</li>
					<li>Request deletion of your data</li>
					<li>Opt-out of marketing communications</li>
				</ul>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>6. Cookies and Tracking</h2>
				<p className='text-muted-foreground'>
					We use cookies and similar tracking technologies to improve your experience and collect usage data. You can control
					cookie preferences through your browser settings.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>7. Children&apos;s Privacy</h2>
				<p className='text-muted-foreground'>
					Our service is not intended for children under 13. We do not knowingly collect personal information from children under
					13.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>8. Changes to Privacy Policy</h2>
				<p className='text-muted-foreground'>
					We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new
					policy on this page.
				</p>
			</section>

			<section>
				<h2 className='text-2xl font-semibold text-foreground mb-4'>9. Contact Us</h2>
				<p className='text-muted-foreground'>
					If you have any questions about this privacy policy, please contact us at{' '}
					<a href='mailto:privacy@knownst.com' className='text-primary hover:text-primary/80 transition-colors underline'>
						privacy@knownst.com
					</a>
					.
				</p>
			</section>
		</TermsLayout>
	)
}
