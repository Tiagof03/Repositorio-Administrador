import { useState } from 'react'
import {
  useAdminUsers,
  useUpdateUser,
  useDeleteUser,
  useAssignRoles,
  useRoles,
} from '@/features/admin-users/hooks/useAdminUsers'
import type { AdminUser, AdminUserUpdate } from '@/features/admin-users/types'
import UsersTable from '@/features/admin-users/components/UsersTable'
import UserFormModal from '@/features/admin-users/components/UserFormModal'
import RolesModal from '@/features/admin-users/components/RolesModal'
import DeleteConfirmModal from '@/features/admin-users/components/DeleteConfirmModal'
import { SkeletonTable } from '@/shared/Skeleton'
export default function AdminUsersPage() {
  const { data: users, isLoading, isError, error, refetch } = useAdminUsers()
  const { data: allRoles } = useRoles()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const rolesMutation = useAssignRoles()
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [rolesUser, setRolesUser] = useState<AdminUser | null>(null)
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)
  const handleEdit = (user: AdminUser) => setEditingUser(user)
  const handleRoles = (user: AdminUser) => setRolesUser(user)
  const handleUpdate = (payload: AdminUserUpdate) => {
    if (!editingUser) return
    updateMutation.mutate(
      { id: editingUser.id, payload },
      { onSuccess: () => setEditingUser(null) },
    )
  }
  const handleDeleteConfirm = () => {
    if (!deletingUser) return
    deleteMutation.mutate(deletingUser.id, {
      onSuccess: () => setDeletingUser(null),
    })
  }
  const handleRolesSubmit = (roles: string[]) => {
    if (!rolesUser) return
    rolesMutation.mutate(
      { id: rolesUser.id, roles },
      { onSuccess: () => setRolesUser(null) },
    )
  }
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="animate-pulse bg-surface-container-high h-8 w-48 mb-2" />
            <div className="animate-pulse bg-surface-container-high h-4 w-72" />
          </div>
        </div>
        <SkeletonTable rows={6} columns={5} />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 bg-error-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-error">cloud_off</span>
        </div>
        <p className="text-body-md text-on-surface-variant">Error al cargar usuarios</p>
        <p className="text-label-sm text-on-surface-variant/50">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-2 px-6 py-2.5 border border-outline-variant/30 text-on-surface text-label-md font-bold hover:bg-surface-container-high transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Reintentar
        </button>
      </div>
    )
  }
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h2 className="text-headline-lg font-bold text-on-surface">Usuarios</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Gestión de usuarios del sistema: edición de datos y asignación de roles.
          </p>
        </div>
      </div>
      <UsersTable
        data={users ?? []}
        onEdit={handleEdit}
        onRoles={handleRoles}
        onDelete={setDeletingUser}
      />
      {editingUser && (
        <UserFormModal
          user={editingUser}
          onSubmit={handleUpdate}
          onClose={() => setEditingUser(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}
      {rolesUser && (
        <RolesModal
          user={rolesUser}
          allRoles={allRoles ?? []}
          onSubmit={handleRolesSubmit}
          onClose={() => setRolesUser(null)}
          isSubmitting={rolesMutation.isPending}
        />
      )}
      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingUser(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  )
}