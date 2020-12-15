export default {
  saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  jwt: {
    secret: String(process.env.JWT_SECRET),
    duation: String(process.env.JWT_DUATION || '1h'),
    privateKey: String(process.env.JWT_PRIVATE_KEY).replace(/\\n/gm, '\n'),
    pubicKey: String(process.env.JWT_PUBLIC_KEY).replace(/\\n/gm, '\n'),
  },
};
