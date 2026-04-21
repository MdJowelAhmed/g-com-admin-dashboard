import { useState } from 'react'
import { Plus } from 'lucide-react'
import ControllersTable from '../../components/dashboard/ControllersTable'
import ControllerFormModal, {
  type ControllerFormState,
} from '../../components/dashboard/ControllerFormModal'
import {
  initialControllers,
  nextControllerKey,
  type Controller,
} from '../../components/dashboard/controllerData'

export default function ControllerManagement() {
  const [controllers, setControllers] =
    useState<Controller[]>(initialControllers)
  const [formState, setFormState] = useState<{
    open: boolean
    controller: Controller | null
  }>({ open: false, controller: null })

  const openCreate = () =>
    setFormState({ open: true, controller: null })

  const openEdit = (controller: Controller) =>
    setFormState({ open: true, controller })

  const closeForm = () =>
    setFormState({ open: false, controller: null })

  const handleSubmit = (data: ControllerFormState) => {
    if (formState.controller) {
      setControllers((prev) =>
        prev.map((c) =>
          c.key === formState.controller!.key ? { ...c, ...data } : c,
        ),
      )
      return
    }

    setControllers((prev) => {
      const sl = String(prev.length + 1).padStart(2, '0')
      return [
        ...prev,
        {
          key: nextControllerKey(),
          sl,
          name: data.name,
          email: data.email,
          pageAccess: data.pageAccess,
          suspended: false,
        },
      ]
    })
  }

  const handleDelete = (key: string) =>
    setControllers((prev) => prev.filter((c) => c.key !== key))

  const handleToggleSuspended = (key: string, next: boolean) =>
    setControllers((prev) =>
      prev.map((c) => (c.key === key ? { ...c, suspended: next } : c)),
    )

  return (
    <div className="py-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Controller Management
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage controllers and their page access
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Plus size={16} />
            Add New Controller
          </button>
        </header>

        <div className="mt-6">
          <ControllersTable
            data={controllers}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleSuspended={handleToggleSuspended}
          />
        </div>
      </section>

      <ControllerFormModal
        open={formState.open}
        controller={formState.controller}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
