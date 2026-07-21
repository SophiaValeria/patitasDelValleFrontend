/**
 * @file data/mockData.ts
 * @description Conjunto de datos ficticios para demostración y ejecuciones estáticas.
 * Incluye:
 *  - 3 Usuarios completos con credenciales e información de contacto en Chile.
 *  - 22 Reportes detallados de mascotas (Perdidas, Encontradas, En adopción).
 *  - Helper de persistencia en localStorage para crear reportes o autenticarse en modo demo.
 */

import { ReportType, ReportStatus, UserRole } from '@/types';

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  rut: string;
  phone: string;
  address: string;
  region: string;
  commune: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MockReportItem {
  _id: string;
  type: ReportType;
  status: ReportStatus;
  animalInfo: {
    name: string;
    species: string;
    breed: string;
    color: string;
    sex: string;
    size: string;
    distinctFeatures: string;
  };
  location: {
    region: string;
    comuna: string;
    address: string;
  };
  contact: {
    phone: string;
  };
  author: MockUser | string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 1. Usuarios Ficticios (3 usuarios)
// ---------------------------------------------------------------------------

export const INITIAL_MOCK_USERS: MockUser[] = [
  {
    _id: 'usr-camila-001',
    name: 'Camila Morales',
    email: 'camila.morales@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    rut: '18.452.931-4',
    phone: '+56991234567',
    address: 'Av. Eliodoro Yáñez 1234',
    region: 'Región Metropolitana de Santiago',
    commune: 'Providencia',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    createdAt: '2026-06-01T10:00:00.000Z',
    updatedAt: '2026-06-01T10:00:00.000Z',
  },
  {
    _id: 'usr-carlos-002',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    rut: '17.892.415-K',
    phone: '+56987654321',
    address: 'Calle Agustinas 850',
    region: 'Región Metropolitana de Santiago',
    commune: 'Santiago',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    createdAt: '2026-06-05T14:30:00.000Z',
    updatedAt: '2026-06-05T14:30:00.000Z',
  },
  {
    _id: 'usr-valentina-003',
    name: 'Valentina Rojas',
    email: 'valentina.rojas@example.com',
    password: 'Password123!',
    role: UserRole.USER,
    rut: '19.123.456-7',
    phone: '+56976543210',
    address: 'Av. Apoquindo 4500',
    region: 'Región Metropolitana de Santiago',
    commune: 'Las Condes',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    createdAt: '2026-06-10T09:15:00.000Z',
    updatedAt: '2026-06-10T09:15:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// 2. Reportes Ficticios (22 reportes variados)
// ---------------------------------------------------------------------------

export const INITIAL_MOCK_REPORTS: MockReportItem[] = [
  {
    _id: 'rep-001',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Thor',
      species: 'Perro',
      breed: 'Golden Retriever',
      color: 'Dorado / Rubio',
      sex: 'Macho',
      size: 'Grande',
      distinctFeatures: 'Tiene un collar rojo con placa y una pequeña cicatriz en la pata delantera izquierda.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      address: 'Plaza Las Lilas, cerca de Av. Eliodoro Yáñez',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
    ],
    createdAt: '2026-07-20T18:00:00.000Z',
    updatedAt: '2026-07-20T18:00:00.000Z',
  },
  {
    _id: 'rep-002',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Gatita Naranja',
      species: 'Gato',
      breed: 'Mestizo',
      color: 'Naranja con blanco (Atigrado)',
      sex: 'Hembra',
      size: 'Pequeño',
      distinctFeatures: 'Muy amigable, tiene un collar azul sin placa de identificación. Encontrada maullando cerca de un parque.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      address: 'Parque Forestal, altura puente Pío Nono',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
    ],
    createdAt: '2026-07-19T14:20:00.000Z',
    updatedAt: '2026-07-19T14:20:00.000Z',
  },
  {
    _id: 'rep-003',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Luna',
      species: 'Perro',
      breed: 'Mestizo',
      color: 'Negro con pecho blanco',
      sex: 'Hembra',
      size: 'Mediano',
      distinctFeatures: 'Perrita rescatada de 8 meses, desparasitada, vacunada y esterilizada. Busca hogar amoroso.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Las Condes',
      address: 'Sector Rotonda Atenas',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
    ],
    createdAt: '2026-07-18T09:00:00.000Z',
    updatedAt: '2026-07-18T09:00:00.000Z',
  },
  {
    _id: 'rep-004',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Mishi',
      species: 'Gato',
      breed: 'Siamés',
      color: 'Crema con puntas marrón oscuro',
      sex: 'Macho',
      size: 'Pequeño',
      distinctFeatures: 'Ojos azules intensos. Se asusta fácilmente con ruidos fuertes.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Maipú',
      address: 'Cerca de Estación del Metro Plaza de Maipú',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80',
    ],
    createdAt: '2026-07-17T16:45:00.000Z',
    updatedAt: '2026-07-17T16:45:00.000Z',
  },
  {
    _id: 'rep-005',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Paco',
      species: 'Ave',
      breed: 'Ninfa (Calopsita)',
      color: 'Gris con mejillas naranjas',
      sex: 'Macho',
      size: 'Pequeño',
      distinctFeatures: 'Sabe silbar melodías cortas. Acostumbrado a compartir en familia.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Ñuñoa',
      address: 'Sector Plaza Ñuñoa',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=800&q=80',
    ],
    createdAt: '2026-07-16T11:10:00.000Z',
    updatedAt: '2026-07-16T11:10:00.000Z',
  },
  {
    _id: 'rep-006',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Poodle Encontrada',
      species: 'Perro',
      breed: 'Poodle Toy',
      color: 'Blanco radiante',
      sex: 'Hembra',
      size: 'Pequeño',
      distinctFeatures: 'Encontrada limpia y con corte reciente. Portaba un arnés rosado.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      address: 'Av. Andrés Bello esquina Pedro de Valdivia',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
    ],
    createdAt: '2026-07-15T19:30:00.000Z',
    updatedAt: '2026-07-15T19:30:00.000Z',
  },
  {
    _id: 'rep-007',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Rocky',
      species: 'Perro',
      breed: 'Pastor Alemán',
      color: 'Negro con dorado',
      sex: 'Macho',
      size: 'Grande',
      distinctFeatures: 'Macho de 3 años, responde a su nombre. Llevaba collar de cuero marrón.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      address: 'Sector Barrio Italia / Bustamante',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&q=80',
    ],
    createdAt: '2026-07-14T08:15:00.000Z',
    updatedAt: '2026-07-14T08:15:00.000Z',
  },
  {
    _id: 'rep-008',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Oliver',
      species: 'Gato',
      breed: 'Mestizo de pelo corto',
      color: 'Gris atigrado (Tabby)',
      sex: 'Macho',
      size: 'Pequeño',
      distinctFeatures: 'Gatito de 4 meses super cariñoso y ronroneador. Vacunación al día.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'La Florida',
      address: 'Cerca de paradero 14 de Vicuña Mackenna',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
    ],
    createdAt: '2026-07-13T12:00:00.000Z',
    updatedAt: '2026-07-13T12:00:00.000Z',
  },
  {
    _id: 'rep-009',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Simba',
      species: 'Gato',
      breed: 'Mestizo',
      color: 'Naranja con machas blancas',
      sex: 'Macho',
      size: 'Mediano',
      distinctFeatures: 'Tiene una pequeña cortadura en la oreja derecha. Sin collar.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Peñalolén',
      address: 'Sector Los Presidentes / Consistorial',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800&q=80',
    ],
    createdAt: '2026-07-12T15:20:00.000Z',
    updatedAt: '2026-07-12T15:20:00.000Z',
  },
  {
    _id: 'rep-010',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Labrador mestizo',
      species: 'Perro',
      breed: 'Labrador / Mestizo',
      color: 'Chocolate',
      sex: 'Macho',
      size: 'Grande',
      distinctFeatures: 'Porta collar verde sin datos. Muy manso y responde bien a las personas.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Vitacura',
      address: 'Parque Bicentenario, sector de la laguna',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
    ],
    createdAt: '2026-07-11T17:40:00.000Z',
    updatedAt: '2026-07-11T17:40:00.000Z',
  },
  {
    _id: 'rep-011',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Copito',
      species: 'Conejo',
      breed: 'Enano Holandés',
      color: 'Blanco nieve con ojos negros',
      sex: 'Macho',
      size: 'Pequeño',
      distinctFeatures: 'Conejo doméstico rescatado. Educado para usar su esquinero.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Ñuñoa',
      address: 'Sector Parque Inés de Suárez',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
    ],
    createdAt: '2026-07-10T10:30:00.000Z',
    updatedAt: '2026-07-10T10:30:00.000Z',
  },
  {
    _id: 'rep-012',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Bella',
      species: 'Perro',
      breed: 'Beagle',
      color: 'Tricolor (Blanco, negro y marrón)',
      sex: 'Hembra',
      size: 'Mediano',
      distinctFeatures: 'Lleva collar lila con cascabel. Muy sociable pero asustadiza.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Quilicura',
      address: 'Cerca de Valle Lo Campino',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=80',
    ],
    createdAt: '2026-07-09T14:00:00.000Z',
    updatedAt: '2026-07-09T14:00:00.000Z',
  },
  {
    _id: 'rep-013',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Gata Persa Encontrada',
      species: 'Gato',
      breed: 'Persa',
      color: 'Gris ceniza',
      sex: 'Hembra',
      size: 'Mediano',
      distinctFeatures: 'Pelo largo y despeinado. Rescatada en la entrada de un edificio.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      address: 'Barrio Lastarria',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80',
    ],
    createdAt: '2026-07-08T18:10:00.000Z',
    updatedAt: '2026-07-08T18:10:00.000Z',
  },
  {
    _id: 'rep-014',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Toby y Jack',
      species: 'Perro',
      breed: 'Mestizos Hermanos',
      color: 'Negro y Caramelo',
      sex: 'Macho',
      size: 'Mediano',
      distinctFeatures: 'Hermanitos de 6 meses que se dan en adopción conjunta o individual.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'San Miguel',
      address: 'Cerca de Metro El Llano',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
    ],
    createdAt: '2026-07-07T11:45:00.000Z',
    updatedAt: '2026-07-07T11:45:00.000Z',
  },
  {
    _id: 'rep-015',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Nala',
      species: 'Gato',
      breed: 'Mestizo',
      color: 'Negro azabache',
      sex: 'Hembra',
      size: 'Pequeño',
      distinctFeatures: 'Ojos verdes brillantes. Tiene un cascabel rojo en su collar.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      address: 'Av. Holanda cerca de Providencia',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
    ],
    createdAt: '2026-07-06T09:30:00.000Z',
    updatedAt: '2026-07-06T09:30:00.000Z',
  },
  {
    _id: 'rep-016',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Cocker Encontrado',
      species: 'Perro',
      breed: 'Cocker Spaniel',
      color: 'Marrón dorado',
      sex: 'Macho',
      size: 'Mediano',
      distinctFeatures: 'Encontrado mojado bajo la lluvia. Muy cariñoso.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Las Condes',
      address: 'Av. Manquehue Norte altura 1000',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&q=80',
    ],
    createdAt: '2026-07-05T16:00:00.000Z',
    updatedAt: '2026-07-05T16:00:00.000Z',
  },
  {
    _id: 'rep-017',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Sasha',
      species: 'Perro',
      breed: 'Husky / Mestizo',
      color: 'Gris y Blanco con un ojo azul',
      sex: 'Hembra',
      size: 'Grande',
      distinctFeatures: 'Joven de 1 año, muy enérgica. Requiere espacio o paseos frecuentes.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Santiago',
      address: 'Sector Barrio Yungay',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
    ],
    createdAt: '2026-07-04T13:20:00.000Z',
    updatedAt: '2026-07-04T13:20:00.000Z',
  },
  {
    _id: 'rep-018',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Kiwi',
      species: 'Ave',
      breed: 'Agapornis (Inseparable)',
      color: 'Verde brillante con cabeza naranja',
      sex: 'Hembra',
      size: 'Pequeño',
      distinctFeatures: 'Se escapó por ventana abierta. Emite un pío agudo característico.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Ñuñoa',
      address: 'Av. Irarrázaval con Bustamante',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
    ],
    createdAt: '2026-07-03T10:15:00.000Z',
    updatedAt: '2026-07-03T10:15:00.000Z',
  },
  {
    _id: 'rep-019',
    type: ReportType.LOST,
    status: ReportStatus.RESOLVED,
    animalInfo: {
      name: 'Milo',
      species: 'Perro',
      breed: 'Mestizo',
      color: 'Marrón claro',
      sex: 'Macho',
      size: 'Mediano',
      distinctFeatures: '¡Reencontrado con sus dueños gracias a la comunidad!',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      address: 'Av. Italia',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    ],
    createdAt: '2026-07-02T08:00:00.000Z',
    updatedAt: '2026-07-02T19:00:00.000Z',
  },
  {
    _id: 'rep-020',
    type: ReportType.LOST,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Kira',
      species: 'Perro',
      breed: 'Dachshund (Teckel / Salchicha)',
      color: 'Café morado / fuego',
      sex: 'Hembra',
      size: 'Pequeño',
      distinctFeatures: 'Responde alegremente cuando la llaman por su nombre.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Las Condes',
      address: 'Parque Araucano, sector juegos',
    },
    contact: {
      phone: '+56976543210',
    },
    author: INITIAL_MOCK_USERS[2],
    images: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&q=80',
    ],
    createdAt: '2026-07-01T14:10:00.000Z',
    updatedAt: '2026-07-01T14:10:00.000Z',
  },
  {
    _id: 'rep-021',
    type: ReportType.FOUND,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Gatito Blanco Encontrado',
      species: 'Gato',
      breed: 'Angora / Mestizo',
      color: 'Blanco con ojos heterocromáticos (Azul y amarillo)',
      sex: 'Macho',
      size: 'Pequeño',
      distinctFeatures: 'Se resguardó en un jardín. Se nota bien cuidado.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      address: 'Calle Suecia cerca de Bilbao',
    },
    contact: {
      phone: '+56991234567',
    },
    author: INITIAL_MOCK_USERS[0],
    images: [
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800&q=80',
    ],
    createdAt: '2026-06-30T17:30:00.000Z',
    updatedAt: '2026-06-30T17:30:00.000Z',
  },
  {
    _id: 'rep-022',
    type: ReportType.ADOPTION,
    status: ReportStatus.ACTIVE,
    animalInfo: {
      name: 'Pelusa',
      species: 'Gato',
      breed: 'Mestizo de pelo largo',
      color: 'Calicó (Blanco, negro y naranja)',
      sex: 'Hembra',
      size: 'Mediano',
      distinctFeatures: 'Rescatada de la calle, castrada y con microchip registrado.',
    },
    location: {
      region: 'Región Metropolitana de Santiago',
      comuna: 'Maipú',
      address: 'Sector Ciudad Satélite',
    },
    contact: {
      phone: '+56987654321',
    },
    author: INITIAL_MOCK_USERS[1],
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80',
    ],
    createdAt: '2026-06-29T12:00:00.000Z',
    updatedAt: '2026-06-29T12:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// 3. Helpers de Almacenamiento Local (Local Persistence Manager)
