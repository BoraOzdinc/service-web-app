'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export async function login({ email, password }: { email: string, password: string }) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {

        redirect(`/login?msg=${error.message}`)
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
        redirect(`/login?msg=${error.message}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup({ email, password }: { email: string, password: string }) {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
        redirect(`/login?msg=${error.message}`)
    }


    revalidatePath('/', 'layout')
    redirect('/login?q=Please check your inbox for verification.')
}
export async function signOut() {
    const supabase = createClient()


    const { error } = await supabase.auth.signOut()

    if (error) {
        redirect(`/login?msg=${error.message}`)

    }

    revalidatePath('/', 'layout')
    redirect('/')
}