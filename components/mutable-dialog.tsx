'use client';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { ZodSchema } from "zod"
import { UseFormReturn } from "react-hook-form"
import { userFormSchema, UserFormData } from "@/app/actions/schemas"
import { FieldValues, DefaultValues } from "react-hook-form"

export interface ActionState<T> {
    success: boolean
    message: string
    data?: T
}

interface MutableDialogProps<T extends FieldValues> {
    FormComponent: React.ComponentType<{ form: UseFormReturn<T> }>
    action: (data: T) => Promise<ActionState<any>>
    triggerButton?: React.ReactNode
    dialogTitle: string
    dialogDescription: string
    submitButtonLabel: string
    defaultValues?: DefaultValues<T>
}

export default function MutableDialog<T extends FieldValues>({
    FormComponent,
    action,
    triggerButton,
    dialogTitle,
    dialogDescription,
    submitButtonLabel,
    defaultValues
}: MutableDialogProps<T>) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<T>({
        defaultValues
    })

    async function onSubmit(data: T) {
        try {
            const result = await action(data)
            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                })
                form.reset()
                setOpen(false)
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormComponent form={form} />
                    <Button type="submit" className="w-full">
                        {submitButtonLabel}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}