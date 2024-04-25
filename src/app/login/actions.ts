'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'
import toast from 'react-hot-toast'

export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        toast.error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
export async function loginWithGoogle() {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        toast.error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        toast.error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
export async function signOut() {
    const supabase = createClient()

    console.log("signout");

    const { error } = await supabase.auth.signOut()

    if (error) {
        toast.error(error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}