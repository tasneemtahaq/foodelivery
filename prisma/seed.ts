import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin ──
  const adminEmail    = process.env.ADMIN_EMAIL    ?? "admin@mamasoups.com";
const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

const hashedPassword = await bcrypt.hash(adminPassword, 10);

await prisma.admin.upsert({
  where:  { email: adminEmail },
  update: {
    email:    adminEmail,
    password: hashedPassword,
  },
  create: {
    email:    adminEmail,
    password: hashedPassword,
  },
});
  console.log("✅ Admin created");

  // ── Settings ──
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        restaurantName: "Mama Soups",
        openingHours:   "5:00 PM - 11:00 PM",
        address:        "Karachi, Pakistan",
        phone:          "0333-2287497",
        taxPercent:     0,
      },
    });
  }
  console.log("✅ Settings created");

  // ── Categories ──
  const soup = await prisma.category.upsert({
    where:  { name: "Soups" },
    update: {},
    create: { name: "Soups" },
  });

  const fries = await prisma.category.upsert({
    where:  { name: "Fries" },
    update: {},
    create: { name: "Fries" },
  });

  const puri = await prisma.category.upsert({
    where:  { name: "Puri" },
    update: {},
    create: { name: "Puri" },
  });

  const drinks = await prisma.category.upsert({
    where:  { name: "Sodas" },
    update: {},
    create: { name: "Sodas" },
  });

  console.log("✅ Categories created");

  // ── Foods ──
  // Delete existing foods first to avoid duplicates
  await prisma.food.deleteMany({});

  await prisma.food.createMany({
    data: [
      // Soups
      {
        name:        "Chicken Corn Soup(Single)",
        description: "Classic hot chicken corn soup (plain).",
        price:       100,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/soup.png",
        categoryId:  soup.id,
      },
      {
        name:        "Chicken Corn Soup(Family)",
        description: "Classic hot chicken corn soup (plain), serves 4 persons.",
        price:       350,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/soup.png",
        categoryId:  soup.id,
      },
      {
        name:        "Yakhni Soup (Single)",
        description: "Made from Desi Chicken Stock.",
        price:       170,
        isAvailable: true,
        image:       "/images/yakhni.png",
        categoryId:  soup.id,
      },
      {
        name:        "Yakhni Soup (Family)",
        description: "Made from Desi Chicken Stock, serves 4 persons.",
        price:       500,
        isAvailable: true,
        image:       "/images/yakhni.png",
        categoryId:  soup.id,
      },
      {
        name:        "Boiled Egg",
        description: "Perfectly boiled egg served as a soup side or topping.",
        price:       30,
        isAvailable: true,
        image:       "/images/egg.png",
        categoryId:  soup.id,
      },
      {
        name:        "Slims",
        description: "Crispy slim crackers — perfect companion with your soup.",
        price:       40,
        isAvailable: true,
        image:       "/images/slims.png",
        categoryId:  soup.id,
      },
      {
        name:        "Crackers",
        description: "Light and crunchy crackers served with soup.",
        price:       40,
        isAvailable: true,
        image:       "/images/crackers.png",
        categoryId:  soup.id,
      },

      // Fries
      {
        name:        "Classic Salted Fries",
        description: "Crispy golden fries with a light sprinkle of sea salt.",
        price:       120,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/saltedfries.png",
        categoryId:  fries.id,
      },
      {
        name:        "Green Chilli Fries",
        description: "Fries tossed in Green chilli spices.",
        price:       120,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/friesgreen.png",
        categoryId:  fries.id,
      },
      {
        name:        "Cheese Fries",
        description: "Loaded with cheddar cheese spice on crispy fries.",
        price:       120,
        isAvailable: true,
        image:       "/images/friescheese.png",
        categoryId:  fries.id,
      },
      {
        name:        "BBQ Fries",
        description: "Smoky BBQ seasoned fries with a tangy dipping sauce.",
        price:       120,
        isAvailable: true,
        image:       "/images/friesbbq.png",
        categoryId:  fries.id,
      },
      {
        name:        "Salsa Fries",
        description: "Fries drizzled with Salsa seasoning and tangy dipping sauce.",
        price:       120,
        isAvailable: true,
        image:       "/images/friessalsa.png",
        categoryId:  fries.id,
      },
      {
        name:        "Chicken Fries",
        description: "Chicken spice seasoned fries sauce.",
        price:       120,
        isAvailable: true,
        image:       "/images/frieschicken.png",
        categoryId:  fries.id,
      },
      {
        name:        "Chatpata Fries",
        description: "Tangy chaat masala fries.",
        price:       120,
        isAvailable: true,
        image:       "/images/chatmasalafries.png",
        categoryId:  fries.id,
      },

      // Puri
      {
        name:        "Pani Puri",
        description: "Single plate, 8 Pieces.",
        price:       180,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/panipuri.png",
        categoryId:  puri.id,
      },
      {
        name:        "Meethi Puri",
        description: "Single plate, 8 Pieces.",
        price:       180,
        isAvailable: true,
        image:       "/images/meethipuri.png",
        categoryId:  puri.id,
      },
      

      // Drinks
      
      {
        name:        "Lemon Soda",
        description: "Fresh lemon with sparkling water and a pinch of black salt.",
        price:       90,
        isAvailable: true,
        image:       "/images/lemon.png",
        categoryId:  drinks.id,
      },
      // Drinks — Soda Flavours
      {
        name:        "Blueberry Soda",
        description: "Refreshing chilled soda with a burst of sweet blueberry flavour.",
        price:       90,
        isAvailable: true,
        isFeatured:  false,
        image:       "/images/blueberry.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Peach Soda",
        description: "Light and fruity peach flavoured soda — sweet and refreshing.",
        price:       90,
        isAvailable: true,
        image:       "/images/peach.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Apple Soda",
        description: "Crisp and tangy apple flavoured sparkling soda.",
        price:       90,
        isAvailable: true,
        image:       "/images/apple.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Vimto Soda",
        description: "Classic Vimto flavour with a sparkling fizzy twist.",
        price:       90,
        isAvailable: true,
        image:       "/images/vimto.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Pineapple Soda",
        description: "Tropical pineapple flavoured soda — sweet, tangy and fizzy.",
        price:       90,
        isAvailable: true,
        image:       "/images/pineapple.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Orange Soda",
        description: "Bright and zesty orange flavoured sparkling soda.",
        price:       90,
        isAvailable: true,
        image:       "/images/orange.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Raspberry Soda",
        description: "Sweet and tangy raspberry flavoured chilled soda.",
        price:       90,
        isAvailable: true,
        image:       "/images/rasberry.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Rose Soda",
        description: "Delicate rose flavoured soda — floral, sweet and refreshing.",
        price:       90,
        isAvailable: true,
        image:       "/images/rose.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Ice Cream Soda",
        description: "Creamy vanilla ice cream topped with fizzy soda — a classic treat.",
        price:       90,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/icecream.png",
        categoryId:  drinks.id,
      },
      {
        name:        "Lychee Soda",
        description: "Sweet and floral lychee flavoured soda — refreshing and exotic.",
        price:       90,
        isFeatured:  true,
        isAvailable: true,
        image:       "/images/lychee.png",
        categoryId:  drinks.id,
      },
      
    ],
  });

  console.log("✅ Foods created");
  console.log("🎉 Database seeded successfully!");
  console.log("");
  console.log("Admin login: admin@mamasoups.com");
 
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });