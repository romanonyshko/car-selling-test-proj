import { API_ROUTES, type HealthResponse } from '@auto-lincoln/shared'
import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthController {
  @Get(API_ROUTES.health)
  check(): HealthResponse {
    return { status: 'ok', backend: 'nest' }
  }
}
