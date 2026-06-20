-- Aksha Cakes Supabase Seed Data SQL Script
-- Run this script in the Supabase SQL Editor to populate the database tables with default categories, cakes, reviews, gallery photos, and enquiries.

-- 1. INSERT CATEGORIES (7 items)
INSERT INTO public.categories (id, name, slug, image_url) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Birthday Cakes', 'birthday-cakes', '/cake_images/birthday-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Anniversary Cakes', 'anniversary-cakes', '/cake_images/anniversary-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Wedding Cakes', 'wedding-cakes', '/cake_images/wedding-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Kids Theme Cakes', 'kids-theme-cakes', '/cake_images/kids-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Photo Cakes', 'photo-cakes', '/cake_images/photo-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Cupcakes', 'cupcakes', '/cake_images/cupcakes-category.jpg'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'Custom Cakes', 'custom-cakes', '/cake_images/custom-category.jpg')
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 2. INSERT CAKES (6 items)
INSERT INTO public.cakes (id, name, slug, description, price, weight, flavor, image_url, featured, available, category_id) VALUES
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 
  'Royal Chocolate Truffle', 
  'royal-chocolate-truffle', 
  'Indulge in layers of rich Belgian chocolate ganache and soft chocolate sponge, finished with chocolate curls.', 
  1299, 
  '1 kg', 
  'Chocolate Truffle', 
  '/cake_images/royal-chocolate-truffle.jpg', 
  true, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b12', 
  'Red Velvet Bliss', 
  'red-velvet-bliss', 
  'Classic red velvet cake layers with a light, fluffy cream cheese frosting, decorated with velvet crumbs and white chocolate hearts.', 
  1499, 
  '1 kg', 
  'Red Velvet Cream Cheese', 
  '/cake_images/red-velvet-bliss.jpg', 
  true, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b13', 
  'Pastel Flower Vanilla Cake', 
  'pastel-flower-vanilla-cake', 
  'Elegant vanilla cake featuring handcrafted buttercream flowers, delicate pastel designs, and gourmet vanilla bean sponge.', 
  1199, 
  '1 kg', 
  'Vanilla Bean', 
  '/cake_images/pastel-flower-vanilla.jpg', 
  true, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b14', 
  'Gourmet Strawberry Delight', 
  'gourmet-strawberry-delight', 
  'Fresh strawberry compote layered between light vanilla sponges and topped with fresh strawberry slices and white chocolate shavings.', 
  1099, 
  '1 kg', 
  'Strawberry Cream', 
  '/cake_images/gourmet-strawberry-delight.jpg', 
  false, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b15', 
  'Salted Caramel Butterscotch', 
  'salted-caramel-butterscotch', 
  'Soft butterscotch sponge layered with homemade salted caramel sauce, whipped cream, and crunchy praline nuts.', 
  999, 
  '1 kg', 
  'Butterscotch Caramel', 
  '/cake_images/salted-caramel-butterscotch.jpg', 
  true, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 
  'Pastel Dream Cupcakes (Pack of 6)', 
  'pastel-dream-cupcakes', 
  'Assorted vanilla and chocolate cupcakes decorated with premium pink and lavender buttercream frosting and edible pearls.', 
  599, 
  '0.5 kg', 
  'Assorted (Vanilla & Chocolate)', 
  '/cake_images/pastel-dream-cupcakes.jpg', 
  true, 
  true, 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'
)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 3. INSERT GALLERY ITEMS (4 items)
INSERT INTO public.gallery (id, image_url, caption) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c11', '/cake_images/gallery-1.jpg', 'Elegant Wedding Cake with Pink Buttercream Flowers'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c12', '/cake_images/gallery-2.jpg', 'Delicious Pastel Frosting Cupcakes for Celebrations'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c13', '/cake_images/gallery-3.jpg', 'Royal Chocolate Truffle Birthday Special'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c14', '/cake_images/gallery-4.jpg', 'Assorted Mini Party Cupcakes')
ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url;

-- 4. INSERT REVIEWS (3 items)
INSERT INTO public.reviews (id, customer_name, rating, review, approved) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', 'Sneha Sharma', 5, 'The Royal Chocolate Truffle cake was absolutely delicious and looked stunning! Nobody could tell it was 100% eggless. Highly recommended!', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d12', 'Amit Patel', 5, 'Aksha Cakes baked the perfect custom theme cake for my daughter''s birthday. The design was clean and the taste was incredible. Thank you!', true),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d13', 'Priya Rao', 5, 'Ordered the Pastel Dream Cupcakes for a baby shower. They were super soft, moist, and the decoration was extremely premium.', true)
ON CONFLICT (id) DO NOTHING;

-- 5. INSERT ENQUIRIES (2 items)
INSERT INTO public.enquiries (id, customer_name, phone, cake_id, message, event_date, status) VALUES
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e11', 
  'Sneha Sharma', 
  '919999999999', 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 
  'Need a 2 kg eggless truffle cake with anniversary design and ''Happy 25th Anniversary'' message.', 
  '2026-06-25', 
  'Pending'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e12', 
  'Amit Patel', 
  '918888888888', 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b16', 
  'Inquiring about price of custom photoprint cupcake pack of 12.', 
  '2026-06-29', 
  'Contacted'
)
ON CONFLICT (id) DO NOTHING;
