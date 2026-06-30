import { useEffect, useState } from 'react'
import { Modal, Select, message } from 'antd'
import {
  type DisputeResolution,
  type OrderListItem,
  useResolveDisputeMutation,
} from '../../redux/api/orderManageApi'

type Props = {
  order: OrderListItem | null
  open: boolean
  onClose: () => void
}

const resolutionOptions: { value: DisputeResolution; label: string }[] = [
  { value: 'refund', label: 'Refund' },
  { value: 'release', label: 'Release' },
]

export default function ResolveDisputeModal({ order, open, onClose }: Props) {
  const [resolution, setResolution] = useState<DisputeResolution>('refund')
  const [resolveDispute, { isLoading }] = useResolveDisputeMutation()

  useEffect(() => {
    if (open) setResolution('refund')
  }, [open, order?.key])

  const handleSubmit = async () => {
    if (!order) return

    try {
      const result = await resolveDispute({
        id: order.key,
        resolution,
      }).unwrap()
      message.success(result.message || 'Dispute resolved successfully.')
      onClose()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to resolve dispute.'
      message.error(errorMessage)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Resolve Dispute"
      centered
      destroyOnClose
      okText="Resolve"
      confirmLoading={isLoading}
      onOk={handleSubmit}
    >
      {order && (
        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-300">
            Choose how to resolve the dispute for order{' '}
            <span className="font-medium text-white">{order.orderId}</span>.
          </p>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
              Resolution
            </label>
            <Select
              value={resolution}
              onChange={setResolution}
              options={resolutionOptions}
              className="w-full"
              size="large"
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
