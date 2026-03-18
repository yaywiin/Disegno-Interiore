import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Sofá Onyx',
    category: 'Sala',
    img: '/product_living.png',
    gallery: ['/product_living.png', '/product_bedroom.png', '/product_office.png'],
    badge: 'Nuevo',
    desc: 'Tapizado en lino italiano, estructura de madera de nogal. Su diseño minimalista y grandes proporciones ofrecen un confort inigualable, ideal para espacios que respiran lujo silencioso.',
    materials: ['Nogal', 'Lino'],
    sizes: ['2 Plazas', '3 Plazas', 'Seccional'],
    colors: [
      { name: 'Gris Claro', hex: '#d3d3d3' },
      { name: 'Beige', hex: '#f5f5dc' },
      { name: 'Carbón', hex: '#36454f' }
    ],
    price: 85000
  },
  {
    id: 2,
    name: 'Comedor Nogal',
    category: 'Comedor',
    img: '/product_dining.png',
    gallery: ['/product_dining.png', '/about_workshop.png', '/product_office.png'],
    badge: null,
    desc: 'Mesa para 8 personas en madera maciza de nogal, patas metálicas. Cada veta cuenta una historia, convirtiendo cada cena en un ritual de diseño y sofisticación.',
    materials: ['Nogal', 'Acero'],
    sizes: ['6 Personas', '8 Personas', '10 Personas'],
    colors: [
      { name: 'Nogal Natural', hex: '#4B3621' },
      { name: 'Nogal Oscuro', hex: '#3b2f2f' }
    ],
    price: 120000
  },
  {
    id: 3,
    name: 'Suite Serena',
    category: 'Recámara',
    img: '/product_bedroom.png',
    gallery: ['/product_bedroom.png', '/hero_furniture.png', '/product_living.png'],
    badge: 'Exclusivo',
    desc: 'Cama king con cabecero tapizado en cuero natural. El reposo elevado al mayor nivel de confort, donde el cuero y la madera se encuentran en perfecta armonía.',
    materials: ['Cuero', 'Fresno'],
    sizes: ['Matrimonial', 'Queen Size', 'King Size'],
    colors: [
      { name: 'Tabaco', hex: '#704214' },
      { name: 'Negro', hex: '#000000' }
    ],
    price: 95000
  },
  {
    id: 4,
    name: 'Escritorio Axis',
    category: 'Oficina',
    img: '/product_office.png',
    gallery: ['/product_office.png', '/about_workshop.png', '/hero_furniture.png'],
    badge: null,
    desc: 'Diseño minimalista con cajones laterales y superficie tratada. Un espacio de trabajo concebido para la claridad mental y la máxima elegancia.',
    materials: ['Roble', 'Mármol'],
    sizes: ['120cm', '150cm', '180cm'],
    colors: [
      { name: 'Roble Claro', hex: '#c19a6b' },
      { name: 'Mármol Blanco', hex: '#f9f9f9' },
      { name: 'Negro Mate', hex: '#222222' }
    ],
    price: 68000
  },
  {
    id: 5,
    name: 'Sillón Amber',
    category: 'Sala',
    img: '/product_living.png',
    gallery: ['/product_living.png', '/product_dining.png', '/product_bedroom.png'],
    badge: null,
    desc: 'Sillón lounge de lectura, tapizado en terciopelo tostado. La pieza statement que todo rincón especial necesita, cobijando tus momentos de paz.',
    materials: ['Haya', 'Terciopelo'],
    sizes: ['Estandar'],
    colors: [
      { name: 'Terracota', hex: '#e2725b' },
      { name: 'Verde Olivo', hex: '#556b2f' },
      { name: 'Mostaza', hex: '#ffdb58' }
    ],
    price: 42000
  },
  {
    id: 6,
    name: 'Aparador Lumen',
    category: 'Comedor',
    img: '/product_dining.png',
    gallery: ['/product_dining.png', '/product_living.png', '/hero_furniture.png'],
    badge: 'Bestseller',
    desc: 'Aparador con puertas de ratán y pies metálicos dorados. Funcionalidad y arte convergen, ofreciendo un guardado sutil y un frente texturizado.',
    materials: ['Ratán', 'Latón'],
    sizes: ['140cm', '180cm'],
    colors: [
      { name: 'Ratán Natural', hex: '#d4bc8b' },
      { name: 'Negro Ceniza', hex: '#36454f' }
    ],
    price: 54000
  },
  {
    id: 7,
    name: 'Velador Lunar',
    category: 'Recámara',
    img: '/product_bedroom.png',
    gallery: ['/product_bedroom.png', '/product_office.png', '/about_workshop.png'],
    badge: null,
    desc: 'Mesa de noche en mármol travertino con base de bronce. Pequeños detalles que elevan tu santuario de descanso noche tras noche.',
    materials: ['Mármol', 'Bronce'],
    sizes: ['Único'],
    colors: [
      { name: 'Travertino Navona', hex: '#e5d3b3' },
      { name: 'Bronce Envejecido', hex: '#b08d57' }
    ],
    price: 28000
  },
  {
    id: 8,
    name: 'Silla Director',
    category: 'Oficina',
    img: '/product_office.png',
    gallery: ['/product_office.png', '/product_dining.png', '/product_living.png'],
    badge: null,
    desc: 'Silla de piel genuina con base de madera oscura. La autoridad y el confort, tallados en un perfil moderno y atemporal.',
    materials: ['Piel', 'Wengué'],
    sizes: ['Ejecutiva', 'Directiva'],
    colors: [
      { name: 'Cognac', hex: '#9a463d' },
      { name: 'Negro', hex: '#000000' }
    ],
    price: 35000
  }
])

export function useProducts() {
  const getProductById = (id) => {
    return products.value.find(p => p.id === parseInt(id))
  }

  return {
    products,
    getProductById
  }
}
