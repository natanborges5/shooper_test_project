import { hash, verify } from 'argon2';
export class Password {
  static async generateHash(plainPassword: string) {
    return await hash(plainPassword);
  }

  static async compareHash(plainPassword: string, hashedPassword: string) {
    return verify(hashedPassword, plainPassword);
  }
}
