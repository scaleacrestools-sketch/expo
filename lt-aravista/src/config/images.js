/*
 * All project imagery is taken from the official L&T Realty Aravista brochure
 * (Sector 86 Gurugram OpDeck). The master plan is the higher-resolution
 * version of the same drawing. Renders are artistic impressions.
 */
import ProjectLogo from '../assets/images/lt-realty-logo.webp';
import OutdoorPool from '../assets/images/aravista-outdoor-pool.webp';
import CentralClub from '../assets/images/aravista-central-club.webp';
import ClubLobby from '../assets/images/aravista-club-lobby.webp';
import IndoorPool from '../assets/images/aravista-indoor-pool.webp';
import LivingRoom from '../assets/images/aravista-living-room.webp';
import CentralLandscape from '../assets/images/aravista-central-landscape.webp';
import WellnessGarden from '../assets/images/aravista-wellness-garden.webp';
import ArenaSports from '../assets/images/aravista-arena-sports.webp';
import MasterPlan from '../assets/images/aravista-master-plan.webp';
import LocationMap from '../assets/images/aravista-location-map.webp';
import PlanMajesta from '../assets/images/plan-3bhk-majesta.webp';
import PlanRegalia from '../assets/images/plan-3bhk-regalia.webp';
import PlanRoyale from '../assets/images/plan-4bhk-royale.webp';
import PlanLuxuria from '../assets/images/plan-4bhk-luxuria.webp';
import PlanTower1 from '../assets/images/plan-tower1-typical.webp';
import PlanTower2 from '../assets/images/plan-tower2-typical.webp';
import PlanTower3 from '../assets/images/plan-tower3-typical.webp';
import SpecMarble from '../assets/images/spec-marble-flooring.webp';
import SpecKitchen from '../assets/images/spec-modular-kitchen.webp';
import SpecSanitary from '../assets/images/spec-sanitaryware.webp';
import SpecLobby from '../assets/images/spec-entrance-lobby.webp';
import SpecPower from '../assets/images/spec-power-backup.webp';
import SpecSecurity from '../assets/images/spec-security.webp';

export const IMAGES = {
  ProjectLogo,
  OutdoorPool,
  CentralClub,
  ClubLobby,
  IndoorPool,
  LivingRoom,
  CentralLandscape,
  WellnessGarden,
  ArenaSports,
  MasterPlan,
  LocationMap,
  Plans: {
    Majesta: PlanMajesta,
    Regalia: PlanRegalia,
    Royale: PlanRoyale,
    Luxuria: PlanLuxuria,
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

/** Hero banner slides, best exterior render first. */
export const HERO_SLIDES = [
  { src: OutdoorPool, alt: 'L&T Realty Aravista outdoor swimming pool and clubhouse at Sector 86, Gurugram' },
  { src: CentralClub, alt: 'The Central Social Club exterior at L&T Realty Aravista' },
  { src: CentralLandscape, alt: 'Central landscape with discovery garden and water features at L&T Realty Aravista' },
  { src: WellnessGarden, alt: 'Wellness garden walkway at L&T Realty Aravista' },
  { src: LivingRoom, alt: 'Luxury living room with sundeck at L&T Realty Aravista' },
];
