import { Modal } from 'antd'
import { ExternalLink, Store } from 'lucide-react'
import {
  canReviewShop,
  resolveMediaUrl,
} from '../../redux/api/shopManagementApi'
import type { Shop, ShopStatus, ShopVerification } from './shopData'

const statusStyles: Record<ShopStatus, string> = {
  Pending: 'text-amber-400',
  Verified: 'text-emerald-400',
  'In Review': 'text-sky-400',
  Suspended: 'text-red-400',
}

const verificationStatusStyles: Record<ShopVerification['status'], string> = {
  pending: 'bg-amber-500/20 text-amber-300',
  approved: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
}

type Props = {
  shop: Shop | null
  open: boolean
  onClose: () => void
  onApprove: (key: string) => void | Promise<void>
  onReject: (key: string) => void | Promise<void>
}

export default function ShopDetailsModal({
  shop,
  open,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const verifications = shop?.verification ?? []
  const showApprovalActions = shop ? canReviewShop(shop) : false

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Shop Details"
      centered
      destroyOnClose
      width={760}
    >
      {shop && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {shop.businessLogo ? (
              <img
                src={resolveMediaUrl(shop.businessLogo)}
                alt=""
                className="h-14 w-14 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/20 text-brand-hover">
                <Store size={24} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold text-white">
                {shop.name}
              </div>
              <div className="truncate text-xs text-gray-400">{shop.shopId}</div>
            </div>
            <div
              className={`text-sm font-semibold ${statusStyles[shop.status]}`}
            >
              {shop.status}
            </div>
          </div>

          {shop.coverImage && (
            <img
              src={resolveMediaUrl(shop.coverImage)}
              alt=""
              className="h-40 w-full rounded-lg object-cover"
            />
          )}

          <dl className="grid grid-cols-2 gap-4">
            <DetailRow label="Type" value={shop.type} />
            <DetailRow label="Category" value={shop.category} />
            <DetailRow label="Joining Date" value={shop.joiningDate} />
            <DetailRow label="Owner" value={shop.owner} />
            <DetailRow label="Email" value={shop.email} />
            <DetailRow label="Phone" value={shop.phone} />
            <DetailRow label="Address" value={shop.address} className="col-span-2" />
          </dl>

          <div>
            <div className="text-xs uppercase tracking-wide text-gray-400">
              Description
            </div>
            <p className="mt-1 text-sm text-gray-200">{shop.description}</p>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Verification Documents
            </div>

            {verifications.length === 0 ? (
              <p className="rounded-md border border-dashed border-surface-border px-4 py-6 text-center text-sm text-gray-400">
                No verification documents submitted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <VerificationCard
                    key={verification.id}
                    verification={verification}
                  />
                ))}
              </div>
            )}
          </div>

          {showApprovalActions && (
            <div className="flex items-center justify-end gap-3 border-t border-surface-border pt-4">
              <button
                type="button"
                onClick={() => onReject(shop.key)}
                className="h-10 rounded-md bg-red-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => onApprove(shop.key)}
                className="h-10 rounded-md bg-emerald-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Approve
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

function VerificationCard({ verification }: { verification: ShopVerification }) {
  const isPdf = verification.verificationDocument.toLowerCase().endsWith('.pdf')

  return (
    <div className="rounded-lg border border-surface-border bg-surface-elevated/40 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-white">
          {verification.verificationDocumentType}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${verificationStatusStyles[verification.status]}`}
        >
          {verification.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocumentPreview
          label="Business Proof"
          url={resolveMediaUrl(verification.businessProof)}
        />
        <DocumentPreview
          label="Verification Document"
          url={resolveMediaUrl(verification.verificationDocument)}
          isPdf={isPdf}
        />
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Submitted {new Date(verification.createdAt).toLocaleString()}
      </div>
    </div>
  )
}

function DocumentPreview({
  label,
  url,
  isPdf = false,
}: {
  label: string
  url: string
  isPdf?: boolean
}) {
  if (!url) {
    return (
      <div>
        <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">
          {label}
        </div>
        <p className="text-sm text-gray-500">Not provided</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">
        {label}
      </div>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-brand px-3 py-2 text-sm text-brand-hover transition-colors hover:bg-brand/10"
        >
          <ExternalLink size={14} />
          View PDF
        </a>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className="block">
          <img
            src={url}
            alt={label}
            className="h-36 w-full rounded-md border border-surface-border object-cover"
          />
        </a>
      )}
    </div>
  )
}

type DetailRowProps = {
  label: string
  value: string
  className?: string
}

function DetailRow({ label, value, className = '' }: DetailRowProps) {
  return (
    <div className={className}>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-white">{value}</dd>
    </div>
  )
}
