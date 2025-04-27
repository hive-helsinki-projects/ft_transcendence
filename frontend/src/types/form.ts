export interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface FormFieldProps {
  name: keyof FormData
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
} 