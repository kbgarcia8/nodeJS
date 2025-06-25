export const MAKEMAINTABLES = `
  CREATE TABLE IF NOT EXISTS cafe_inventory.users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 30 ) NOT NULL UNIQUE,
    email VARCHAR ( 50 ) NOT NULL,
    first_name VARCHAR ( 50 ) NOT NULL,
    last_name VARCHAR ( 50 ) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    photo_url TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.product_categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 30 ) NOT NULL UNIQUE
  );

    CREATE TABLE IF NOT EXISTS cafe_inventory.status (
    code INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 20 ) NOT NULL UNIQUE,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_code VARCHAR ( 30 ) NOT NULL UNIQUE,
    name VARCHAR ( 50 ) NOT NULL,
    price INTEGER NOT NULL,
    size VARCHAR ( 10 ) NOT NULL,
    status_code INTEGER REFERENCES cafe_inventory.status(code) ON DELETE CASCADE,
    product_category_id INTEGER REFERENCES cafe_inventory.product_categories(id) ON DELETE CASCADE,
    description TEXT,
    photo_url TEXT
  );

  CREATE TABLE IF NOT EXISTS cafe_inventory.cart (
    user_id INTEGER REFERENCES cafe_inventory.users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES cafe_inventory.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
  );

`;
//format [TIMESTAMP DEFAULT NOW()] to TO_CHAR(<column_name>, 'YYYY-MM-DD HH12:MI:SS') AS <column_alias>
//Do this in querying not in defining schema

export const ADDSTATUS = `
    INSERT INTO cafe_inventory.status (name, description)
    VALUES
        ('Available'	,'In stock and orderable'),
        ('Low Stock','Running low — show a warning badge'),
        ('Out of Stock','Cannot be ordered'),
        ('Seasonal','Only available during some months'),
        ('Discontinued','No longer offere');
`;

export const ADDPRODCATEGORIES = `
    INSERT INTO cafe_inventory.product_categories (name)
    VALUES
        ('Iced Drink'),
        ('Hot Drink'),
        ('Cakes'),
        ('Pastries'),
        ('Pasta'),
        ('Mains'),
        ('Sides');
`;

