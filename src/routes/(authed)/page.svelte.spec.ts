import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page, {
			props: {
				data: {
					user: {
						id: '1',
						name: 'John Doe',
						createdAt: new Date('2023-10-01'),
						updatedAt: new Date('2025-10-01'),
						email: 'john.doe@example.com',
						emailVerified: true
					},
					session: {
						userId: '1',
						id: 'session-1',
						createdAt: new Date('2025-10-01'),
						updatedAt: new Date('2025-10-02'),
						expiresAt: new Date('2025-11-01'),
						token: 'token-abc'
					}
				}
			}
		});

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
