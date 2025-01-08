// app/components/user-dialog.tsx
'use client'

import { addUser, updateUser } from '@/app/actions/actions'
import { User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

interface UserDialogProps {
    mode: "create" | "edit"
    user?: User
    trigger?: React.ReactNode
}

export function UserDialog({ mode = "create", user, trigger }: UserDialogProps) {
    const handleAction = async (data: UserFormData): Promise<ActionState<User>> => {
        try {
            if (mode === "edit" && user) {
                const updatedUser = await updateUser(user.id, data)
                return {
                    success: true,
                    message: "YaY the change was successful! 🎉",
                    data: updatedUser
                }
            } else {
                const newUser = await addUser(data)
                return {
                    success: true,
                    message: "Welcome to the app! 👋",
                    data: newUser
                }
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed to process user'
            }
        }
    }

    return (
        <MutableDialog<UserFormData>
            FormComponent={UserForm}
            action={handleAction}
            triggerButton={trigger}
            dialogTitle={mode === "create" ? "Add New User" : "Edit User"}
            dialogDescription={mode === "create" 
                ? "Fill out the form below to add a new user."
                : "Update the user's information below."}
            submitButtonLabel={mode === "create" ? "Add User" : "Save Changes"}
            defaultValues={mode === "edit" ? {
                name: user?.name || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || ""
            } : undefined}
        />
    )
}