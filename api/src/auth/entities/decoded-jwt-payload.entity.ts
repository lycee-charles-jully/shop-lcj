import { JwtPayloadEntity } from './jwt-payload.entity';

export class DecodedJwtPayloadEntity extends JwtPayloadEntity {
    /** Issued at */
    iat: number;

    /** Expiration time */
    exp: number;
}
