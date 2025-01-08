'use client'

import { updateUser } from '@/app/actions/actions'
import { User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'
import { Button } from '@/components/ui/button'

interface UserEditDialogProps {
  user: User
}

export function UserEditDialog({ user }: UserEditDialogProps) {
  const handleEditUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const updatedUser = await updateUser(user.id, data)
      return {
        success: true,
        message: `User ${updatedUser.name} updated successfully`,
        data: updatedUser,
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user',
      }
    }
  }

  return (
    <MutableDialog<UserFormData>
      FormComponent={UserForm}
      action={handleEditUser}
      triggerButton={<Button>Edit</Button>}
      dialogTitle={`Edit ${user.name}`}
      dialogDescription={`Update the details of ${user.name} below.`}
      submitButtonLabel="Save Changes"
      defaultValues={{
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }}
    />
  )
}
