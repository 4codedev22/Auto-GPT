import * as bcrypt from 'bcryptjs';
import { config } from '../config';

export async function transformPassword(user: { passwordDigest?: string }): Promise<void> {
    if (user.passwordDigest) {
        user.passwordDigest = await bcrypt.hash(
            user.passwordDigest,
            config.get('mobfleet.security.authentication.jwt.hash-salt-or-rounds'),
        );
    }
    return Promise.resolve();
}
