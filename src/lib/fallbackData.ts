export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

export interface Cake {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: string;
  flavor: string;
  image_url: string;
  featured: boolean;
  available: boolean;
  category_id: string | null;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  approved: boolean;
  created_at?: string;
}

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Birthday Cakes",
    slug: "birthday-cakes",
    image_url: "/cake_images/birthday-category.jpg",
  },
  {
    id: "cat-2",
    name: "Anniversary Cakes",
    slug: "anniversary-cakes",
    image_url: "/cake_images/anniversary-category.jpg",
  },
  {
    id: "cat-3",
    name: "Wedding Cakes",
    slug: "wedding-cakes",
    image_url: "/cake_images/wedding-category.jpg",
  },
  {
    id: "cat-4",
    name: "Kids Theme Cakes",
    slug: "kids-theme-cakes",
    image_url: "/cake_images/kids-category.jpg",
  },
  {
    id: "cat-5",
    name: "Photo Cakes",
    slug: "photo-cakes",
    image_url: "/cake_images/photo-category.jpg",
  },
  {
    id: "cat-6",
    name: "Cupcakes",
    slug: "cupcakes",
    image_url: "/cake_images/cupcakes-category.jpg",
  },
  {
    id: "cat-7",
    name: "Custom Cakes",
    slug: "custom-cakes",
    image_url: "/cake_images/custom-category.jpg",
  },
];

export const FALLBACK_CAKES: Cake[] = [
  {
    id: "cake-1",
    name: "Royal Chocolate Truffle",
    slug: "royal-chocolate-truffle",
    description: "Indulge in layers of rich Belgian chocolate ganache and soft chocolate sponge, finished with chocolate curls.",
    price: 1299,
    weight: "1 kg",
    flavor: "Chocolate Truffle",
    image_url: "/cake_images/royal-chocolate-truffle.jpg",
    featured: true,
    available: true,
    category_id: "cat-1",
  },
  {
    id: "cake-2",
    name: "Red Velvet Bliss",
    slug: "red-velvet-bliss",
    description: "Classic red velvet cake layers with a light, fluffy cream cheese frosting, decorated with velvet crumbs and white chocolate hearts.",
    price: 1499,
    weight: "1 kg",
    flavor: "Red Velvet Cream Cheese",
    image_url: "/cake_images/red-velvet-bliss.jpg",
    featured: true,
    available: true,
    category_id: "cat-2",
  },
  {
    id: "cake-3",
    name: "Pastel Flower Vanilla Cake",
    slug: "pastel-flower-vanilla-cake",
    description: "Elegant vanilla cake featuring handcrafted buttercream flowers, delicate pastel designs, and gourmet vanilla bean sponge.",
    price: 1199,
    weight: "1 kg",
    flavor: "Vanilla Bean",
    image_url: "/cake_images/pastel-flower-vanilla.jpg",
    featured: true,
    available: true,
    category_id: "cat-1",
  },
  {
    id: "cake-4",
    name: "Gourmet Strawberry Delight",
    slug: "gourmet-strawberry-delight",
    description: "Fresh strawberry compote layered between light vanilla sponges and topped with fresh strawberry slices and white chocolate shavings.",
    price: 1099,
    weight: "1 kg",
    flavor: "Strawberry Cream",
    image_url: "/cake_images/gourmet-strawberry-delight.jpg",
    featured: false,
    available: true,
    category_id: "cat-1",
  },
  {
    id: "cake-5",
    name: "Salted Caramel Butterscotch",
    slug: "salted-caramel-butterscotch",
    description: "Soft butterscotch sponge layered with homemade salted caramel sauce, whipped cream, and crunchy praline nuts.",
    price: 999,
    weight: "1 kg",
    flavor: "Butterscotch Caramel",
    image_url: "/cake_images/salted-caramel-butterscotch.jpg",
    featured: true,
    available: true,
    category_id: "cat-1",
  },
  {
    id: "cake-6",
    name: "Pastel Dream Cupcakes (Pack of 6)",
    slug: "pastel-dream-cupcakes",
    description: "Assorted vanilla and chocolate cupcakes decorated with premium pink and lavender buttercream frosting and edible pearls.",
    price: 599,
    weight: "0.5 kg",
    flavor: "Assorted (Vanilla & Chocolate)",
    image_url: "/cake_images/pastel-dream-cupcakes.jpg",
    featured: true,
    available: true,
    category_id: "cat-6",
  },
];

export const FALLBACK_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    image_url: "/cake_images/gallery-1.jpg",
    caption: "Elegant Wedding Cake with Pink Buttercream Flowers",
  },
  {
    id: "gal-2",
    image_url: "/cake_images/gallery-2.jpg",
    caption: "Delicious Pastel Frosting Cupcakes for Celebrations",
  },
  {
    id: "gal-3",
    image_url: "/cake_images/gallery-3.jpg",
    caption: "Royal Chocolate Truffle Birthday Special",
  },
  {
    id: "gal-4",
    image_url: "/cake_images/gallery-4.jpg",
    caption: "Assorted Mini Party Cupcakes",
  },
];

export const FALLBACK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customer_name: "Sneha Sharma",
    rating: 5,
    review: "The Royal Chocolate Truffle cake was absolutely delicious and looked stunning! Nobody could tell it was 100% eggless. Highly recommended!",
    approved: true,
  },
  {
    id: "rev-2",
    customer_name: "Amit Patel",
    rating: 5,
    review: "Aksha Cakes baked the perfect custom theme cake for my daughter's birthday. The design was clean and the taste was incredible. Thank you!",
    approved: true,
  },
  {
    id: "rev-3",
    customer_name: "Priya Rao",
    rating: 5,
    review: "Ordered the Pastel Dream Cupcakes for a baby shower. They were super soft, moist, and the decoration was extremely premium.",
    approved: true,
  },
];
