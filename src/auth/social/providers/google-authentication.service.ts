import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly generateTokensProvider: GenerateTokensProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    // verify the Google Token sent by User
    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });

    // extract the payload from Google JWT
    const { email, sub: googleId } = loginTicket.getPayload();

    // find the user in the database using GoogleId
    const user = await this.usersService.findOneByGoogleId(googleId);

    // if googleId exists generate token
    if (user) {
      return this.generateTokensProvider.generateTokens(user);
    }

    // if not, create a new user and then generate tokens
    // throw Unauthorised exception
  }
}
