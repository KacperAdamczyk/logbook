<script lang="ts">
	import { getUser } from "$lib/remotes/auth/auth.remote";

	const { user } = await getUser();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
Welcome: {user.name}
