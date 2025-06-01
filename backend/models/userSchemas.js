// User schema
export const User = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        email: { type: 'string', format: 'email' },
        online_status: { type: 'boolean' },
        avatar_url: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        two_fa_enabled: { type: 'boolean', nullable: false },
    },
    required: ['id', 'username', 'email', 'online_status', 'created_at', 'two_fa_enabled'],
};

// Schemas for user-related operations
export const getUsersOpts = {
    schema: {
        summary: 'Get all users',
		tags: ['user'],
        response: {
            200: {
                type: 'array',
                items: User,
            },
        },
    },
};

export const getUserOpts = {
    schema: {
        summary: 'Get a single user by id',
		tags: ['user'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: User,
        },
    },
};

export const putUserOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Update user information',
		tags: ['user'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        body: {
            type: 'object',
            required: [],
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20,
                    pattern: '^[a-zA-Z0-9]+$',
                    nullable: true
                },
                email: {
                    type: 'string',
                    format: 'email',
                    nullable: true
                },
                password: {
                    type: 'string',
                    minLength: 6,
                    nullable: true
                },
                avatar_url: {
                    type: 'string',
                    nullable: true
                },
                two_fa_enabled: {
                    type: 'boolean',
                    nullable: true
                },
                two_fa_secret: {
                    type: 'string',
                    nullable: true
                },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: User,
                },
            },
        },
    },
};

export const deleteUserOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Delete a user',
        tags: ['user'],
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                },
            },
        },
    },
}