/**
 * API configuration.
 *
 * DEV_BYPASS_AUTH — when true, skips PocketBase authentication and uses
 * the in-memory mock backend. Set to false to require real sign-in.
 */
export const DEV_BYPASS_AUTH = false;

export const POCKETBASE_URL = 'http://10.0.0.60:8090';

/**
 * Experimental flags.
 *
 * EXPERIMENTAL_MAP_CLOCK_BG — when true, replaces the timeline on the
 * clock screen with a full-screen map background (Apple Maps style).
 */
export const EXPERIMENTAL_MAP_CLOCK_BG = true;
