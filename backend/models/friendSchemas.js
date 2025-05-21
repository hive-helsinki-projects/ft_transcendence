// Friend schema
export const Friend = {
    type: 'object',
    properties: {
        user_id: { type: 'integer' },
        friend_id: { type: 'integer' },
        status: { type: 'string', enum: ['pending', 'accepted'] }
    }
};

// Schemas for friend-related operations
export const getFriendsOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Get all friends of a user',
		tags: ['friend'],
        response: {
            200: {
                type: 'array',
                items: Friend,
            },
        },
    },
};

export const deleteFriendOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Remove a friend or deny friend request',
		tags: ['friend'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                },
            },
        },
    },
};

const sharedFriendResponse = {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: Friend,
                },
            },
        },
};

export const postFriendOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Send a friend request',
		tags: ['friend'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        sharedFriendResponse
    }
};
    

export const patchFriendOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Accept a friend request',
		tags: ['friend'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        sharedFriendResponse
    }
}

export const getFriendOnlineStatusOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Get a friends online status',
		tags: ['friend'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    online_status: { type: 'string', enum: ['online', 'offline'] },
                },
            },
        },
    },
};

export const getFriendStatusOpts = {
    schema: {
        security: [
            {
                bearerAuth: []
            }
        ],
        summary: 'Get a friends status',
		tags: ['friend'],
        params: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
            },
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    item: Friend,
                },
            },
        },
    },
};
