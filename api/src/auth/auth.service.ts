import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly AccountService: AccountService) {
    }

    async validateUser(email: string, password: string) {
        const account = await this.AccountService.findUserByEmail(email);
        if (!account)
            return null;
        if (!bcrypt.compareSync(password, account.password!))
            return null;
        return account;
    }
}
