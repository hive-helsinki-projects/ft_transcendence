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
        summary: 'Fetch friends',
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
        summary: 'Delete a friend or deny friend request',
		tags: ['friend'],
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
        summary: 'Send friend request',
		tags: ['friend'],
        sharedFriendResponse
    }
};
    

export const patchFriendOpts = {
    schema: {
        summary: 'Accept friend request',
		tags: ['friend'],
        sharedFriendResponse
    }
}

export const getFriendStatusOpts = {
    schema: {
        summary: 'Fetch a friends online status',
		tags: ['friend'],
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
