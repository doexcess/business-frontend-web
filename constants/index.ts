import {
  HiBell,
  HiBookOpen,
  HiChartPie,
  HiCollection,
  HiLogout,
  HiOutlineUpload,
  HiUpload,
  HiUsers,
  HiViewBoards,
} from 'react-icons/hi';
import {
  IoIosAdd,
  IoIosAnalytics,
  IoIosBriefcase,
  IoIosCog,
  IoIosFilm,
  IoIosPower,
  IoIosPricetag,
} from 'react-icons/io';

export enum groups {
  ONE = 1,
  TWO = 2,
}

export const sidebarLinks = [
  {
    icon: HiChartPie,
    route: '/',
    label: 'Dashboard',
    group: groups.ONE,
  },
  {
    icon: HiUsers,
    route: '/organizations/registered',
    label: 'Organizations',
    group: groups.ONE,
    items: [
      {
        route: '/organizations/registered',
        label: 'Registered',
      },
      {
        route: '/organizations/deleted',
        label: 'Deleted',
      },
    ],
  },
  {
    icon: HiUsers,
    route: '/subscription/plans',
    label: 'Subscription',
    group: groups.ONE,
    items: [
      {
        route: '/subscription/plans',
        label: 'Plans',
      },
      {
        route: '/subscription/subscribers',
        label: 'Subscribers',
      },
    ],
  },
  {
    icon: HiUsers,
    route: '/users',
    label: 'Users',
    group: groups.ONE,
  },
  {
    icon: IoIosBriefcase,
    route: '/products',
    label: 'Products',
    group: groups.ONE,
  },
  {
    icon: HiBookOpen,
    route: '/payments',
    label: 'Payments',
    group: groups.ONE,
  },
  {
    icon: IoIosPricetag,
    route: '/coupons',
    label: 'Coupons',
    group: groups.ONE,
  },
  {
    icon: HiCollection,
    route: '/cart',
    label: 'Cart',
    group: groups.ONE,
  },
  {
    icon: IoIosAnalytics,
    route: '/logs',
    label: 'Logs',
    group: groups.ONE,
  },
  // {
  // icon: HiViewBoards,
  // route: '/general',
  // label: 'General',
  // group: groups.ONE,
  // items: [
  // {
  // route: '/general/ratings',
  // label: 'Ratings',
  // },
  // {
  // route: '/general/suggestions',
  // label: 'Suggestions',
  // },
  // {
  // route: '/general/feedbacks',
  // label: 'Feedbacks',
  // },
  // ],
  // },
  {
    icon: HiBell,
    route: '/notifications/email',
    label: 'Notifications',
    group: groups.TWO,
    items: [
      {
        route: '/notifications/email',
        label: 'Email',
      },
    ],
  },
  {
    icon: IoIosFilm,
    route: '/media-library',
    label: 'Media Library',
    group: groups.TWO,
  },
  {
    icon: IoIosCog,
    route: '/settings',
    label: 'Settings',
    group: groups.TWO,
  },
  {
    icon: IoIosPower,
    route: '/logout',
    label: 'Logout',
    group: groups.TWO,
  },
];

export const dummyUsers = [
  {
    id: 1,
    firstname: 'Niel',
    lastname: 'Niel',
    username: 'Nielx',
    email: 'neil.sims@flowbite.com',
    phone: '+2348129027941',
    device: 'Android',
    country: 'United States',
    isActive: true,
    color: '#402000',
  },
  {
    id: 2,
    firstname: 'Roberta',
    lastname: 'Casas',
    username: 'Casa',
    email: 'roberta.casas@flowbite.com',
    phone: '+2349129027940',
    device: 'Android',
    country: 'Spain',
    isActive: false,
    color: '#125a0f',
  },
  {
    id: 3,
    firstname: 'Michael',
    lastname: 'Gough',
    username: 'Goug',
    email: 'michael.gough@flowbite.com',
    phone: '+2347089484822',
    device: 'iPhone',
    country: 'United Kingdom',
    isActive: true,
    color: '#0f2e5a',
  },
];

export const dummyUploads = [
  {
    id: 1,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test1.jpg',
  },
  {
    id: 2,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test2.jpg',
  },
  {
    id: 3,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test3.jpg',
  },
  {
    id: 4,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test4.jpg',
  },
  {
    id: 5,
    resourceType: 'image',
    format: 'png',
    folder: 'uploads/notification-svc',
    link: 'https://res.cloudinary.com/image/upload/test5.jpg',
  },
];

export const filterPeriods = [
  { slug: 'today', name: 'Today' },
  { slug: 'last_week', name: 'Last week' },
  { slug: 'last_month', name: 'Last month' },
  { slug: 'last_year', name: 'Last year' },
];

export const dummyProducts = [
  {
    id: '1a2b3c4d',
    name: 'Frontend Mastery',
    price: 15000,
    currency: 'NGN',
    organization: 'TechAcademy',
    type: 'Course',
    status: 'PUBLISHED',
  },
  {
    id: '2b3c4d5e',
    name: 'Backend Development Bootcamp',
    price: 25000,
    currency: 'NGN',
    organization: 'CodeHub',
    type: 'Course',
    status: 'DRAFT',
  },
  {
    id: '3c4d5e6f',
    name: 'Digital Marketing Summit',
    price: 10000,
    currency: 'NGN',
    organization: 'MarketPros',
    type: 'Ticket',
    status: 'ARCHIVED',
  },
  {
    id: '4d5e6f7g',
    name: 'Product Design Masterclass',
    price: 18000,
    currency: 'NGN',
    organization: 'DesignPro',
    type: 'Course',
    status: 'PUBLISHED',
  },
  {
    id: '5e6f7g8h',
    name: 'Tech Conference 2025',
    price: 12000,
    currency: 'NGN',
    organization: 'InnovateTech',
    type: 'Ticket',
    status: 'DRAFT',
  },
  {
    id: '6f7g8h9i',
    name: 'Blockchain & Web3 Workshop',
    price: 20000,
    currency: 'NGN',
    organization: 'CryptoLearn',
    type: 'Course',
    status: 'ARCHIVED',
  },
  {
    id: '7g8h9i0j',
    name: 'AI & Machine Learning Summit',
    price: 15000,
    currency: 'NGN',
    organization: 'DataGenius',
    type: 'Ticket',
    status: 'PUBLISHED',
  },
  {
    id: '8h9i0j1k',
    name: 'Cybersecurity Training',
    price: 22000,
    currency: 'NGN',
    organization: 'SecureNet',
    type: 'Course',
    status: 'DRAFT',
  },
];
