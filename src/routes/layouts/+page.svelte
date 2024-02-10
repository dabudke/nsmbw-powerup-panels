<script lang="ts">
	import Button from '$lib/Button.svelte';
	import GridView from '$lib/GridView.svelte';
	import { worlds, type Grid } from '$lib/grid';
	import { base } from '$app/paths';

	let currentWorld: number | undefined;
	let determiners: [number, number][] = [];

	let currentLayout: number | undefined;
	const blankGrid = Array(3).fill(Array(6).fill(undefined));
	let grid: Grid = blankGrid;

	function worldSelect(world: number): () => void {
		return () => {
			currentWorld = world - 1;
			currentLayout = undefined;
			determiners = <[number, number][]>worlds[currentWorld].determiners;
			grid = blankGrid;
		};
	}
	function layoutSelect(layout: number): () => void {
		return () => {
			currentLayout = layout - 1;
			grid = worlds[currentWorld!].grids[currentLayout];
		};
	}
</script>

<svelte:head>
	<title>NSMBW Power-Up Panels Layout Viewer</title>
</svelte:head>

<GridView {grid} highlighted={determiners} />

<section>
	<h1>Select a world, then select a layout</h1>
	<span class="buttons">
		<Button on:click={worldSelect(1)} disabled={currentWorld == 0}>W1</Button>
		<Button on:click={worldSelect(2)} disabled={currentWorld == 1}>W2</Button>
		<Button on:click={worldSelect(3)} disabled={currentWorld == 2}>W3</Button>
		<Button on:click={worldSelect(4)} disabled={currentWorld == 3}>W4</Button>
		<Button on:click={worldSelect(5)} disabled={currentWorld == 4}>W5</Button>
		<Button on:click={worldSelect(6)} disabled={currentWorld == 5}>W6</Button>
		<Button on:click={worldSelect(7)} disabled={currentWorld == 6}>W7</Button>
		<Button on:click={worldSelect(8)} disabled={currentWorld == 7}>W8</Button>
		<Button on:click={worldSelect(9)} disabled={currentWorld == 8}>W9</Button>
	</span>
	<span class="buttons">
		<Button disabled={currentWorld == undefined || currentLayout == 0} on:click={layoutSelect(1)}
			>L1</Button
		>
		<Button disabled={currentWorld == undefined || currentLayout == 1} on:click={layoutSelect(2)}
			>L2</Button
		>
		<Button disabled={currentWorld == undefined || currentLayout == 2} on:click={layoutSelect(3)}
			>L3</Button
		>
		<Button disabled={currentWorld == undefined || currentLayout == 3} on:click={layoutSelect(4)}
			>L4</Button
		>
		<Button disabled={currentWorld == undefined || currentLayout == 4} on:click={layoutSelect(5)}
			>L5</Button
		>
		<Button disabled={currentWorld == undefined || currentLayout == 5} on:click={layoutSelect(6)}
			>L6</Button
		>
	</span>
</section>

<span class="links">
	<a href="{base}/">Go to solver</a>
	&bull;
	<a href="https://github.com/dabudke/nsmbw-powerup-panels">View source</a>
</span>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.buttons {
		display: flex;
		width: min-content;
	}
	.buttons:not(:last-child) {
		margin-bottom: 0.3rem;
	}
	.buttons > :global(:not(:last-child)) {
		margin-right: 0.2rem;
	}

	.links {
		display: block;
		margin-top: 1rem;
		text-align: center;
	}
</style>
