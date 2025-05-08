import t from 'tap';
import buildApp from '../app.js';
import { resetTestDb } from './utils/resetTestDb.js';

import runAuthTests from './auth.test.js';
import runUserTests from './user.test.js';
import runFriendTests from './friend.test.js';
import runPlayerTests from './player.test.js';
import runMatchHistoryTests from './match.test.js';
import runTournamentTests from './tournament.test.js';
import run2faTests from './2fa.test.js';

t.test('All Test', async (t) => {
    const app = buildApp();
    await app.ready();

    t.teardown(async () => {
        await app.close();
        resetTestDb();
    })

    runAuthTests(app, t);
    runUserTests(app, t);
    runFriendTests(app, t);
    runPlayerTests(app, t);
    runMatchHistoryTests(app, t);
    runTournamentTests(app, t);
    run2faTests(app, t);
})
