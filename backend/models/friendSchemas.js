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

const sharedFriendSchema = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: { type: 'string' },
                    item: Friend,
                },
            },
        },
    },
};

export const postFriendOpts = sharedFriendSchema;

export const patchFriendOpts = sharedFriendSchema;

export const getFriendStatusOpts = {
    schema: {
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
