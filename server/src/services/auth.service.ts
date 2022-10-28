import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  generateSalt() {
    const set =
      '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    let salt = '';
    [...Array(10).keys()].forEach(() => {
      const p = Math.floor(Math.random() * set.length);
      salt += set[p];
    });
    return salt;
  }

  saltAndHashPassword(password) {
    const salt = this.generateSalt();
    return salt + this.md5(password + salt);
  }

  validatePassword(plainPassword, hashedPassword) {
    const salt = hashedPassword.substr(0, 10);
    const validHash = salt + this.md5(plainPassword + salt);
    return hashedPassword === validHash;
  }
}
