// Editorial/brand imagery only (hero, story, About). Product images come from the API.
// Direct Unsplash image URLs (Unsplash License). Every <SafeImage> falls back
// to a neutral placeholder if a URL is ever unavailable. 
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const img = {
  watchB: u("photo-1524592094714-0f0654e20314"),
  perfumeB: u("photo-1594035910387-fea47794261f"),
  walletA: u("photo-1627123424574-724758594e93"),
  hero: u("photo-1523170335258-f5ed11844a49", 1400),
  story: u("photo-1610701596007-11502861dcfa", 1400),
};
