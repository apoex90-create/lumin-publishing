// List of publisher imprints the platform has agreements with
// Edit this list to add/remove publishers

export interface Publisher {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export const PUBLISHERS: Publisher[] = [
  {
    id: 'indu-book-services',
    name: 'INDU BOOK SERVICES PVT LTD',
    description: 'Established Indian publisher',
    isActive: true,
  },
  {
    id: 'varety-books',
    name: 'VARETY BOOKS PUBLISHERS DISTRIBUTORS',
    description: 'Multi-genre publishing house',
    isActive: true,
  },
  {
    id: 'corvette-press',
    name: 'CORVETTE PRESS',
    description: 'Premium literary imprint',
    isActive: true,
  },
  {
    id: 'lotus-books',
    name: 'LOTUS BOOKS',
    description: 'Spiritual and self-help focused',
    isActive: true,
  },
  {
    id: 'freeman-press',
    name: 'FREEMAN PRESS',
    description: 'Academic and non-fiction',
    isActive: true,
  },
];

export function getActivePublishers() {
  return PUBLISHERS.filter(p => p.isActive);
}

export function findPublisherByName(name: string) {
  return PUBLISHERS.find(p => p.name === name);
}
