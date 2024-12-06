import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  public authtenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAthenticationService.authenticate(googleTokenDto);
  }
}
