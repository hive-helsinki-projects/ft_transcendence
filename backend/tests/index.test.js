import t from 'tap';
import buildApp from '../app.js';
import { resetTestDb } from './utils/resetTestDb.js';

import runAuthTests from './auth.test.js';

t.test('All Test', async (t) => {
    const app = buildApp();
    await app.ready();
    
    t.teardown(async () => {
        await app.close();
        resetTestDb();
    })
    
    runAuthTests(app, t);
    
})