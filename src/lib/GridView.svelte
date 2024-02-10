<script lang="ts">
	import type { WorkingGrid } from './grid';
	import { PowerUpImages, PowerUpAlt, PowerUp } from './grid';

	export let active: number[] | undefined = undefined;
	export let highlighted: number[][];
	export let grid: WorkingGrid;
	export let highlightAll: boolean = true;
</script>

<main>
	{#each grid as row, y}
		{#each row as space, x}
			<div
				class="space x{x} y{y}"
				class:active={active && active[0] == x && active[1] == y && !highlightAll}
				class:highlighted={highlighted.some(([px, py]) => px == x && py == y) ||
					(highlightAll && space != PowerUp.BowserJunior && space != PowerUp.Bowser)}
				class:bad={space == PowerUp.BowserJunior || space == PowerUp.Bowser}
			>
				{#if space != undefined}
					<img src={PowerUpImages[space]} alt={PowerUpAlt[space]} />
				{/if}
			</div>
		{/each}
	{/each}
</main>

<style>
	main {
		display: grid;
		grid-template: repeat(3, 1fr) / repeat(6, 1fr);
		gap: 0.3rem;
		height: fit-content;
		width: fit-content;
		max-width: 100vw;
		margin: auto;
	}

	.space {
		width: 2.6rem;
		height: 2.6rem;
		aspect-ratio: 1;
		padding: 0.6rem;

		background-color: var(--space);
		border-radius: 0.4rem;
		transition-property: box-shadow, background-color;
		transition-duration: 150ms;
	}

	.space > img {
		object-fit: scale-down;
		height: 100%;
		width: 100%;
	}

	.space.active {
		background-color: var(--space-active);
		box-shadow: inset 0 -0.35rem var(--space-active-shadow);
	}
	.space.highlighted {
		background-color: var(--space-highlight);
	}
	.space.bad {
		background-color: var(--space-bad);
	}

	.space.x0 {
		grid-column: 1/2;
	}
	.space.x1 {
		grid-column: 2/3;
	}
	.space.x2 {
		grid-column: 3/4;
	}
	.space.x3 {
		grid-column: 4/5;
	}
	.space.x4 {
		grid-column: 5/6;
	}
	.space.x5 {
		grid-column: 6/7;
	}

	.space.y0 {
		grid-row: 1/2;
	}
	.space.y1 {
		grid-row: 2/3;
	}
	.space.y2 {
		grid-row: 3/4;
	}
</style>
