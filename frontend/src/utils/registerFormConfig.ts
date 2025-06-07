import { FormFieldConfig } from '../types/auth'

export const registerFormFields: FormFieldConfig[] = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Choose a username',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Create a password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
  },
] 