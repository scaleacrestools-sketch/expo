/*
 * Project imagery from the official L&T Realty Aravista brochure (Sector 86 Gurugram OpDeck).
 * The master plan is the higher-resolution copy of the same drawing published on lntaravista.co.
 * Every photo has an 800 px and a 1600 px WebP so phones never download desktop files.
 * Floor plans have a 1200 px display copy; the full-resolution file loads only in the zoom viewer.
 * Hero images live in /public/images/hero so they can be preloaded from index.html.
 */
import ProjectLogo from '../assets/images/lt-realty-logo-320.webp';
import OutdoorPool800 from '../assets/images/aravista-outdoor-pool-800.webp';
import OutdoorPool1600 from '../assets/images/aravista-outdoor-pool-1600.webp';
import CentralClub800 from '../assets/images/aravista-central-club-800.webp';
import CentralClub1600 from '../assets/images/aravista-central-club-1600.webp';
import ClubLobby800 from '../assets/images/aravista-club-lobby-800.webp';
import ClubLobby1600 from '../assets/images/aravista-club-lobby-1600.webp';
import IndoorPool800 from '../assets/images/aravista-indoor-pool-800.webp';
import IndoorPool1600 from '../assets/images/aravista-indoor-pool-1600.webp';
import LivingRoom800 from '../assets/images/aravista-living-room-800.webp';
import LivingRoom1600 from '../assets/images/aravista-living-room-1600.webp';
import CentralLandscape800 from '../assets/images/aravista-central-landscape-800.webp';
import CentralLandscape1600 from '../assets/images/aravista-central-landscape-1600.webp';
import WellnessGarden800 from '../assets/images/aravista-wellness-garden-800.webp';
import WellnessGarden1600 from '../assets/images/aravista-wellness-garden-1600.webp';
import ArenaSports800 from '../assets/images/aravista-arena-sports-800.webp';
import ArenaSports1600 from '../assets/images/aravista-arena-sports-1600.webp';
import OutdoorPoolThumb from '../assets/images/aravista-outdoor-pool-thumb.webp';
import CentralClubThumb from '../assets/images/aravista-central-club-thumb.webp';
import ClubLobbyThumb from '../assets/images/aravista-club-lobby-thumb.webp';
import IndoorPoolThumb from '../assets/images/aravista-indoor-pool-thumb.webp';
import LivingRoomThumb from '../assets/images/aravista-living-room-thumb.webp';
import CentralLandscapeThumb from '../assets/images/aravista-central-landscape-thumb.webp';
import WellnessGardenThumb from '../assets/images/aravista-wellness-garden-thumb.webp';
import ArenaSportsThumb from '../assets/images/aravista-arena-sports-thumb.webp';
import OasisOfCalm from '../assets/images/aravista-oasis-of-calm.webp';
import MasterPlan from '../assets/images/aravista-master-plan.webp';
import MasterPlan1200 from '../assets/images/aravista-master-plan-1200.webp';
import LocationMap from '../assets/images/aravista-location-map.webp';
import LocationMap1200 from '../assets/images/aravista-location-map-1200.webp';
import PlanMajesta from '../assets/images/plan-3bhk-majesta.webp';
import PlanMajesta1200 from '../assets/images/plan-3bhk-majesta-1200.webp';
import PlanRegalia from '../assets/images/plan-3bhk-regalia.webp';
import PlanRegalia1200 from '../assets/images/plan-3bhk-regalia-1200.webp';
import PlanRoyale from '../assets/images/plan-4bhk-royale.webp';
import PlanRoyale1200 from '../assets/images/plan-4bhk-royale-1200.webp';
import PlanLuxuria from '../assets/images/plan-4bhk-luxuria.webp';
import PlanLuxuria1200 from '../assets/images/plan-4bhk-luxuria-1200.webp';
import PlanTower1 from '../assets/images/plan-tower1-typical.webp';
import PlanTower2 from '../assets/images/plan-tower2-typical.webp';
import PlanTower3 from '../assets/images/plan-tower3-typical.webp';
import SpecMarble from '../assets/images/spec-marble-flooring.webp';
import SpecKitchen from '../assets/images/spec-modular-kitchen.webp';
import SpecSanitary from '../assets/images/spec-sanitaryware.webp';
import SpecLobby from '../assets/images/spec-entrance-lobby.webp';
import SpecPower from '../assets/images/spec-power-backup.webp';
import SpecSecurity from '../assets/images/spec-security.webp';

