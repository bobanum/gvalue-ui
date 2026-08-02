import { defineConfig } from 'vite';

export default defineConfig(() => {
	const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'gvalue-ui';
	const base = process.env.GITHUB_ACTIONS ? `/${repoName}/` : '/';

	return {
		base
	};
});