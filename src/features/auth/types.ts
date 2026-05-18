export type AuthField = 'email' | 'password' | 'fullName' | 'form'

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string; field: AuthField }