const photo = (s800, s1600, w, h, thumb) => ({ src: s1600, srcSet: `${s800} 800w, ${s1600} ${w}w`, width: w, height: h, thumb });
const plan = (full, display, w = 2880, h = 1620) => ({ src: display, full, srcSet: `${display} 1200w, ${full} ${w}w`, width: w, height: h });

export const IMAGES = {
  ProjectLogo,
  OutdoorPool: photo(OutdoorPool800, OutdoorPool1600, 1600, 900, OutdoorPoolThumb),
  CentralClub: photo(CentralClub800, CentralClub1600, 1600, 899, CentralClubThumb),
  ClubLobby: photo(ClubLobby800, ClubLobby1600, 1600, 900, ClubLobbyThumb),
  IndoorPool: photo(IndoorPool800, IndoorPool1600, 1600, 900, IndoorPoolThumb),
  LivingRoom: photo(LivingRoom800, LivingRoom1600, 1532, 776, LivingRoomThumb),
  CentralLandscape: photo(CentralLandscape800, CentralLandscape1600, 1536, 865, CentralLandscapeThumb),
  WellnessGarden: photo(WellnessGarden800, WellnessGarden1600, 1600, 901, WellnessGardenThumb),
  ArenaSports: photo(ArenaSports800, ArenaSports1600, 1374, 770, ArenaSportsThumb),
  OasisOfCalm: { src: OasisOfCalm, width: 615, height: 461 },
  MasterPlan: plan(MasterPlan, MasterPlan1200, 2208, 1800),
  LocationMap: plan(LocationMap, LocationMap1200),
  Plans: {
    Majesta: plan(PlanMajesta, PlanMajesta1200),
    Regalia: plan(PlanRegalia, PlanRegalia1200),
    Royale: plan(PlanRoyale, PlanRoyale1200),
    Luxuria: plan(PlanLuxuria, PlanLuxuria1200),
    Tower1: PlanTower1,
    Tower2: PlanTower2,
    Tower3: PlanTower3,
  },
  Specs: {
    Marble: SpecMarble,
    Kitchen: SpecKitchen,
    Sanitary: SpecSanitary,
    Lobby: SpecLobby,
    Power: SpecPower,
    Security: SpecSecurity,
  },
};

/** Hero: outdoor pool and clubhouse (desktop) and a portrait crop of The Central Social Club (mobile). */
export const HERO = {
  alt: 'L&T Realty Aravista clubhouse and outdoor swimming pool at Sector 86, Gurugram (artistic impression)',
  mobileAlt: 'The Central Social Club at L&T Realty Aravista, Sector 86, Gurugram (artistic impression)',
  desktop: {
    avif: '/images/hero/aravista-hero-960.avif 960w, /images/hero/aravista-hero-1280.avif 1280w, /images/hero/aravista-hero-1600.avif 1600w',
    webp: '/images/hero/aravista-hero-960.webp 960w, /images/hero/aravista-hero-1280.webp 1280w, /images/hero/aravista-hero-1600.webp 1600w',
    src: '/images/hero/aravista-hero-1600.webp',
  },
  mobile: {
    avif: '/images/hero/aravista-hero-mobile-480.avif 480w, /images/hero/aravista-hero-mobile-674.avif 674w',
    webp: '/images/hero/aravista-hero-mobile-480.webp 480w, /images/hero/aravista-hero-mobile-674.webp 674w',
  },
  video: {
    mp4: '/videos/aravista-hero-loop-1280.mp4',
    webm: '/videos/aravista-hero-loop-1280.webm',
  },
};

export const FILM = {
  poster: '/videos/aravista-film-poster.webp',
  landscape: '/videos/aravista-film-720p.mp4',
  vertical: '/videos/aravista-film-vertical-720x1280.mp4',
  verticalPoster: '/videos/aravista-film-vertical-poster.webp',
};
