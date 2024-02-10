<script lang="ts">
	export let disabled: boolean = false;
	export let image: boolean = false;
</script>

<button {disabled} class:image on:click><slot /></button>

<style>
	button {
		border-radius: 0.4rem;
		color: var(--button-text);
		font-weight: 600;
		background-color: var(--button);
		height: 2.5rem;
		padding: 0 0.7rem;
		box-shadow: inset 0 -0.25rem var(--button-shadow);
		border: none;
		transition-property: box-shadow, background-color;
		transition-duration: 250ms;
	}
	button:hover {
		background-color: var(--button-hover);
	}
	button:active {
		box-shadow: none;
		background-color: var(--button-shadow);
	}
	button:disabled {
		box-shadow: none;
		background-color: var(--button-disabled);
	}

	.image {
		width: 2.5rem;
		padding: 0.5rem;
	}
	.image > :global(img) {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}
</style>
