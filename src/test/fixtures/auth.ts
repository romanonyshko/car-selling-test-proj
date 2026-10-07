import type { LoginRequest, LoginResponse } from '@auto-lincoln/contracts'

export const credentials: LoginRequest = {
  email: 'admin@auto-lincoln.test',
  password: 'secret',
}

export const user: LoginResponse = {
  id: '1b2c3d4e-0000-4000-8000-000000000031',
  email: 'admin@auto-lincoln.test',
  name: 'Admin',
}
