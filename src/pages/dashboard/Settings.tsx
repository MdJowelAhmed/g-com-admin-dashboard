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

const termsAudienceTypes = {
  user: 'customer-terms-and-conditions',
  provider: 'provider-terms-and-conditions',
} as const

const privacyAudienceTypes = {
  user: 'customer-privacy-policy',
  provider: 'provider-privacy-policy',
} as const

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
              audienceTypes={termsAudienceTypes}
            />
          )}
          {activeId === 'privacy' && (
            <DualRichTextTab
              title="Privacy & Policy"
              description="Separate policies for users and providers."
              audienceTypes={privacyAudienceTypes}
            />
          )}
        </section>
      </div>
    </div>
  )
}
