import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@zoocasa.com" },
    update: {},
    create: {
      email: "admin@zoocasa.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
      bio: "Site administrator",
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create default categories matching Zoocasa blog
  const categories = [
    { name: "For Buyers", slug: "for-buyers", color: "#4695c4", order: 1 },
    { name: "For Sellers", slug: "for-sellers", color: "#b48e57", order: 2 },
    { name: "Real Estate News", slug: "real-estate-news", color: "#2d7a4c", order: 3 },
    { name: "Mortgage News", slug: "mortgage-news", color: "#d97748", order: 4 },
    { name: "Free Guides (PDF)", slug: "free-guides-pdf", color: "#9b59b6", order: 5 },
    { name: "Infographics", slug: "infographics", color: "#e74c3c", order: 6 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✅ Created category: ${category.name}`);
  }

  // Create default theme settings
  await prisma.themeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      primaryColor: "#4695c4",
      secondaryColor: "#b48e57",
      backgroundColor: "#ffffff",
      textColor: "#403d39",
      headingColor: "#252422",
      headingFont: "Frank Ruhl Libre",
      bodyFont: "Muli",
      headerLayout: "default",
      footerLayout: "default",
    },
  });

  console.log("✅ Created default theme settings");

  // Create default popup settings
  await prisma.popupSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      enabled: true,
      title: "Subscribe to Our Newsletter",
      description: "Get the latest real estate insights delivered to your inbox",
      ctaText: "Subscribe",
      frequency: "ONCE_PER_SESSION",
      delaySeconds: 5,
      showAfterScroll: 50,
      backgroundColor: "#ffffff",
      textColor: "#000000",
      buttonColor: "#4695c4",
    },
  });

  console.log("✅ Created default popup settings");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
