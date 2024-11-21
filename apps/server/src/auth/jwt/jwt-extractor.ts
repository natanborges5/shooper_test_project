export class JwtExtractor {
  static extractFromAuthHeader(authorization?: string | undefined) {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
