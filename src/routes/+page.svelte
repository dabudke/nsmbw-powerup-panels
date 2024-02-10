<script lang="ts">
	import Button from '$lib/Button.svelte';
	import GridView from '$lib/GridView.svelte';
	import {
		worlds,
		type WorkingGrid,
		PowerUp,
		PowerUpImages,
		PowerUpAlt,
		type Grid
	} from '$lib/grid';
	import { base } from '$app/paths';

	let currentWorld: number | undefined;
	function worldSelect(world: number) {
		return () => {
			currentWorld = world--;
			possibleGrids = Array.from(worlds[currentWorld].grids);
		};
	}

	let grid: WorkingGrid = Array.from({ length: 3 }, () =>
		Array.from({ length: 6 }, () => undefined)
	);

	let possibleGrids: Grid[] = [];
	let currentSpace = 0;

	let highlightAll = false;

	function gridFilter() {
		for (var x = 0; x < 6; x++) {
			for (var y = 0; y < 3; y++) {
				if (grid[y][x] == undefined) continue;
				for (var i = 0; i < possibleGrids.length; ) {
					if (possibleGrids[i][y][x] !== grid[y][x]) possibleGrids.splice(i, 1);
					else i++;
				}
			}
		}
		highlightAll = possibleGrids.length == 1;
	}

	function enterPanel(item: PowerUp) {
		return () => {
			const [x, y] = worlds[currentWorld!].determiners[currentSpace];
			grid[y][x] = item;
			currentSpace++;
			gridFilter();
		};
	}

	function undo() {
		currentSpace--;
		const [x, y] = worlds[currentWorld!].determiners[currentSpace];
		grid[y][x] = undefined;
		possibleGrids = Array.from(worlds[currentWorld!].grids);
		gridFilter();
	}
	function restart() {
		currentSpace = 0;
		grid = Array.from({ length: 3 }, () => Array.from({ length: 6 }, () => undefined));
		possibleGrids = Array.from(worlds[currentWorld!].grids);
		highlightAll = false;
	}
	function changeWorld() {
		restart();
		currentWorld = undefined;
	}
</script>

<svelte:head>
	<title>NSMBWii Power-Up Panels Solver</title>
</svelte:head>

<GridView
	grid={possibleGrids.length == 1 ? possibleGrids[0] : grid}
	{highlightAll}
	active={currentWorld ? worlds[currentWorld].determiners[currentSpace] : undefined}
	highlighted={currentWorld && possibleGrids.length != 1
		? worlds[currentWorld].determiners.slice(0, currentSpace)
		: []}
/>

<section>
	{#if currentWorld == undefined}
		<h1>Choose a world</h1>
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
	{:else}
		{#if possibleGrids.length < 1}
			<h1>Invalid grid state</h1>
		{:else if possibleGrids.length == 1}
			<h1>Here is your solution!</h1>
		{:else if currentSpace >= worlds[currentWorld].determiners.length}
			<h1>Invalid grid state</h1>
		{:else}
			<h1>Enter the highlighted panel</h1>
			<span class="buttons">
				<Button image on:click={enterPanel(PowerUp.Mushroom)}>
					<img src={PowerUpImages[PowerUp.Mushroom]} alt={PowerUpAlt[PowerUp.Mushroom]} />
				</Button>
				<Button image on:click={enterPanel(PowerUp.FireFlower)}>
					<img src={PowerUpImages[PowerUp.FireFlower]} alt={PowerUpAlt[PowerUp.FireFlower]} />
				</Button>
				<Button image on:click={enterPanel(PowerUp.PropellerMushroom)}>
					<img
						src={PowerUpImages[PowerUp.PropellerMushroom]}
						alt={PowerUpAlt[PowerUp.PropellerMushroom]}
					/>
				</Button>
				<Button image on:click={enterPanel(PowerUp.IceFlower)}>
					<img src={PowerUpImages[PowerUp.IceFlower]} alt={PowerUpAlt[PowerUp.IceFlower]} />
				</Button>
				<Button image on:click={enterPanel(PowerUp.PenguinSuit)}>
					<img src={PowerUpImages[PowerUp.PenguinSuit]} alt={PowerUpAlt[PowerUp.PenguinSuit]} />
				</Button>
				<Button image on:click={enterPanel(PowerUp.MiniMushroom)}>
					<img src={PowerUpImages[PowerUp.MiniMushroom]} alt={PowerUpAlt[PowerUp.MiniMushroom]} />
				</Button>
				<Button image on:click={enterPanel(PowerUp.Star)}>
					<img src={PowerUpImages[PowerUp.Star]} alt={PowerUpAlt[PowerUp.Star]} />
				</Button>
			</span>
		{/if}
		<span class="buttons">
			<Button on:click={changeWorld}>Change World</Button>
			<Button on:click={undo} disabled={currentSpace == 0}>Undo</Button>
			<Button on:click={restart} disabled={currentSpace == 0}>Restart</Button>
		</span>
	{/if}
</section>

<span class="links">
	<a href="{base}/layouts/">View boards</a>
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
