export type Recommendation = {
  title: string;
  year: number;
  image: string;
  description: string;
  genres: string[];
};

export type GalleryItem = {
  src: string;
  title: string;
  caption: string;
  source: string;
};

export type NeighborButton = {
  name: string;
  href: string;
  image: string;
};

export type SynthTrack = {
  title: string;
  subtitle: string;
  bpm: number;
  duration: number;
  notes: number[];
  root: number;
};

export const navigation = [
  { id: "home", label: "/home", hint: "return to the entrance" },
  { id: "about", label: "/about", hint: "a little about this room" },
  { id: "journal", label: "/changelog", hint: "site notes & updates" },
  { id: "shrine", label: "/media-shrine", hint: "games worth getting lost in" },
  { id: "gallery", label: "/scrapbook", hint: "saved images & fragments" },
  { id: "guestbook", label: "/guestbook", hint: "leave a tiny letter" },
  { id: "links", label: "/neighbors", hint: "other handmade websites" },
];

export const updates = [
  {
    date: "2026.02.22",
    tag: "layout",
    text: "rebuilt the room in violet-gray, repaired the mobile menu, and added a switch for the CRT glass.",
  },
  {
    date: "2026.02.18",
    tag: "music",
    text: "made a tiny browser-synth radio. no autoplay, no tracking—press play only if you want company.",
  },
  {
    date: "2026.02.09",
    tag: "shrine",
    text: "catalogued twelve old favorites and added filters for late-night genre wandering.",
  },
  {
    date: "2026.01.27",
    tag: "letters",
    text: "opened the guestbook. notes stay in your own browser, like a private pocket notebook.",
  },
  {
    date: "2026.01.12",
    tag: "misc",
    text: "collected neighbor buttons, rescued some pixel art, and taped everything together with messy code.",
  },
];

export const recommendations: Recommendation[] = [
  {
    title: "xenosaga episode I: der wille zur macht",
    year: 2002,
    image: "https://sword-of-moonlight.moe/images/xeno.jpg",
    description: "turn-based science fiction, mecha, and an enormous story best entered slowly.",
    genres: ["jrpg", "sci-fi"],
  },
  {
    title: "xenogears",
    year: 1998,
    image: "https://sword-of-moonlight.moe/images/xenogears.jpg",
    description: "a story-heavy mecha jrpg with the strange gravity of a half-remembered dream.",
    genres: ["jrpg", "sci-fi"],
  },
  {
    title: "lunacid",
    year: 2023,
    image: "https://sword-of-moonlight.moe/images/lunacid.jpg",
    description: "indie dark-fantasy dungeon crawling; get lost, make a map, descend again.",
    genres: ["dungeon crawler", "dark fantasy"],
  },
  {
    title: "shadow tower: abyss",
    year: 2003,
    image: "https://sword-of-moonlight.moe/images/shadowtower.jpg",
    description: "an oppressive first-person crawl through ruins, strange creatures, and deeper dark.",
    genres: ["dungeon crawler", "dark fantasy", "horror"],
  },
  {
    title: ".hack//infection",
    year: 2002,
    image: "https://sword-of-moonlight.moe/images/hack.jpg",
    description: "a digital mystery wrapped inside a simulated online jrpg. check your messages.",
    genres: ["jrpg", "digital"],
  },
  {
    title: "nier replicant ver.1.22474487139...",
    year: 2021,
    image: "https://sword-of-moonlight.moe/images/nier.jpg",
    description: "melancholic action, impossible kindness, and a soundtrack that follows you home.",
    genres: ["jrpg", "story-heavy"],
  },
  {
    title: "tsukihime",
    year: 2000,
    image: "https://sword-of-moonlight.moe/images/tsukihime.jpg",
    description: "a supernatural visual novel of vampires, romance, mystery, and blue midnight.",
    genres: ["visual novel", "horror", "romance"],
  },
  {
    title: "higurashi when they cry",
    year: 2002,
    image: "https://sword-of-moonlight.moe/images/higu.jpg",
    description: "rural summer, psychological horror, and the fragile work of believing your friends.",
    genres: ["visual novel", "horror", "mystery"],
  },
  {
    title: "deathsmiles",
    year: 2007,
    image: "https://sword-of-moonlight.moe/images/deathsmiles.jpg",
    description: "gothic arcade shooting with wind-up toys, haunted castles, and cute witches.",
    genres: ["arcade", "gothic"],
  },
  {
    title: "the legend of zelda: twilight princess",
    year: 2006,
    image: "https://sword-of-moonlight.moe/images/tp.png",
    description: "a shadow-stained fantasy adventure of quiet villages, puzzles, and twilight.",
    genres: ["adventure", "fantasy"],
  },
  {
    title: "fuga: melodies of steel",
    year: 2021,
    image: "https://sword-of-moonlight.moe/images/fuga.jpg",
    description: "turn-based strategy aboard an enormous tank; tender, dangerous, and beautifully drawn.",
    genres: ["strategy", "story-heavy"],
  },
  {
    title: "touhou: scarlet curiosity",
    year: 2014,
    image: "https://sword-of-moonlight.moe/images/2hu.jpg",
    description: "a bright fan-made action rpg detour through familiar places and bullet patterns.",
    genres: ["jrpg", "adventure"],
  },
];

