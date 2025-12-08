import {
  getBrandManifest,
  getParticles as loadParticles,
  getTextures as loadTextures,
  getWaves as loadWaves,
} from "@/lib/brand/manifest";

export {
  getBrandManifest,
  loadParticles as getParticles,
  loadTextures as getTextures,
  loadWaves as getWaves,
};

export async function getHeroLayers() {
  const [textures, waves, particles] = await Promise.all([
    loadTextures(),
    loadWaves(),
    loadParticles(),
  ]);

  const particleSources: Array<{ src: string; poster?: string }> = [];

  if (particles?.soft) {
    particleSources.push({ src: particles.soft, poster: particles.poster });
  }

  return {
    filmGrain: textures.filmGrain,
    glassSoft: textures.glassSoft,
    waveBg: waves.background ?? textures.glassSoft,
    waveMask: waves.mask,
    particles: particleSources,
  };
}
