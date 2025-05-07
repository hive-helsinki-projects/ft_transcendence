export const setup2faOpts = {
    schema: {
      summary: "Generate a TOTP secret & QR code for the logged-in user",
      tags: ["2fa"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            qrDataUrl: { type: "string" },
          },
        },
      },
    },
  };

  export const verify2faOpts = {
    schema: {
      summary: "Verify a TOTP code and enable 2FA for the user",
      tags: ["2fa"],
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string", minLength: 6, maxLength: 6 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  };

  export const delete2faOpts = {
    schema: {
      summary: "Disable 2FA for the logged-in user",
      tags: ["2fa"],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  };
