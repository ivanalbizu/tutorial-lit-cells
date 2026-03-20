export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Teclado mecánico RGB',
    price: 89.99,
    description: 'Switches Cherry MX Blue, retroiluminado RGB con 16.8M colores. Construcción en aluminio con reposamuñecas magnético.',
    category: 'Periféricos',
    image: 'https://picsum.photos/seed/keyboard/400/300',
  },
  {
    id: '2',
    name: 'Monitor 4K UltraWide',
    price: 549.99,
    description: 'Panel IPS 34", 3440x1440, 144Hz, HDR600. Ideal para productividad y gaming.',
    category: 'Pantallas',
    image: 'https://picsum.photos/seed/monitor/400/300',
  },
  {
    id: '3',
    name: 'Ratón ergonómico Pro',
    price: 69.99,
    description: 'Sensor óptico 25600 DPI, 8 botones programables, batería 70h. Diseño vertical para reducir fatiga.',
    category: 'Periféricos',
    image: 'https://picsum.photos/seed/mouse/400/300',
  },
  {
    id: '4',
    name: 'Auriculares inalámbricos',
    price: 129.99,
    description: 'Cancelación de ruido activa, 30h de batería, micrófono con IA. Sonido Hi-Res certificado.',
    category: 'Audio',
    image: 'https://picsum.photos/seed/headphones/400/300',
  },
  {
    id: '5',
    name: 'Webcam 4K HDR',
    price: 179.99,
    description: 'Sensor Sony STARVIS, autoenfoque, corrección de luz baja. Campo de visión 90°.',
    category: 'Periféricos',
    image: 'https://picsum.photos/seed/webcam/400/300',
  },
  {
    id: '6',
    name: 'Hub USB-C 12-en-1',
    price: 59.99,
    description: 'HDMI 4K@60Hz, Ethernet Gigabit, 3x USB-A, 2x USB-C (100W PD), lector SD/microSD.',
    category: 'Accesorios',
    image: 'https://picsum.photos/seed/usbhub/400/300',
  },
  {
    id: '7',
    name: 'SSD NVMe 2TB',
    price: 149.99,
    description: 'Velocidad lectura 7000 MB/s, escritura 6000 MB/s. PCIe Gen4, con disipador incluido.',
    category: 'Almacenamiento',
    image: 'https://picsum.photos/seed/ssd/400/300',
  },
  {
    id: '8',
    name: 'Soporte monitor ajustable',
    price: 44.99,
    description: 'Brazo articulado con gestión de cables. Soporta 2-9 kg, VESA 75/100. Giro 360°.',
    category: 'Accesorios',
    image: 'https://picsum.photos/seed/stand/400/300',
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
