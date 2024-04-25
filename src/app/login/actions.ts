'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export async function login({ email, password }: { email: string, password: string }) {
    const supabase = createClient()

    console.log("email: ", email);
    console.log("password: ", password);

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {

        console.log(error.message);
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
        console.log(error.message);
        redirect(`/login?msg=${error.message}`)

    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup({ email, password }: { email: string, password: string }) {
    const supabase = createClient()
    console.log("email: ", email);
    console.log("password: ", password);
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
        console.log(error.message);
        redirect(`/login?msg=${error.message}`)

    }

    console.log("data:", data);
    console.log("err:", error);

    revalidatePath('/', 'layout')
    redirect('/')
}
export async function signOut() {
    const supabase = createClient()

    console.log("signout");

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.log(error.message);
        redirect(`/login?msg=${error.message}`)

    }

    revalidatePath('/', 'layout')
    redirect('/')
}