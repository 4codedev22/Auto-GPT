import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './payload.interface';
import { AuthService } from '../service/auth.service';
import { RegisterSituation } from '../domain/enumeration/register-situation';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECURITY_TOKEN_KEY,
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.validateUser(payload);
    if (!user) { return done(new UnauthorizedException({ message: 'user does not exist' }), false); }
    if (!user.active) { return done(new UnauthorizedException({ message: `user is not active` }), false); }
    if (user.blocked) { return done(new UnauthorizedException({ message: `user is blocked` }), false); }
    if (user.registerSituation !== RegisterSituation.APPROVED) {
      return done(new UnauthorizedException({ message: `user status is ${user.registerSituation}` }), false);
    }

    // Set user to request object
    return done(null, user);
  }

}
