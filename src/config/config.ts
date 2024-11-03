export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    connectionString: process.env.MONGO_URL,
  },
  stripe: {
    apiKey: process.env.STRIPE_SECRET_API_KEY,
  },
  email: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
  websiteUrl: process.env.WEB_SITE_URL,
  domainUrl: process.env.DOMAIN_URL,
});
