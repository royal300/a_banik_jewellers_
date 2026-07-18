import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "mypass",
  database: process.env.DB_NAME || "a_banik_jewellers",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function dbQuery<T = any>(sql: string, params: any[] = []): Promise<T> {
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

let migrated = false;

export async function ensureDbMigrated() {
  if (migrated) return;
  try {
    // Ensure categories has show_in_home
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image VARCHAR(500),
        icon VARCHAR(255),
        show_in_home TINYINT(1) DEFAULT 1
      )
    `);
    try {
      await dbQuery("ALTER TABLE categories ADD COLUMN show_in_home TINYINT(1) DEFAULT 1");
    } catch {
      // Column exists or table already modified
    }

    // Ensure products table exists and has necessary columns
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        category_slug VARCHAR(255) NOT NULL,
        weight VARCHAR(255) NOT NULL,
        purity VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(500) NOT NULL,
        thumbnails LONGTEXT,
        is_featured TINYINT(1) DEFAULT 0,
        is_available TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    try {
      await dbQuery("ALTER TABLE products ADD COLUMN is_featured TINYINT(1) DEFAULT 0");
    } catch {}
    try {
      await dbQuery("ALTER TABLE products ADD COLUMN thumbnails LONGTEXT");
    } catch {}

    // Ensure banners table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        image VARCHAR(500) NOT NULL,
        link VARCHAR(500),
        banner_type VARCHAR(100) DEFAULT 'promo',
        is_active TINYINT(1) DEFAULT 1
      )
    `);

    // Ensure rate_configs table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS rate_configs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rate_22k VARCHAR(255),
        rate_24k VARCHAR(255),
        rate_silver VARCHAR(255),
        last_updated VARCHAR(255),
        announcement VARCHAR(500)
      )
    `);

    const rates = await dbQuery<any[]>("SELECT * FROM rate_configs LIMIT 1");
    if (rates.length === 0) {
      await dbQuery(
        `INSERT INTO rate_configs (rate_22k, rate_24k, rate_silver, last_updated, announcement) VALUES (?, ?, ?, ?, ?)`,
        ["₹ 7,285 / g", "₹ 7,945 / g", "₹ 96 / g", "Today", "Special festive discounts on diamond making charges!"]
      );
    }

    // Ensure media_settings table
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS media_settings (
        key_name VARCHAR(255) PRIMARY KEY,
        value LONGTEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure default initial categories if table is empty
    const cats = await dbQuery<any[]>("SELECT * FROM categories LIMIT 1");
    if (cats.length === 0) {
      const initialCats = [
        ["gold", "Gold Jewellery", "/assets/cat-gold.jpg", "Hallmarked 22K & 24K gold masterpieces crafted for every occasion.", 1],
        ["diamond", "Diamond Jewellery", "/assets/cat-diamond.jpg", "Certified brilliant diamonds set in refined gold and platinum.", 1],
        ["silver", "Silver Jewellery", "/assets/cat-silver.jpg", "Pure sterling silver ornaments with intricate traditional artistry.", 1],
        ["necklace", "Necklace", "/assets/cat-necklace.jpg", "Signature necklaces from delicate chains to ornate bridal sets.", 1],
        ["rings", "Rings", "/assets/cat-rings.jpg", "Solitaires, bands and statement rings for every promise.", 1],
        ["bangles", "Bangles", "/assets/cat-bangles.jpg", "Handcrafted bangles that carry timeless tradition on every wrist.", 1]
      ];
      for (const c of initialCats) {
        await dbQuery(`INSERT INTO categories (slug, name, image, description, show_in_home) VALUES (?, ?, ?, ?, ?)`, c);
      }
    }

    // Ensure default products if table is empty
    const prods = await dbQuery<any[]>("SELECT * FROM products LIMIT 1");
    if (prods.length === 0) {
      const initialProds = [
        ["abj-001", "Ruby Radiance Gold Pendant", "necklace", "8.42 g", "22K Hallmarked Gold", "A finely handcrafted 22K gold pendant featuring a vivid ruby centrepiece.", "/assets/product-1.jpg", JSON.stringify(["/assets/product-1.jpg"]), 1],
        ["abj-002", "Aurora Solitaire Diamond Ring", "diamond", "3.15 g", "18K Gold · IGI Certified Diamond", "A brilliant round solitaire crowning a six-prong white gold band.", "/assets/product-2.jpg", JSON.stringify(["/assets/product-2.jpg"]), 1],
        ["abj-003", "Meenakari Jhumka Earrings", "gold", "14.28 g", "22K Hallmarked Gold", "Traditional temple jhumkas with intricate meenakari detailing and dangling pearls.", "/assets/product-3.jpg", JSON.stringify(["/assets/product-3.jpg"]), 1],
        ["abj-004", "Regal Diamond Kada", "bangles", "22.60 g", "18K Gold · VVS Diamonds", "A regal three-row diamond kada set in warm rose gold.", "/assets/product-4.jpg", JSON.stringify(["/assets/product-4.jpg"]), 1]
      ];
      for (const p of initialProds) {
        await dbQuery(`INSERT INTO products (slug, name, category_slug, weight, purity, description, image, thumbnails, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
      }
    }

    migrated = true;
    console.log("✅ Database schema verified & migrated successfully.");
  } catch (err) {
    console.error("⚠️ Database migration notice:", err);
  }
}
