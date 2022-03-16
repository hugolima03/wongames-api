module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '515ad0583404ee7c18ef0dab04043d0b'),
  },
});
