import { getLogs } from '$lib/server/db/actions/getLogs/getLogs';
import { dbTest } from '$test/fixtures';

dbTest('getLogs excludes logs from other users', async ({ tx, expect }) => {
	await expect(getLogs(tx, 'user1')).resolves.toEqual([]);
});
