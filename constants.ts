import { MediaItem, MediaType } from './types';

export const APP_TITLE = "MARK'S ARCHIVE";
export const APP_SUBTITLE = "MARK 10 YEARS 2025";

// Relaxing, premium piano & ambient background music playlist
// Using reliable direct MP3 links
export const MUSIC_TRACKS = [
  { title: "Abla (Memories)", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=winds-of-spring-10671.mp3" }, 
  { title: "Soft Reflection", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=soft-piano-100-bpm-121529.mp3" }
];

/**
 * CLOUDINARY CONFIGURATION
 * 
 * Cloud Name: dv9sf6jai
 */
export const CLOUDINARY_CLOUD_NAME = "dv9sf6jai";

/**
 * Helper to generate Cloudinary URLs
 * Automatically applies optimization (f_auto) and quality adjustment (q_auto).
 */
const cldUrl = (publicId: string, type: 'image' | 'video' = 'image') => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${type}/upload/f_auto,q_auto/${publicId}`;
};

const createPhoto = (index: number, publicId: string) => ({
  id: `p${index}`,
  type: MediaType.PHOTO,
  url: cldUrl(publicId),
  title: `MEMORY #${index + 1}`,
  date: 'OCT 2023',
  description: 'A beautiful moment captured in time.'
});

const createVideo = (index: number, publicId: string) => ({
  id: `v${index}`,
  type: MediaType.VIDEO,
  url: cldUrl(publicId, 'video'),
  thumbnail: cldUrl(publicId, 'video').replace('.mp4', '.jpg'),
  title: `VIDEO MEMORY #${index + 1}`,
  date: 'OCT 2023',
  description: 'Action and laughter preserved forever.'
});

// List of Image Public IDs (Unique list)
const PHOTO_IDS = [
  'IMG_3022_sbnd1a', 'IMG_3025_gr0pfh', 'IMG_3028_upispm', 'IMG_3031_kinuxm', 'IMG_3032_vhn9le',
  'IMG_3037_vhn9le', 'IMG_3040_cll20w', 'IMG_3047_gngvm6', 'IMG_3050_zbcypw', 'IMG_3053_ec0yam',
  'IMG_3056_qt95yk', 'IMG_3057_g0pmi8', 'IMG_3062_hpoaha', 'IMG_3067_yiyfsz', 'IMG_3069_r1l8f5',
  'IMG_3071_ypjt3x', 'IMG_3072_lmcmyo', 'IMG_3073_t3959b', 'IMG_3083_skildn', 'IMG_3085_abgvui',
  'IMG_3086_k0z1ma', 'IMG_3088_bvmksf', 'IMG_3089_nr4lje', 'IMG_3092_sgpxlb', 'IMG_3093_jpljmo',
  'IMG_3098_tdbvmw', 'IMG_3101_ob5gcu', 'IMG_3102_ei4qbr', 'IMG_3118_a0o7fo', 'IMG_3129_chuj0b',
  'IMG_3136_qfwko4', 'IMG_3146_p5cpyf', 'IMG_3166_pgqhpc', 'IMG_3167_dkvlym', 'IMG_3180_mveozs',
  'IMG_3182_i5glkk', 'IMG_3185_ffr0xz', 'IMG_3197_xcvu1z', 'IMG_3206_fpkiiy', 'IMG_3212_my0yay',
  'IMG_3218_ylk9nd', 'IMG_3250_o0efa1', 'IMG_3251_hcmvuj', 'IMG_3256_ivt7sw', 'IMG_3264_1_gtnaib',
  'IMG_3279_p0jcsf', 'IMG_3282_fnmjmz', 'IMG_3307_lmubcf', 'IMG_3322_r0fzqu', 'IMG_3324_pua7e4',
  'IMG_3335_dyxsfp', 'IMG_3353_oduoc6', 'IMG_3357_p1fbq9', 'IMG_3363_pkvdha', 'IMG_3366_iiazml',
  'IMG_3371_yemfpx', 'IMG_3372_ue71jk', 'IMG_3376_p4djt9', 'IMG_3378_uftgyi', 'IMG_3386_s9i6uz',
  'IMG_3387_nceo0i', 'IMG_3390_ylgjex', 'IMG_3393_x10ibp', 'IMG_3398_okosjo', 'IMG_3409_h53rb6',
  'IMG_3414_efjbrl'
];

// List of Video Public IDs
const VIDEO_IDS = [
  'MVI_3048_ucczto', 'MVI_3064_ikvruc', 'MVI_3065_ocue36', 'MVI_3190_yhnpvc', 'MVI_3217_xkdpgn'
];

export const INITIAL_MEDIA: MediaItem[] = [
  ...PHOTO_IDS.map((id, index) => createPhoto(index, id)),
  ...VIDEO_IDS.map((id, index) => createVideo(index, id))
];