export const POPULATEDB = `
INSERT INTO cafe_inventory.products (product_code, name, price, size, status_code, product_category_id, description, photo_url)
VALUES
    ('ID-001-CM-S', 'Caramel Macchiato', 120, 'Small', 1, 1, 'A perfect balance of coffee, vanilla, milk, and caramel makes a sweet and creamy summer drink.', 'https://www.allrecipes.com/thmb/f6PPqsjkI8-XvRgBJLWrCx5GEO0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/4538360_20Iced20Caramel20Macchiato20Photo20by20Lela20650x465-21dd58b096bc43ce8452ad1e8becaed4.jpg'),
    ('ID-002-CM-L','Caramel Macchiato', 150, 'Large', 1, 1, 'A perfect balance of coffee, vanilla, milk, and caramel makes a sweet and creamy summer drink.', 'https://www.allrecipes.com/thmb/f6PPqsjkI8-XvRgBJLWrCx5GEO0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/4538360_20Iced20Caramel20Macchiato20Photo20by20Lela20650x465-21dd58b096bc43ce8452ad1e8becaed4.jpg'),
    ('ID-003-NCB-S', 'Nitro Cold Brew', 120, 'Small', 1, 1, 'This innovative concoction is essentially cold brew coffee imbued with nitrogen gas.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/nitro-1687369765.webp'),
    ('ID-004-NCB-L', 'Nitro Cold Brew', 150, 'Large', 1, 1, 'This innovative concoction is essentially cold brew coffee imbued with nitrogen gas.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/nitro-1687369765.webp'),
    ('ID-005-VC-S', 'Vietnamese Coffee', 120, 'Small', 1, 1, 'This coffee has a delightful hint of chocolate flavor and is made using robusta coffee beans, along with a phin.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/vietnamese-iced-coffee-1687369765.webp'),
    ('ID-006-VC-L', 'Vietnamese Coffee', 150, 'Large', 1, 1, 'This coffee has a delightful hint of chocolate flavor and is made using robusta coffee beans, along with a phin.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/vietnamese-iced-coffee-1687369765.webp'),
    ('ID-007-IL-S', 'Iced Latte', 120, 'Small', 1, 1, 'Renowned for their harmonious blend of frothed milk, foam, and espresso, possess a cold counterpart in iced lattes.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/iced-latte-1687369765.webp'),
    ('ID-008-IL-L', 'Iced Latte', 150, 'Large', 1, 1, 'Renowned for their harmonious blend of frothed milk, foam, and espresso, possess a cold counterpart in iced lattes.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/iced-latte-1687369765.webp'),
    ('ID-009-M-S', 'Mazagran', 120, 'Small', 1, 1, 'Citrus might not be the first flavor that springs to mind when considering coffee, but a foray into the world of Algerian mazagran will convince you of its enjoyable compatibility.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/mazagran-1687369765.webp'),
    ('ID-010-M-L', 'Mazagran', 150, 'Large', 1, 1, 'Citrus might not be the first flavor that springs to mind when considering coffee, but a foray into the world of Algerian mazagran will convince you of its enjoyable compatibility.', 'https://www.tastingtable.com/img/gallery/15-types-of-iced-coffee-explained/mazagran-1687369765.webp'),
    ('ID-011-F-S', 'Frappucino', 120, 'Small', 1, 1, 'Made famous by Starbucks, the Frappuccino is a blended iced coffee drink that''s topped with whipped cream and syrup.', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Strawberry_Delight_Frappuccino.JPG'),
    ('ID-012-F-L', 'Frappucino', 150, 'Large', 1, 1, 'Made famous by Starbucks, the Frappuccino is a blended iced coffee drink that''s topped with whipped cream and syrup.', 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Strawberry_Delight_Frappuccino.JPG'),
    ('ID-013-SC-S', 'Strawberry and Cream', 120, 'Small', 1, 1, 'Frappuccino crème syrup blended with milk, strawberry sauce and ice. Topped with whipped cream.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO7guHl-10F7DH-cju9JGML-harZJc8iY1VA&s'),
    ('ID-014-SC-L', 'Strawberry and Cream', 150, 'Large', 1, 1, 'Frappuccino crème syrup blended with milk, strawberry sauce and ice. Topped with whipped cream.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO7guHl-10F7DH-cju9JGML-harZJc8iY1VA&s'),
    ('ID-015-SL-S', 'Spanish Latte', 120, 'Small', 1, 1, 'Iced coffee drink that''s made with milk (any kind, I ordered soy milk), condensed milk, and fresh espresso.', 'https://thehintofrosemary.com/wp-content/uploads/2023/11/Spanish-iced-latte-recipe-cover-photo-720x720.jpg'),
    ('ID-016-SL-L', 'Spanish Latte', 150, 'Large', 1, 1, 'Iced coffee drink that''s made with milk (any kind, I ordered soy milk), condensed milk, and fresh espresso.', 'https://thehintofrosemary.com/wp-content/uploads/2023/11/Spanish-iced-latte-recipe-cover-photo-720x720.jpg'),
    ('ID-017-IM-S', 'Iced Mocha', 120, 'Small', 1, 1, 'An espresso-based drink with chocolate and warm milk for the right blend of creaminess and sweetness, served over ice.', 'https://vibrantlygfree.com/wp-content/uploads/2023/07/iced-mocha-1.jpg'),
    ('ID-018-IM-L', 'Iced Mocha', 150, 'Large', 1, 1, 'An espresso-based drink with chocolate and warm milk for the right blend of creaminess and sweetness, served over ice.', 'https://vibrantlygfree.com/wp-content/uploads/2023/07/iced-mocha-1.jpg'),
    ('ID-019-IC-S', 'Iced Chocolate', 120, 'Small', 1, 1, 'It''s easy, super chocolate-y, and hydrating. Plus, it''s got a rich enough chocolate flavor that it''s something that you''ll sip slowly.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM3Ue0aHM2X0Q5gybGbzk9t0TyYuJidXBGrw&s'),
    ('ID-020-IC-L', 'Iced Chocolate', 150, 'Large', 1, 1, 'It''s easy, super chocolate-y, and hydrating. Plus, it''s got a rich enough chocolate flavor that it''s something that you''ll sip slowly.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM3Ue0aHM2X0Q5gybGbzk9t0TyYuJidXBGrw&s'),
    ('HD-001-ML-S', 'Matcha Latte', 120, 'Small', 1, 2, 'Made from finely ground green tea leaves that are mixed with steamed milk.', 'https://feelgoodfoodie.net/wp-content/uploads/2023/08/Matcha-Latte-TIMG.jpg'),
    ('HD-002-ML-L', 'Matcha Latte', 150, 'Large', 1, 2, 'Made from finely ground green tea leaves that are mixed with steamed milk.', 'https://feelgoodfoodie.net/wp-content/uploads/2023/08/Matcha-Latte-TIMG.jpg'),
    ('HD-003-HC-S', 'Hot Chocolate', 120, 'Small', 1, 2, 'Made with dark, semisweet, or bittersweet chocolate grated or chopped into small pieces and stirred into milk with the addition of sugar.', 'https://www.wellplated.com/wp-content/uploads/2014/12/French-Hot-Chocolate.-Classic-dark-European-style-hot-chocolate.jpg'),
    ('HD-004-HC-L', 'Hot Chocolate', 150, 'Large', 1, 2, 'Made with dark, semisweet, or bittersweet chocolate grated or chopped into small pieces and stirred into milk with the addition of sugar.', 'https://www.wellplated.com/wp-content/uploads/2014/12/French-Hot-Chocolate.-Classic-dark-European-style-hot-chocolate.jpg'),
    ('HD-005-HT-S', 'Hot Toddy', 120, 'Small', 1, 2, 'It''s a quick solve to a chilly evening that simply requires hot water, honey, lemon, and whiskey!', 'https://hips.hearstapps.com/hmg-prod/images/hot-drinks-hot-toddy-6501eae8d6435.jpeg?crop=0.9981290926099158xw:1xh;center,top&resize=980:*'),
    ('HD-006-HT-L', 'Hot Toddy', 150, 'Large', 1, 2, 'It''s a quick solve to a chilly evening that simply requires hot water, honey, lemon, and whiskey!', 'https://hips.hearstapps.com/hmg-prod/images/hot-drinks-hot-toddy-6501eae8d6435.jpeg?crop=0.9981290926099158xw:1xh;center,top&resize=980:*'),
    ('HD-007-PSL-S', 'Pumpkin Spice Latte', 120, 'Small', 1, 2, 'Made with real pumpkin puree—this latte is a must-have when the weather turns chilly.', 'https://hips.hearstapps.com/hmg-prod/images/hot-drinks-pumpkin-spice-latte-6501ed8884793.jpeg?crop=0.563xw:1.00xh;0.293xw,0&resize=980:*'),
    ('HD-008-PSL-L', 'Pumpkin Spice Latte', 150, 'Large', 1, 2, 'Made with real pumpkin puree—this latte is a must-have when the weather turns chilly.', 'https://hips.hearstapps.com/hmg-prod/images/hot-drinks-pumpkin-spice-latte-6501ed8884793.jpeg?crop=0.563xw:1.00xh;0.293xw,0&resize=980:*'),
    ('HD-009-CHL-S', 'Chai Latte', 120, 'Small', 1, 2, 'Made by mixing steamed milk with black tea that has been infused with spices', 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2022/02/Chai-Latte-5.jpg'),
    ('HD-010-CHL-L', 'Chai Latte', 150, 'Large', 1, 2, 'Made by mixing steamed milk with black tea that has been infused with spices', 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2022/02/Chai-Latte-5.jpg'),
    ('HD-011-CRL-S', 'Caramel Latte', 120, 'Small', 1, 2, 'A velvety coffee indulgence featuring freshly brewed espresso, steamed milk, and a generous drizzle of luscious caramel syrup.', 'https://www.nescafe.com/ph/sites/default/files/2023-04/RecipeHero_CaramelLatte_1066x1066.jpg'),
    ('HD-012-CRL-L', 'Caramel Latte', 150, 'Large', 1, 2, 'A velvety coffee indulgence featuring freshly brewed espresso, steamed milk, and a generous drizzle of luscious caramel syrup.', 'https://www.nescafe.com/ph/sites/default/files/2023-04/RecipeHero_CaramelLatte_1066x1066.jpg'),
    ('HD-013-CA-S', 'Caffè Americano', 120, 'Small', 1, 2, 'A classic favorite prepared by diluting an espresso with hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee.', 'https://www.coffeeness.de/wp-content/uploads/2023/09/hot-americano-coffee.jpg'),
    ('HD-014-CA-L', 'Caffè Americano', 150, 'Large', 1, 2, 'A classic favorite prepared by diluting an espresso with hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee.', 'https://www.coffeeness.de/wp-content/uploads/2023/09/hot-americano-coffee.jpg'),
    ('HD-015-HBR-S', 'Hot Buttered Rum', 120, 'Small', 1, 2, 'Mixed drink containing rum, butter, hot water or cider, a sweetener, and various spices.', 'https://www.liquor.com/thmb/O1ET7pKvz0v1OznBOz3XsWJ3cMg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hot-caramel-buttered-rum-720x720-primary-9ae83dcacaec4c8e97b395ca6974e809.jpg'),
    ('HD-016-HBR-L', 'Hot Buttered Rum', 150, 'Large', 1, 2, 'Mixed drink containing rum, butter, hot water or cider, a sweetener, and various spices.', 'https://www.liquor.com/thmb/O1ET7pKvz0v1OznBOz3XsWJ3cMg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/hot-caramel-buttered-rum-720x720-primary-9ae83dcacaec4c8e97b395ca6974e809.jpg'),
    ('HD-017-IC-S', 'Irish Coffee', 120, 'Small', 1, 2, 'A caffeinated alcoholic drink consisting of Irish whiskey, hot coffee and sugar, which has been stirred and topped with cream.', 'https://www.acouplecooks.com/wp-content/uploads/2021/02/Irish-Coffee-005.jpg'),
    ('HD-018-IC-L', 'Irish Coffee', 150, 'Large', 1, 2, 'A caffeinated alcoholic drink consisting of Irish whiskey, hot coffee and sugar, which has been stirred and topped with cream.', 'https://www.acouplecooks.com/wp-content/uploads/2021/02/Irish-Coffee-005.jpg'),
    ('HD-019-AC-S', 'Asiático Coffee', 120, 'Small', 1, 2, 'Coffee with condensed milk and cognac; a few drops of Licor 43 as well as a couple of coffee beans, lemon rind and cinnamon may be added.', 'https://yourspanishcorner.com/modules/prestablog/views/img/grid-for-1-7/up-img/4.jpg'),
    ('HD-020-AC-L', 'Asiático Coffee', 150, 'Large', 1, 2, 'Coffee with condensed milk and cognac; a few drops of Licor 43 as well as a couple of coffee beans, lemon rind and cinnamon may be added.', 'https://yourspanishcorner.com/modules/prestablog/views/img/grid-for-1-7/up-img/4.jpg'),
    ('PS-001-TT-SL', 'Tarte Tatin', 150, 'Solo', 1, 4, 'Dark and sticky caramel, sweet apples and crisp pastry combine to make this heavenly French dessert.', 'https://greatfood.ie/wp-content/uploads/2024/08/a-beautifully-presented-tarte-tatin-on-a-rustic-wo-YSDGksR2TmeixgDiHnjwog-LrjC_1BHSU21_qbCJEZc3w.png'),
    ('PS-002-TT-FS', 'Tarte Tatin', 200, 'For Share', 1, 4, 'Dark and sticky caramel, sweet apples and crisp pastry combine to make this heavenly French dessert.', 'https://greatfood.ie/wp-content/uploads/2024/08/a-beautifully-presented-tarte-tatin-on-a-rustic-wo-YSDGksR2TmeixgDiHnjwog-LrjC_1BHSU21_qbCJEZc3w.png'),
    ('PS-003-PAC-SL', 'Pain au chocolat', 150, 'Solo', 1, 4, 'A Yeasted puff pastry dough wrapped around a stick of chocolate', 'https://sallysbakingaddiction.com/wp-content/uploads/2018/03/chocolate-croissants-2.jpg'),
    ('PS-004-PAC-FS', 'Pain au chocolat', 200, 'For Share', 1, 4, 'A Yeasted puff pastry dough wrapped around a stick of chocolate', 'https://sallysbakingaddiction.com/wp-content/uploads/2018/03/chocolate-croissants-2.jpg'),
    ('PS-005-TU-SL', 'Tiramisu', 150, 'Solo', 1, 4, 'Classic Italian dessert renowned for its heavenly layers of coffee-soaked ladyfingers and velvety mascarpone cream.', 'https://fhahoreca.com/wp-content/uploads/2023/08/A-tiramisu-portion-topped-with-strawberry.jpg'),
    ('PS-006-TU-FS', 'Tiramisu', 200, 'For Share', 1, 4, 'Classic Italian dessert renowned for its heavenly layers of coffee-soaked ladyfingers and velvety mascarpone cream.', 'https://fhahoreca.com/wp-content/uploads/2023/08/A-tiramisu-portion-topped-with-strawberry.jpg'),
    ('PS-007-CS-SL', 'Croissant', 150, 'Solo', 1, 4, 'A laminated, yeast-leavened bakery product that contains dough/roll-in fat layers to create a flaky, crispy texture.', 'https://fhahoreca.com/wp-content/uploads/2023/08/Two-croissants-on-a-platter.jpg'),
    ('PS-008-CS-FS', 'Croissant', 200, 'For Share', 1, 4, 'A laminated, yeast-leavened bakery product that contains dough/roll-in fat layers to create a flaky, crispy texture.', 'https://fhahoreca.com/wp-content/uploads/2023/08/Two-croissants-on-a-platter.jpg'),
    ('PS-009-CR-SL', 'Cinnamon Roll', 150, 'Solo', 1, 4, 'Made with yeasted dough that is rolled into a rectangle, spread with butter, then sprinkled heavily with a mix of sugar and cinnamon and rolled into a log that is cut into slices.', 'https://www.tasteatlas.com/images/dishes/5a7b78ad0a3744cabc9c2f8fd94d1e55.jpg?mw=1300'),
    ('PS-010-CR-FS', 'Cinnamon Roll', 200, 'For Share', 1, 4, 'Made with yeasted dough that is rolled into a rectangle, spread with butter, then sprinkled heavily with a mix of sugar and cinnamon and rolled into a log that is cut into slices.', 'https://www.tasteatlas.com/images/dishes/5a7b78ad0a3744cabc9c2f8fd94d1e55.jpg?mw=1300'),
    ('PS-011-EB-SL', 'Everything Bagel', 150, 'Solo', 1, 4, 'The bagel underneath the everything topping is just a plain bagel—until it''s transformed by the addition of a spice mix right before it''s baked.', 'https://thebusybaker.ca/wp-content/uploads/2020/05/homemade-everything-bagels-fb-ig-7-scaled.jpg'),
    ('PS-012-EB-FS', 'Everything Bagel', 200, 'For Share', 1, 4, 'The bagel underneath the everything topping is just a plain bagel—until it''s transformed by the addition of a spice mix right before it''s baked.', 'https://thebusybaker.ca/wp-content/uploads/2020/05/homemade-everything-bagels-fb-ig-7-scaled.jpg'),
    ('PS-013-GD-SL', 'Glazed Donut', 150, 'Solo', 1, 4, 'Light and fluffy, covered in a simple glaze.', 'https://assets.epicurious.com/photos/54b0226d766062b20344580a/1:1/w_2560%2Cc_limit/51160200_glazed-doughnuts_1x1.jpg'),
    ('PS-014-GD-FS', 'Glazed Donut', 200, 'For Share', 1, 4, 'Light and fluffy, covered in a simple glaze.', 'https://assets.epicurious.com/photos/54b0226d766062b20344580a/1:1/w_2560%2Cc_limit/51160200_glazed-doughnuts_1x1.jpg'),
    ('PS-015-DP-SL', 'Danish Pastry', 150, 'Solo', 1, 4, 'Made with laminated dough, where the dough is repeatedly covered with butter and folded over itself.', 'https://www.tasteatlas.com/Images/Dishes/fefa53468acc4221b66593471638502d.jpg?mw=1300'),
    ('PS-016-DP-FS', 'Danish Pastry', 200, 'For Share', 1, 4, 'Made with laminated dough, where the dough is repeatedly covered with butter and folded over itself.', 'https://www.tasteatlas.com/Images/Dishes/fefa53468acc4221b66593471638502d.jpg?mw=1300'),
    ('PS-017-EC-SL', 'Éclair', 150, 'Solo', 1, 4, 'These elongated pastries with an appealing glaze, a crispy exterior, a soft doughy interior, and a sweet, creamy center.', 'https://www.tasteatlas.com/Images/Dishes/5af8a479dedb4d53a7718ca752a536eb.jpg?mw=1300'),
    ('PS-018-EC-FS', 'Éclair', 200, 'For Share', 1, 4, 'These elongated pastries with an appealing glaze, a crispy exterior, a soft doughy interior, and a sweet, creamy center.', 'https://www.tasteatlas.com/Images/Dishes/5af8a479dedb4d53a7718ca752a536eb.jpg?mw=1300'),
    ('PS-019-BL-SL', 'Baklava', 150, 'Solo', 1, 4, 'Luscious dessert created with layers of thin phyllo dough intertwined with chopped nuts, all doused in a sweet, viscous syrup.', 'https://www.tasteatlas.com/Images/Dishes/4632111123f642a7a1867909ed5426f5.jpg?mw=1300'),
    ('PS-020-BL-FS', 'Baklava', 200, 'For Share', 1, 4, 'Luscious dessert created with layers of thin phyllo dough intertwined with chopped nuts, all doused in a sweet, viscous syrup.', 'https://www.tasteatlas.com/Images/Dishes/4632111123f642a7a1867909ed5426f5.jpg?mw=1300'),
    ('PT-001-LN-SL', 'Lasagne', 150, 'Solo', 1, 5, 'Layered with a rich meat sauce and a creamy parmesan white sauce, plus the perfect amount of mozzarella cheese.', 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg'),
    ('PT-002-LN-FS', 'Lasagne', 200, 'For Share', 1, 5, 'Layered with a rich meat sauce and a creamy parmesan white sauce, plus the perfect amount of mozzarella cheese.', 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg'),
    ('PT-003-CB-SL', 'Carbonara', 150, 'Solo', 1, 5, 'Italian main course consisting of spaghetti with bacon and a creamy sauce made from eggs, Pecorino or Parmesan and black pepper.', 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg'),
    ('PT-004-CB-FS', 'Carbonara', 200, 'For Share', 1, 5, 'Italian main course consisting of spaghetti with bacon and a creamy sauce made from eggs, Pecorino or Parmesan and black pepper.', 'https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg'),
    ('PT-005-CP-SL', 'Chili prawn linguine', 150, 'Solo', 1, 5, 'Pasta tossed with a rich tomato sauce with a tingle of spicy heat and plump prawns (shrimp).', 'https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg'),
    ('PT-006-CP-FS', 'Chili prawn linguine', 200, 'For Share', 1, 5, 'Pasta tossed with a rich tomato sauce with a tingle of spicy heat and plump prawns (shrimp).', 'https://www.themealdb.com/images/media/meals/usywpp1511189717.jpg'),
    ('PT-007-MC-SL', 'Macaroni Cheese', 150, 'Solo', 1, 5, 'The dish consists of macaroni (short, tubular) pasta, baked in a cheesy bechamel sauce (also known as a Mornay sauce) in the oven.', 'https://www.datocms-assets.com/20941/1635348486-adobestock224148008.jpeg?auto=compress&dpr=0.95&fm=jpg&w=850'),
    ('PT-008-MC-FS', 'Macaroni Cheese', 200, 'For Share', 1, 5, 'The dish consists of macaroni (short, tubular) pasta, baked in a cheesy bechamel sauce (also known as a Mornay sauce) in the oven.', 'https://www.datocms-assets.com/20941/1635348486-adobestock224148008.jpeg?auto=compress&dpr=0.95&fm=jpg&w=850'),
    ('PT-009-AO-SL', 'Aglio Olio', 150, 'Solo', 1, 5, 'Deliciously simple Italian dish of fresh garlic, olive oil, and Parmesan cheese tossed with freshly cooked spaghetti.', 'https://www.sharmispassions.com/wp-content/uploads/2021/12/spaghetti-aglio-e-olio4.jpg'),
    ('PT-010-AO-FS', 'Aglio Olio', 200, 'For Share', 1, 5, 'Deliciously simple Italian dish of fresh garlic, olive oil, and Parmesan cheese tossed with freshly cooked spaghetti.', 'https://www.sharmispassions.com/wp-content/uploads/2021/12/spaghetti-aglio-e-olio4.jpg'),
    ('PT-011-BP-SL', 'Baked Penne With Chicken and Sun-Dried Tomatoes', 150, 'Solo', 1, 5, 'It has chicken breasts, mushrooms, and sun-dried tomatoes. Shredded provolone and grated Parmesan make it super creamy.', 'https://www.errenskitchen.com/wp-content/uploads/2022/05/Chicken-Sundried-Tomato-Pasta-1-4.jpg'),
    ('PT-012-BP-FS', 'Baked Penne With Chicken and Sun-Dried Tomatoes', 200, 'For Share', 1, 5, 'It has chicken breasts, mushrooms, and sun-dried tomatoes. Shredded provolone and grated Parmesan make it super creamy.', 'https://www.errenskitchen.com/wp-content/uploads/2022/05/Chicken-Sundried-Tomato-Pasta-1-4.jpg'),
    ('PT-013-TP-SL', 'One-Pan Creamy Tuna Pasta', 150, 'Solo', 1, 5, 'This one-pot wonder inspired by Tuna Helper has tuna, tender noodles, and peas cooked together in a creamy sauce.', 'https://www.marthastewart.com/thmb/ojZtnIjwwH0zT62cky2nf_9pQzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSL-one-pan-creamy-tuna-pasta-hero-1866-b0847e3b8c1a4786a122af224868b5bf.jpeg'),
    ('PT-014-TP-FS', 'One-Pan Creamy Tuna Pasta', 200, 'For Share', 1, 5, 'This one-pot wonder inspired by Tuna Helper has tuna, tender noodles, and peas cooked together in a creamy sauce.', 'https://www.marthastewart.com/thmb/ojZtnIjwwH0zT62cky2nf_9pQzA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MSL-one-pan-creamy-tuna-pasta-hero-1866-b0847e3b8c1a4786a122af224868b5bf.jpeg'),
    ('PT-015-MR-SL', 'Mushroom Ragu', 150, 'Solo', 1, 5, 'A hearty and deeply flavorful mushroom ragù featuring finely chopped mushrooms, tomatoes, white wine, and aromatics slow-cooked in an oven.', 'https://cookingwithcocktailrings.com/wp-content/uploads/2024/03/Creamy-Mushroom-Ragu-Sauce-with-Short-Rib-Ravioli-30-scaled.webp'),
    ('PT-016-MR-FS', 'Mushroom Ragu', 200, 'For Share', 1, 5, 'A hearty and deeply flavorful mushroom ragù featuring finely chopped mushrooms, tomatoes, white wine, and aromatics slow-cooked in an oven.', 'https://cookingwithcocktailrings.com/wp-content/uploads/2024/03/Creamy-Mushroom-Ragu-Sauce-with-Short-Rib-Ravioli-30-scaled.webp'),
    ('PT-017-GR-SL', 'Garlic Cream Sauce Ravioli', 150, 'Solo', 1, 5, 'Sauce is made to be drenched over ravioli and compliments so many different fillings.', 'https://www.dontgobaconmyheart.co.uk/wp-content/uploads/2021/07/garlic-cream-sauce-for-ravioli-744x828.jpg'),
    ('PT-018-GR-FS', 'Garlic Cream Sauce Ravioli', 200, 'For Share', 1, 5, 'Sauce is made to be drenched over ravioli and compliments so many different fillings.', 'https://www.dontgobaconmyheart.co.uk/wp-content/uploads/2021/07/garlic-cream-sauce-for-ravioli-744x828.jpg'),
    ('PT-019-BS-SL', 'Beef Stroganoff', 150, 'Solo', 1, 5, 'Features juicy beef, hearty mushrooms, mustard, white wine, and sour cream for the most tender and delicious results.', 'https://www.foodandwine.com/thmb/WDzimnme-7nOe_wBVXYxVyGNVBQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/FAW-beef-stroganoff-hero-06-5dc1fb98ed9f4eea97bab613d212eead.jpg'),
    ('PT-020-BS-FS', 'Beef Stroganoff', 200, 'For Share', 1, 5, 'Features juicy beef, hearty mushrooms, mustard, white wine, and sour cream for the most tender and delicious results.', 'https://www.foodandwine.com/thmb/WDzimnme-7nOe_wBVXYxVyGNVBQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/FAW-beef-stroganoff-hero-06-5dc1fb98ed9f4eea97bab613d212eead.jpg'),  
    ('MS-001-TP-SL', 'Tonkatsu Pork', 180, 'Solo', 1, 6, 'A pork chop breaded with flour, egg, and Panko (bread crumbs), then deep fried.', 'https://www.themealdb.com/images/media/meals/lwsnkl1604181187.jpg'),
    ('MS-002-TP-FS', 'Tonkatsu Pork', 220, 'For Share', 1, 6, 'A pork chop breaded with flour, egg, and Panko (bread crumbs), then deep fried.', 'https://www.themealdb.com/images/media/meals/lwsnkl1604181187.jpg'),
    ('MS-003-SSP-SL', 'Sweet and Sour Pork', 180, 'Solo', 1, 6, 'A Chinese stir-fry dish made with juicy pieces of pork tenderloin, bell peppers, onion, and pineapple.', 'https://www.themealdb.com/images/media/meals/1529442316.jpg'),
    ('MS-004-SSP-FS', 'Sweet and Sour Pork', 220, 'For Share', 1, 6, 'A Chinese stir-fry dish made with juicy pieces of pork tenderloin, bell peppers, onion, and pineapple.', 'https://www.themealdb.com/images/media/meals/1529442316.jpg'),
    ('MS-005-RPB-SL', 'Roasted Pork Belly', 180, 'Solo', 1, 6, 'This roasted pork belly is juicy and succulent with a crispy crackling layer on top that takes it to the next level.', 'https://pinchandswirl.com/wp-content/uploads/2024/07/Pork-Belly-Recipe-sq.jpg'),
    ('MS-006-RPB-FS', 'Roasted Pork Belly', 220, 'For Share', 1, 6, 'This roasted pork belly is juicy and succulent with a crispy crackling layer on top that takes it to the next level.', 'https://pinchandswirl.com/wp-content/uploads/2024/07/Pork-Belly-Recipe-sq.jpg'),
    ('MS-007-KPC-SL', 'Kung Pao Chicken', 180, 'Solo', 1, 6, 'Chinese-style stir-fried chicken cubes with dried chili peppers.', 'https://www.themealdb.com/images/media/meals/1525872624.jpg'),
    ('MS-008-KPC-FS', 'Kung Pao Chicken', 220, 'For Share', 1, 6, 'Chinese-style stir-fried chicken cubes with dried chili peppers.', 'https://www.themealdb.com/images/media/meals/1525872624.jpg'),
    ('MS-009-GTC-SL', 'General Tso''s Chicken', 180, 'Solo', 1, 6, 'Perfect combination of sweet, savoury, spicy and tangy with crispy Chinese chicken bites.', 'https://www.themealdb.com/images/media/meals/1529444113.jpg'),
    ('MS-010-GTC-FS', 'General Tso''s Chicken', 220, 'For Share', 1, 6, 'Perfect combination of sweet, savoury, spicy and tangy with crispy Chinese chicken bites.', 'https://www.themealdb.com/images/media/meals/1529444113.jpg'),
    ('MS-011-TGC-SL', 'Thai Green Curry', 180, 'Solo', 1, 6, 'Undoubtedly a unique curry of all since it gives the soup a light green colour and incredible flavour, making it stand out from the rest.', 'https://www.themealdb.com/images/media/meals/sstssx1487349585.jpg'),
    ('MS-012-TGC-FS', 'Thai Green Curry', 220, 'For Share', 1, 6, 'Undoubtedly a unique curry of all since it gives the soup a light green colour and incredible flavour, making it stand out from the rest.', 'https://www.themealdb.com/images/media/meals/sstssx1487349585.jpg'),
    ('MS-013-BC-SL', 'Beef Caldareta', 180, 'Solo', 1, 6, 'Beef stew cooked with tomato sauce and liver spread.', 'https://www.themealdb.com/images/media/meals/41cxjh1683207682.jpg'),
    ('MS-014-BC-FS', 'Beef Caldareta', 220, 'For Share', 1, 6, 'Beef stew cooked with tomato sauce and liver spread.', 'https://www.themealdb.com/images/media/meals/41cxjh1683207682.jpg'),
    ('MS-015-SB-SL', 'Szechuan Beef', 180, 'Solo', 1, 6, 'Spicy stir fry made with tender pieces of beef and colorful vegetables, all tossed in a sweet and savory sauce.', 'https://www.themealdb.com/images/media/meals/1529443236.jpg'),
    ('MS-016-SB-FS', 'Szechuan Beef', 220, 'For Share', 1, 6, 'Spicy stir fry made with tender pieces of beef and colorful vegetables, all tossed in a sweet and savory sauce.', 'https://www.themealdb.com/images/media/meals/1529443236.jpg'),
    ('MS-017-BBR-SL', 'Beef Brisket Pot Roast', 180, 'Solo', 1, 6, 'It''s essentially a pot roast—a slow braise with lots and lots of onions.', 'https://www.themealdb.com/images/media/meals/ursuup1487348423.jpg'),
    ('MS-018-BBR-FS', 'Beef Brisket Pot Roast', 220, 'For Share', 1, 6, 'It''s essentially a pot roast—a slow braise with lots and lots of onions.', 'https://www.themealdb.com/images/media/meals/ursuup1487348423.jpg'),
    ('MS-019-BS-SL', 'Baked salmon with fennel & tomatoes', 180, 'Solo', 1, 6, 'Aniseedy fennel and juicy cherry tomatoes cut through the richness of salmon fillets.', 'https://www.themealdb.com/images/media/meals/1548772327.jpg'),
    ('MS-020-BS-FS', 'Baked salmon with fennel & tomatoes', 220, 'For Share', 1, 6, 'Aniseedy fennel and juicy cherry tomatoes cut through the richness of salmon fillets.', 'https://www.themealdb.com/images/media/meals/1548772327.jpg'),
    ('MS-021-KPP-SL', 'Kung Po Prawns', 180, 'Solo', 1, 6, 'A delicious stir fry that combines jumbo shrimp in a salty almost sweet sauce loaded with dried chillies, Szechuan pepper and peanuts.', 'https://www.themealdb.com/images/media/meals/1525873040.jpg'),
    ('MS-022-KPP-FS', 'Kung Po Prawns', 220, 'For Share', 1, 6, 'A delicious stir fry that combines jumbo shrimp in a salty almost sweet sauce loaded with dried chillies, Szechuan pepper and peanuts.', 'https://www.themealdb.com/images/media/meals/1525873040.jpg'),
    ('MS-023-FC-SL', 'Fried Calamari', 180, 'Solo', 1, 6, 'Crispy, succulent calamari rings, coated in seasoned flour and quickly fried to crispy perfection.', 'https://www.themediterraneandish.com/wp-content/uploads/2021/02/fried-calamari-recipe-7.jpg'),
    ('MS-024-FC-FS', 'Fried Calamari', 220, 'For Share', 1, 6, 'Crispy, succulent calamari rings, coated in seasoned flour and quickly fried to crispy perfection.', 'https://www.themediterraneandish.com/wp-content/uploads/2021/02/fried-calamari-recipe-7.jpg'),
    ('SD-001-PFB-SL', 'Prawn & Fennel Bisque', 150, 'Solo', 1, 7, 'This smooth and creamy seafood soup made with saffron and fennel makes an impressive starter or light supper.', 'https://www.themealdb.com/images/media/meals/rtwwvv1511799504.jpg'),
    ('SD-002-PFB-FS', 'Prawn & Fennel Bisque', 200, 'For Share', 1, 7, 'This smooth and creamy seafood soup made with saffron and fennel makes an impressive starter or light supper.', 'https://www.themealdb.com/images/media/meals/rtwwvv1511799504.jpg'),
    ('SD-003-CMS-SL', 'Cream of Mushroom Soup', 150, 'Solo', 1, 7, 'Full flavoured with garlic, onions and herbs, subtle enough to shine through and compliment the natural flavour of the mushrooms.', 'https://www.simplyrecipes.com/thmb/KpdPCxnwtFQCWD6u2Ww0urN8xwU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2014__12__cream-of-mushroom-soup-horiz-d-1600-35c4020aaa6543e7b6fcecf5e30865e0.jpg'),
    ('SD-004-CMS-FS', 'Cream of Mushroom Soup', 200, 'For Share', 1, 7, 'Full flavoured with garlic, onions and herbs, subtle enough to shine through and compliment the natural flavour of the mushrooms.', 'https://www.simplyrecipes.com/thmb/KpdPCxnwtFQCWD6u2Ww0urN8xwU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2014__12__cream-of-mushroom-soup-horiz-d-1600-35c4020aaa6543e7b6fcecf5e30865e0.jpg'),
    ('SD-005-SK-SL', 'Shakshouka', 150, 'Solo', 1, 7, 'A Maghrebi (North African) dish, popular throughout the region, featuring poached eggs in a spicy tomato sauce, seasoned with peppers, onion, garlic, and various spices.', 'https://www.themealdb.com/images/media/meals/gpz67p1560458984.jpg'),
    ('SD-006-SK-FS', 'Shakshouka', 200, 'For Share', 1, 7, 'A Maghrebi (North African) dish, popular throughout the region, featuring poached eggs in a spicy tomato sauce, seasoned with peppers, onion, garlic, and various spices.', 'https://www.themealdb.com/images/media/meals/gpz67p1560458984.jpg'),
    ('SD-007-P-SL', 'Poutine', 150, 'Solo', 1, 7, 'Dish of french fries and cheese curds topped with a brown gravy.', 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg'),
    ('SD-008-P-FS', 'Poutine', 200, 'For Share', 1, 7, 'Dish of french fries and cheese curds topped with a brown gravy.', 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg'),
    ('SD-009-CBN-SL', 'Cheesy Beef Nachos', 150, 'Solo', 1, 7, 'Cheesy Beef Nachos are a classic appetizer staple that''s perfect for solo munching, or turn into a sharing platter for the holidays or parties!', 'https://farahjeats.com/wp-content/uploads/2023/02/IMG_5399-768x1024.jpg'),
    ('SD-010-CBN-FS', 'Cheesy Beef Nachos', 200, 'For Share', 1, 7, 'Cheesy Beef Nachos are a classic appetizer staple that''s perfect for solo munching, or turn into a sharing platter for the holidays or parties!', 'https://farahjeats.com/wp-content/uploads/2023/02/IMG_5399-768x1024.jpg'),
    ('SD-011-CS-SL', 'Ceasar Salad', 150, 'Solo', 1, 7, 'Made with romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.', 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg'),
    ('SD-012-CS-FS', 'Ceasar Salad', 200, 'For Share', 1, 7, 'Made with romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.', 'https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg'),
    ('SD-013-CB-SL', 'Cheesy Garlic Bread with dip', 150, 'Solo', 1, 7, 'Roasted garlic and shallots in a creamy cheesy dip with fresh herbs like parsley and chives, served with toasty bread.', 'https://i0.wp.com/kennascooks.com/wp-content/uploads/2024/07/img_8628.jpg?resize=1080%2C1440&ssl=1'),
    ('SD-014-CB-FS', 'Cheesy Garlic Bread with dip', 200, 'For Share', 1, 7, 'Roasted garlic and shallots in a creamy cheesy dip with fresh herbs like parsley and chives, served with toasty bread.', 'https://i0.wp.com/kennascooks.com/wp-content/uploads/2024/07/img_8628.jpg?resize=1080%2C1440&ssl=1'),
    ('SD-015-MS-SL', 'Mozarella Sticks', 150, 'Solo', 1, 7, 'This classic appetizer consists of sticks of mozzarella cheese that are coated in seasoned Italian breadcrumbs, then deep fried until golden brown.', 'https://sugarspunrun.com/wp-content/uploads/2021/07/Homemade-Mozzarella-Sticks-Recipe-2-of-5.jpg'),
    ('SD-016-MS-FS', 'Mozarella Sticks', 200, 'For Share', 1, 7, 'This classic appetizer consists of sticks of mozzarella cheese that are coated in seasoned Italian breadcrumbs, then deep fried until golden brown.', 'https://sugarspunrun.com/wp-content/uploads/2021/07/Homemade-Mozzarella-Sticks-Recipe-2-of-5.jpg'),
    ('SD-017-CPS-SL', 'Chicken Parm Sliders', 150, 'Solo', 1, 7, 'Succulent store-bought rotisserie chicken layered with tangy marinara sauce, gooey mozzarella cheese, and fragrant fresh basil, all nestled between soft, pillowy dinner rolls.', 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Chicken-Parmesan-Slider-Bake_EXPS_FT24_204498_JR_0124_1.jpg?fit=300,300&webp=1'),
    ('SD-018-CPS-FS', 'Chicken Parm Sliders', 200, 'For Share', 1, 7, 'Succulent store-bought rotisserie chicken layered with tangy marinara sauce, gooey mozzarella cheese, and fragrant fresh basil, all nestled between soft, pillowy dinner rolls.', 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Chicken-Parmesan-Slider-Bake_EXPS_FT24_204498_JR_0124_1.jpg?fit=300,300&webp=1'),
    ('SD-019-CC-SL', 'Clam Chowder', 150, 'Solo', 1, 7, 'Creamy broth that''s loaded with delicious clams, savory bacon, simple seasonings, and perfectly cooked potatoes.', 'https://thecozycook.com/wp-content/uploads/2022/10/Clam-Chowder-1.jpg'),
    ('SD-020-CC-FS', 'Clam Chowder', 200, 'For Share', 1, 7, 'Creamy broth that''s loaded with delicious clams, savory bacon, simple seasonings, and perfectly cooked potatoes.', 'https://thecozycook.com/wp-content/uploads/2022/10/Clam-Chowder-1.jpg');    
`;

//command not yet tested
export const CLEARDB = `
    TRUNCATE TABLE cafe_inventory.users, cafe_inventory.product_categories, cafe_inventory.status, cafe_inventory.products, cafe_inventory.cart RESTART IDENTITY CASCADE;
`