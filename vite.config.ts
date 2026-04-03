import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
	base: "/nsmbw-powerup-panels/",
	plugins: [react(), tailwind(), ViteImageOptimizer()],
	resolve: {
		preserveSymlinks: true

	}
});
