'use server'

import { revalidatePath } from 'next/cache'
import { User, userSchema } from './schemas'
import crypto from 'crypto';
import { prisma } from '@/lib/prisma'

export async function searchUsers(query: string): Promise<User[]> {
    return await prisma.user.findMany({
        where: {
            name: {
                startsWith: query,
                mode: 'insensitive'
            }
        }
    })
}

export async function addUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return await prisma.user.create({ data })
}

export async function deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/')
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const updatedUser = await prisma.user.update({
        where: { id },
        data
    })
    revalidatePath('/')
    return updatedUser
}

export async function getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } })
}

export async function getUsers() {
    return await prisma.user.findMany()
}