// ---------------------------------------------------------------------------

const LOCAL_STORAGE_REPORTS_KEY = 'patitas_mock_reports';
const LOCAL_STORAGE_USERS_KEY = 'patitas_mock_users';

/** Obtiene la lista de usuarios (incluyendo agregados dinámicamente) */
export const getStoredMockUsers = (): MockUser[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      return INITIAL_MOCK_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

/** Obtiene la lista de reportes (incluyendo agregados dinámicamente) */
export const getStoredMockReports = (): MockReportItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(INITIAL_MOCK_REPORTS));
      return INITIAL_MOCK_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_REPORTS;
  }
};

/** Guarda un nuevo reporte ficticio en localStorage */
export const saveMockReport = (newReport: any, authorUser?: MockUser | null): MockReportItem => {
  const reports = getStoredMockReports();
  const author = authorUser || INITIAL_MOCK_USERS[0];
  const created: MockReportItem = {
    _id: `rep-${Date.now()}`,
    type: newReport.type || ReportType.LOST,
    status: newReport.status || ReportStatus.ACTIVE,
    animalInfo: {
      name: newReport.animalInfo?.name || newReport.petName || 'Sin nombre',
      species: newReport.animalInfo?.species || newReport.species || 'Perro',
      breed: newReport.animalInfo?.breed || newReport.breed || 'Mestizo',
      color: newReport.animalInfo?.color || newReport.color || 'Sin especificar',
      sex: newReport.animalInfo?.sex || newReport.sex || 'Desconocido',
      size: newReport.animalInfo?.size || newReport.size || 'Mediano',
      distinctFeatures: newReport.animalInfo?.distinctFeatures || newReport.distinctFeatures || '',
    },
    location: {
      region: newReport.location?.region || newReport.region || 'Región Metropolitana de Santiago',
      comuna: newReport.location?.comuna || newReport.comuna || 'Santiago',
      address: newReport.location?.address || newReport.address || 'Chile',
    },
    contact: {
      phone: newReport.contact?.phone || newReport.phone || author.phone || '+56900000000',
    },
    author: author,
    images: Array.isArray(newReport.images) && newReport.images.length > 0
      ? newReport.images
      : ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [created, ...reports];
  localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(updatedList));
  return created;
};

/** Guarda un nuevo usuario ficticio en localStorage */
export const saveMockUser = (user: Partial<MockUser>): MockUser => {
  const users = getStoredMockUsers();
  const newUser: MockUser = {
    _id: `usr-${Date.now()}`,
    name: user.name || 'Nuevo Usuario',
    email: user.email || `user${Date.now()}@example.com`,
    password: user.password || 'Password123!',
    role: UserRole.USER,
    rut: user.rut || '12.345.678-9',
    phone: user.phone || '+56900000000',
    address: user.address || 'Chile',
    region: user.region || 'Región Metropolitana de Santiago',
    commune: user.commune || 'Santiago',
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [...users, newUser];
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(updatedList));
  return newUser;
};