export const gallery: GalleryItem[] = [
  {
    src: "https://var1ac4t.neocities.org/art/Illustration143(1).png",
    title: "unfinished drawing",
    caption: "an unfinished drawing, preserved exactly as found in var1ac4t's palace.",
    source: "https://var1ac4t.neocities.org/",
  },
  {
    src: "https://var1ac4t.neocities.org/art/Illustration124.png",
    title: "a sketch between pages",
    caption: "another small artwork from the same hand-drawn corner of the web.",
    source: "https://var1ac4t.neocities.org/",
  },
  {
    src: "https://sword-of-moonlight.moe/images/indexheadn.jpg",
    title: "the secret room header",
    caption: "the muted dreamlike header artwork that shaped this room's atmosphere.",
    source: "https://sword-of-moonlight.moe/",
  },
  {
    src: "https://kyuunkurarin.neocities.org/yay.webp",
    title: "scotch-tape memories",
    caption: "a soft web fragment from kyuunkurarin's gloriously inconsistent rabbithole.",
    source: "https://kyuunkurarin.neocities.org/",
  },
];

export const neighborButtons: NeighborButton[] = [
  { name: "var1ac4t", href: "https://var1ac4t.neocities.org/", image: "https://var1ac4t.neocities.org/button.gif" },
  { name: "demisdesignart", href: "https://demisdesignart.neocities.org/", image: "https://demisdesignart.neocities.org/demisbutton.png" },
  { name: "nukochannel", href: "https://nukochannel.neocities.org/", image: "https://nukochannel.neocities.org/NukoChannelButton.gif" },
  { name: "moekkis", href: "https://moekkis.neocities.org/", image: "https://moekkis.neocities.org/moebutton.png" },
  { name: "diflurry", href: "https://diflurry.neocities.org/", image: "https://diflurry.neocities.org/button1.gif" },
  { name: "drizzle", href: "https://drizzle.neocities.org/", image: "https://drizzle.neocities.org/button.gif" },
  { name: "vrelle", href: "https://vrelle.neocities.org/", image: "https://vrelle.neocities.org/indximages/btn.png" },
  { name: "hihijihi", href: "https://hihijihi.neocities.org/", image: "https://hihijihi.neocities.org/webbutton01.png" },
  { name: "noctcaelum", href: "https://noctcaelum.neocities.org/", image: "https://cdn.imgchest.com/files/0faf3d12a619.png" },
  { name: "kanandraw", href: "https://kanandraw.neocities.org/", image: "https://kanandraw.neocities.org/stampimg/kananbutton.gif" },
  { name: "pankesito", href: "https://pankesito.neocities.org/", image: "https://pankesito.neocities.org/button.png" },
  { name: "meowmeow cafe", href: "https://meowmeow-cafe.neocities.org/", image: "https://meowmeow-cafe.neocities.org/layout/images/meowbutton2.gif" },
];

export const tracks: SynthTrack[] = [
  {
    title: "plastic moon",
    subtitle: "original loop 001 / browser synth",
    bpm: 82,
    duration: 32,
    root: 130.81,
    notes: [261.63, 329.63, 392.0, 493.88, 392.0, 329.63, 293.66, 392.0, 440.0, 523.25, 392.0, 329.63, 293.66, 261.63, 220.0, 329.63],
  },
  {
    title: "memory card lullaby",
    subtitle: "original loop 002 / browser synth",
    bpm: 72,
    duration: 32,
    root: 110.0,
    notes: [220.0, 261.63, 329.63, 392.0, 329.63, 261.63, 246.94, 293.66, 369.99, 440.0, 369.99, 293.66, 220.0, 261.63, 329.63, 261.63],
  },
  {
    title: "dial-up daydream",
    subtitle: "original loop 003 / browser synth",
    bpm: 94,
    duration: 32,
    root: 146.83,
    notes: [293.66, 369.99, 440.0, 587.33, 440.0, 369.99, 329.63, 415.3, 493.88, 659.25, 493.88, 415.3, 293.66, 349.23, 440.0, 349.23],
  },
];
