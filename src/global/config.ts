export interface ConfigInterface {
  server: {
    port: number;
  };
  database: {
    connectionString: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  email: {
    sendGridKey: string;
  };
}

const config = (): ConfigInterface => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    connectionString: process.env.DATABASE_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  email: {
    sendGridKey: process.env.SENDGRID_API_KEY,
  },
});

export default config;
