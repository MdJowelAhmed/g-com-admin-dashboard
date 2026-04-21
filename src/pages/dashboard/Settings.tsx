import { useState } from 'react'
import {
  FileText,
  HelpCircle,
  Info,
  KeyRound,
  ShieldCheck,
  User,
  type LucideIcon,
} from 'lucide-react'
import ProfileTab from '../../components/dashboard/settings/ProfileTab'
import ChangePasswordTab from '../../components/dashboard/settings/ChangePasswordTab'
import FaqTab from '../../components/dashboard/settings/FaqTab'
import RichTextTab from '../../components/dashboard/settings/RichTextTab'
import DualRichTextTab from '../../components/dashboard/settings/DualRichTextTab'

type TabId = 'profile' | 'password' | 'faq' | 'about' | 'terms' | 'privacy'

type Tab = {
  id: TabId
  label: string
  icon: LucideIcon
  description: string
}

const tabs: Tab[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Your personal information',
  },
  {
    id: 'password',
    label: 'Change Password',
    icon: KeyRound,
    description: 'Update your account password',
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    description: 'Frequently asked questions',
  },
  {
    id: 'about',
    label: 'About Us',
    icon: Info,
    description: 'Company description shown in-app',
  },
  {
    id: 'terms',
    label: 'Terms and Conditions',
    icon: FileText,
    description: 'Legal terms users must accept',
  },
  {
    id: 'privacy',
    label: 'Privacy & Policy',
    icon: ShieldCheck,
    description: 'How user data is handled',
  },
]

const aboutInitial = `<h2>About G-com</h2><p>G-com connects shops, organizers, and customers on a single commerce platform. Our admin dashboard gives teams end-to-end control over listings, events, payouts, and customer support.</p><p>Replace this text with your own company description — it's shown to users inside the app.</p>`

const termsInitial = {
  user: `<h2>Terms for Users</h2><p>By using G-com as a customer you agree to the following.</p><ol><li>Orders once placed are binding unless cancelled within the allowed window.</li><li>You will provide accurate delivery and payment information.</li><li>Abuse of vendors or other users will result in account suspension.</li></ol><p>Edit this document for end-customers of the app.</p>`,
  provider: `<h2>Terms for Providers</h2><p>By listing on G-com as a shop, organizer, or service provider you agree to the following.</p><ol><li>Listings must represent real, lawful products or services.</li><li>You will honor the platform's payout and dispute policies.</li><li>Repeated policy violations will result in suspension or removal.</li></ol><p>Edit this document for shop owners and service providers.</p>`,
}

const privacyInitial = {
  user: `<h2>Privacy Policy — Users</h2><p>We collect only the information needed to fulfill your orders and personalize your experience.</p><ul><li>We never sell customer data.</li><li>You can request an export or deletion at any time.</li><li>All transactions are encrypted in transit and at rest.</li></ul><p>Edit this policy for end-customers of the app.</p>`,
  provider: `<h2>Privacy Policy — Providers</h2><p>Provider accounts share business information with us so we can verify listings and route payouts.</p><ul><li>We share tax and payout details only with the payment processor.</li><li>Listing analytics are visible only to the owning provider and G-com staff.</li><li>You can request data export from Settings → Profile.</li></ul><p>Edit this policy for shop owners and service providers.</p>`,
}

export default function Settings() {
  const [activeId, setActiveId] = useState<TabId>('profile')

  return (
    <div className="py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-gray-400">
          Manage your account, content, and platform policies in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="h-fit rounded-2xl border border-surface-border bg-surface-card p-3">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = tab.id === activeId
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(tab.id)}
                    className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      active
                        ? 'bg-brand text-white'
                        : 'text-gray-300 hover:bg-surface-elevated hover:text-white'
                    }`}
                  >
                    <Icon size={18} className="mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{tab.label}</div>
                      <div
                        className={`truncate text-[11px] ${
                          active ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {tab.description}
                      </div>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
          {activeId === 'profile' && <ProfileTab />}
          {activeId === 'password' && <ChangePasswordTab />}
          {activeId === 'faq' && <FaqTab />}
          {activeId === 'about' && (
            <RichTextTab
              title="About Us"
              description="Shown on the app's About page."
              initialContent={aboutInitial}
            />
          )}
          {activeId === 'terms' && (
            <DualRichTextTab
              title="Terms and Conditions"
              description="Keep separate terms for users and providers."
              initial={termsInitial}
            />
          )}
          {activeId === 'privacy' && (
            <DualRichTextTab
              title="Privacy & Policy"
              description="Separate policies for users and providers."
              initial={privacyInitial}
            />
          )}
        </section>
      </div>
    </div>
  )
}
