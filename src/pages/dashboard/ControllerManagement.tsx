import { useMemo, useState } from 'react'
import { message, Spin } from 'antd'
import { Plus } from 'lucide-react'
import ControllersTable from '../../components/dashboard/ControllersTable'
import ControllerFormModal, {
  type ControllerFormState,
} from '../../components/dashboard/ControllerFormModal'
import { type Controller } from '../../data/controllerData'
import {
  mapControllerFromApi,
  permissionsToApi,
  useCreateControllerMutation,
  useDeleteControllerMutation,
  useGetControllersQuery,
  useUpdateControllerMutation,
} from '../../redux/api/controllerApi'

function toControllerPayload(form: ControllerFormState) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    permissions: permissionsToApi(form.pageAccess),
  }
}

export default function ControllerManagement() {
  const [formState, setFormState] = useState<{
    open: boolean
    controller: Controller | null
  }>({ open: false, controller: null })

  const { data, isLoading, isError } = useGetControllersQuery({})
  const [createController, { isLoading: isCreating }] =
    useCreateControllerMutation()
  const [updateController, { isLoading: isUpdating }] =
    useUpdateControllerMutation()
  const [deleteController] = useDeleteControllerMutation()

  const isSubmitting = isCreating || isUpdating

  const controllers = useMemo(
    () => (data?.data ?? []).map(mapControllerFromApi),
    [data],
  )

  const openCreate = () =>
    setFormState({ open: true, controller: null })

  const openEdit = (controller: Controller) =>
    setFormState({ open: true, controller })

  const closeForm = () => {
    if (isSubmitting) return
    setFormState({ open: false, controller: null })
  }

  const handleSubmit = async (form: ControllerFormState) => {
    const payload = toControllerPayload(form)

    try {
      if (formState.controller) {
        const result = await updateController({
          id: formState.controller.key,
          body: payload,
        }).unwrap()
        message.success(result.message || 'Controller updated successfully.')
      } else {
        const result = await createController(payload).unwrap()
        message.success(result.message || 'Controller created successfully.')
      }
      setFormState({ open: false, controller: null })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : formState.controller
            ? 'Failed to update controller.'
            : 'Failed to create controller.'
      message.error(errorMessage)
    }
  }

  const handleDelete = async (key: string) => {
    try {
      const result = await deleteController(key).unwrap()
      message.success(result.message || 'Controller deleted successfully.')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete controller.'
      message.error(errorMessage)
    }
  }

  const handleToggleSuspended = (_key: string, _next: boolean) => {
    message.info('Suspend/reactivate is not available yet.')
  }

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
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin size="large" />
            </div>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-400">
              Failed to load controllers. Please try again.
            </p>
          ) : (
            <ControllersTable
              data={controllers}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleSuspended={handleToggleSuspended}
            />
          )}
        </div>
      </section>

      <ControllerFormModal
        open={formState.open}
        controller={formState.controller}
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
