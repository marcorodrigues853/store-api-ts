import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { Token } from '../models/Token';

interface TokenPayload {
  id: string;
  roles: string[];
}
class TokenService {
  generateTokens(user: any) {
    const { id } = user;
    const roles: string[] = user.roles;

    const payload = {
      id,
      roles,
    };

    const accessToken = jwt.sign(
      payload,
      String(process.env.JWT_ACCESS_SECRET_KEY),
      { expiresIn: '15d' },
    );
    const refreshToken = jwt.sign(
      payload,
      String(process.env.JWT_REFRESH_SECRET_KEY),
      { expiresIn: '30d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  generateActivationAccountToken(id: string) {
    const payload = { id };
    const refreshToken = jwt.sign(
      payload,
      String(process.env.JWT_REFRESH_SECRET_KEY),
      { expiresIn: '60m' },
    );
    return { refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        String(process.env.JWT_ACCESS_SECRET_KEY),
      );
      return userData as TokenPayload;
    } catch (e) {
      throw e;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(
        token,
        String(process.env.JWT_REFRESH_SECRET_KEY),
      ) as TokenPayload;
      return userData;
    } catch (error) {
      throw error;
    }
  }
}

export default new TokenService();
