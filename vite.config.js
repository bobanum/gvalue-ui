import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig(() => {
	const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'gvalue-ui';
	const base = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';

	return {
		base,
		plugins: [
			{
				name: 'copy-data-dir',
				closeBundle() {
					const src = resolve(__dirname, 'data');
					const dst = resolve(__dirname, 'dist', 'data');

					if (existsSync(src)) {
						cpSync(src, dst, { recursive: true });
					}
				}
			}
		]
	};
});