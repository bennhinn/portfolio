import source from '../../creative-data.json';
export type Work = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  src: string;
  thumb: string;
  featured: boolean;
  kind: string;
};
export const works: Work[] = source;
export const campaigns = [
  {
    id: 'work-00',
    short: 'TUMAINI',
    word: 'Opportunity.',
    label: 'Community & opportunity',
    note: 'Bold blue, clear information and an invitation to take the next step.',
    color: '#155aee',
    paper: '#e8efff',
    ink: '#102c67',
    detail: 'Lettering & hierarchy',
    position: '50% 27%',
  },
  {
    id: 'work-04',
    short: 'Fresh Start',
    word: 'Beginnings.',
    label: 'Series identity',
    note: 'Botanical imagery, warm light and expressive lettering give renewal a visual language.',
    color: '#58833f',
    paper: '#eef2df',
    ink: '#273f23',
    detail: 'Type & texture',
    position: '50% 47%',
  },
  {
    id: 'work-17',
    short: 'Momentum',
    word: 'Movement.',
    label: 'Campaign design',
    note: 'An African pattern, radiant orange and bold type carry the energy of the campaign.',
    color: '#f46825',
    paper: '#fff0dd',
    ink: '#6b2c12',
    detail: 'Pattern & color',
    position: '50% 25%',
  },
  {
    id: 'work-19',
    short: '100 Families',
    word: 'Connection.',
    label: 'Community outreach',
    note: 'People come first. Warm photography and a clear invitation bring the message into focus.',
    color: '#ab6a24',
    paper: '#f7ebd9',
    ink: '#5a3719',
    detail: 'People & purpose',
    position: '50% 35%',
  },
  {
    id: 'work-02',
    short: 'Exhibition',
    word: 'Expression.',
    label: 'Event communication',
    note: 'Unexpected angles, vivid color and oversized lettering make space for an energetic gathering.',
    color: '#912fe4',
    paper: '#f0e8fd',
    ink: '#4d206e',
    detail: 'Color & contrast',
    position: '29% 50%',
  },
  {
    id: 'work-03',
    short: 'Service Hosts',
    word: 'Clarity.',
    label: 'Training announcement',
    note: 'A strong focal point and direct information help the message speak clearly.',
    color: '#592be5',
    paper: '#eae9ff',
    ink: '#29205a',
    detail: 'Focus & hierarchy',
    position: '35% 35%',
  },
].map((item, index) => ({
  ...item,
  work: works.find((w) => w.id === item.id)!,
  number: String(index + 1).padStart(2, '0'),
}));
export const collections = [
  {
    key: 'Events',
    title: 'Made to gather.',
    subtitle: 'Invitations with their own energy.',
    color: '#c4d0ff',
  },
  {
    key: 'Worship',
    title: 'Set the atmosphere.',
    subtitle: 'Visual stories for shared moments.',
    color: '#d3efce',
  },
  {
    key: 'Community',
    title: 'People at the center.',
    subtitle: 'Announcements that connect a community.',
    color: '#f3d5bb',
  },
  {
    key: 'Motion',
    title: 'A little movement.',
    subtitle: 'A five-second welcome, brought to life.',
    color: '#e1d2f7',
  },
];

// Shared archive data keeps category counts and rendered collections consistent.
export const archiveWorks = works.filter((work) => !work.featured);
export const archiveCollections = collections.map((collection) => ({
  ...collection,
  items: archiveWorks.filter((work) => work.category === collection.key),
}));
export const archiveFilters = [
  { key: 'All', count: archiveWorks.length },
  ...archiveCollections.map((collection) => ({
    key: collection.key,
    count: collection.items.length,
  })),
];

export const galleryStops = archiveCollections.flatMap(collection => {
  const rooms = [];
  for (let offset = 0; offset < collection.items.length; offset += 3) {
    rooms.push({
      id: `${collection.key.toLowerCase()}-${offset / 3}`,
      category: collection.key,
      title: collection.title,
      note: collection.subtitle,
      accent: collection.color,
      items: collection.items.slice(offset, offset + 3),
    });
  }
  return rooms;
});
export const galleryRooms = archiveCollections
  .filter(collection => collection.items.length > 0)
  .map(collection => ({key: collection.key, count: collection.items.length}));
