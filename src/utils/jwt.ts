import { type JwtPayload, type SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

  return token;
};

const verifyToken = (accessToken: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret);
    return {
      success: true,
      data: verifiedToken as JwtPayload,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid token"
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
