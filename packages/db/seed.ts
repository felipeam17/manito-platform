import { PrismaClient, Role, KycStatus, PricingType, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "plomeria" },
      update: {},
      create: {
        name: "Plomería",
        slug: "plomeria",
        icon: "🔧",
      },
    }),
    prisma.category.upsert({
      where: { slug: "electricidad" },
      update: {},
      create: {
        name: "Electricidad",
        slug: "electricidad",
        icon: "⚡",
      },
    }),
    prisma.category.upsert({
      where: { slug: "pintura" },
      update: {},
      create: {
        name: "Pintura",
        slug: "pintura",
        icon: "🎨",
      },
    }),
    prisma.category.upsert({
      where: { slug: "jardineria" },
      update: {},
      create: {
        name: "Jardinería",
        slug: "jardineria",
        icon: "🌱",
      },
    }),
    prisma.category.upsert({
      where: { slug: "limpieza" },
      update: {},
      create: {
        name: "Limpieza",
        slug: "limpieza",
        icon: "🧹",
      },
    }),
  ]);

  console.log("✅ Categories created");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@manito.com" },
    update: {},
    create: {
      email: "admin@manito.com",
      name: "Admin MANITO",
      role: Role.ADMIN,
      kycStatus: KycStatus.APPROVED,
    },
  });

  console.log("✅ Admin user created");

  // Create professional users
  const pros = await Promise.all([
    prisma.user.upsert({
      where: { email: "plomero1@manito.com" },
      update: {},
      create: {
        email: "plomero1@manito.com",
        name: "Carlos Mendoza",
        phone: "+50712345678",
        role: Role.PRO,
        kycStatus: KycStatus.APPROVED,
        ratingAvg: 4.8,
        ratingCount: 25,
        proProfile: {
          create: {
            bio: "Plomero con 10 años de experiencia. Especializado en reparaciones domésticas y comerciales.",
            serviceRadiusKm: 25,
            coverageCities: ["Panama City", "San Miguelito"],
            availability: {
              monday: { start: "08:00", end: "18:00" },
              tuesday: { start: "08:00", end: "18:00" },
              wednesday: { start: "08:00", end: "18:00" },
              thursday: { start: "08:00", end: "18:00" },
              friday: { start: "08:00", end: "18:00" },
              saturday: { start: "09:00", end: "15:00" },
              sunday: { start: "09:00", end: "15:00" },
            },
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: "electricista1@manito.com" },
      update: {},
      create: {
        email: "electricista1@manito.com",
        name: "Roberto Silva",
        phone: "+50787654321",
        role: Role.PRO,
        kycStatus: KycStatus.APPROVED,
        ratingAvg: 4.9,
        ratingCount: 18,
        proProfile: {
          create: {
            bio: "Electricista certificado. Instalaciones residenciales y comerciales.",
            serviceRadiusKm: 30,
            coverageCities: ["Panama City", "Arraiján"],
            availability: {
              monday: { start: "07:00", end: "17:00" },
              tuesday: { start: "07:00", end: "17:00" },
              wednesday: { start: "07:00", end: "17:00" },
              thursday: { start: "07:00", end: "17:00" },
              friday: { start: "07:00", end: "17:00" },
              saturday: { start: "08:00", end: "14:00" },
              sunday: { start: "08:00", end: "14:00" },
            },
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: "pintor1@manito.com" },
      update: {},
      create: {
        email: "pintor1@manito.com",
        name: "Miguel Torres",
        phone: "+50755555555",
        role: Role.PRO,
        kycStatus: KycStatus.APPROVED,
        ratingAvg: 4.7,
        ratingCount: 32,
        proProfile: {
          create: {
            bio: "Pintor profesional con experiencia en interiores y exteriores.",
            serviceRadiusKm: 20,
            coverageCities: ["Panama City"],
            availability: {
              monday: { start: "08:00", end: "18:00" },
              tuesday: { start: "08:00", end: "18:00" },
              wednesday: { start: "08:00", end: "18:00" },
              thursday: { start: "08:00", end: "18:00" },
              friday: { start: "08:00", end: "18:00" },
              saturday: { start: "09:00", end: "16:00" },
              sunday: { start: "09:00", end: "16:00" },
            },
          },
        },
      },
    }),
  ]);

  console.log("✅ Professional users created");

  // Create client users
  const clients = await Promise.all([
    prisma.user.upsert({
      where: { email: "cliente1@manito.com" },
      update: {},
      create: {
        email: "cliente1@manito.com",
        name: "Ana García",
        phone: "+50711111111",
        role: Role.CLIENT,
        kycStatus: KycStatus.APPROVED,
        addresses: {
          create: [
            {
              label: "Casa",
              line1: "Calle 50, Edificio Plaza 2000",
              line2: "Apartamento 15B",
              city: "Panama City",
              state: "Panamá",
              lat: 8.9833,
              lng: -79.5167,
              isDefault: true,
            },
          ],
        },
      },
    }),
    prisma.user.upsert({
      where: { email: "cliente2@manito.com" },
      update: {},
      create: {
        email: "cliente2@manito.com",
        name: "Luis Rodríguez",
        phone: "+50722222222",
        role: Role.CLIENT,
        kycStatus: KycStatus.APPROVED,
        addresses: {
          create: [
            {
              label: "Oficina",
              line1: "Avenida Balboa, Torre Global Bank",
              line2: "Piso 12",
              city: "Panama City",
              state: "Panamá",
              lat: 8.9667,
              lng: -79.5333,
              isDefault: true,
            },
          ],
        },
      },
    }),
  ]);

  console.log("✅ Client users created");

  // Create services
  const services = await Promise.all([
    // Plomería services
    prisma.service.create({
      data: {
        categoryId: categories[0].id,
        proId: pros[0].id,
        title: "Reparación de grifos",
        description: "Reparación y mantenimiento de grifos, llaves y válvulas.",
        pricingType: PricingType.FIXED,
        price: 2500, // $25.00
        durationMin: 60,
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[0].id,
        proId: pros[0].id,
        title: "Desatascado de tuberías",
        description: "Desatascado profesional de tuberías y drenajes.",
        pricingType: PricingType.FIXED,
        price: 3500, // $35.00
        durationMin: 90,
      },
    }),
    // Electricidad services
    prisma.service.create({
      data: {
        categoryId: categories[1].id,
        proId: pros[1].id,
        title: "Instalación de tomas eléctricas",
        description: "Instalación de tomas eléctricas nuevas en hogares y oficinas.",
        pricingType: PricingType.FIXED,
        price: 3000, // $30.00
        durationMin: 120,
      },
    }),
    prisma.service.create({
      data: {
        categoryId: categories[1].id,
        proId: pros[1].id,
        title: "Reparación de circuitos",
        description: "Diagnóstico y reparación de circuitos eléctricos.",
        pricingType: PricingType.HOURLY,
        price: 2000, // $20.00 per hour
        durationMin: 60,
      },
    }),
    // Pintura services
    prisma.service.create({
      data: {
        categoryId: categories[2].id,
        proId: pros[2].id,
        title: "Pintura de interiores",
        description: "Pintura profesional de paredes interiores.",
        pricingType: PricingType.HOURLY,
        price: 1500, // $15.00 per hour
        durationMin: 240,
      },
    }),
  ]);

  console.log("✅ Services created");

  // Create inventory items
  const inventoryItems = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        proId: pros[0].id,
        sku: "GRIFO-001",
        name: "Grifo de cocina",
        description: "Grifo estándar para cocina",
        stock: 5,
        minAlert: 2,
        costCents: 5000, // $50.00
        unit: "pcs",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        proId: pros[1].id,
        sku: "TOMA-001",
        name: "Toma eléctrica",
        description: "Toma eléctrica estándar",
        stock: 20,
        minAlert: 5,
        costCents: 800, // $8.00
        unit: "pcs",
      },
    }),
    prisma.inventoryItem.create({
      data: {
        proId: pros[2].id,
        sku: "PINT-001",
        name: "Pintura blanca",
        description: "Pintura blanca para interiores",
        stock: 10,
        minAlert: 3,
        costCents: 2500, // $25.00
        unit: "gal",
      },
    }),
  ]);

  console.log("✅ Inventory items created");

  // Create some bookings
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        clientId: clients[0].id,
        proId: pros[0].id,
        serviceId: services[0].id,
        addressId: (await prisma.address.findFirst({ where: { userId: clients[0].id } }))?.id || '',
        startAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        endAt: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        status: BookingStatus.CONFIRMED,
        notes: "El grifo de la cocina está goteando",
        priceCents: 2500,
        commissionCents: 250, // 10% commission
      },
    }),
    prisma.booking.create({
      data: {
        clientId: clients[1].id,
        proId: pros[1].id,
        serviceId: services[2].id,
        addressId: (await prisma.address.findFirst({ where: { userId: clients[1].id } }))?.id || '',
        startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Day after tomorrow + 2 hours
        status: BookingStatus.PENDING,
        notes: "Necesito instalar una toma eléctrica en la oficina",
        priceCents: 3000,
        commissionCents: 300, // 10% commission
      },
    }),
  ]);

  console.log("✅ Bookings created");

  // Create commissions
  const commissions = await Promise.all([
    prisma.commission.create({
      data: {
        categoryId: categories[0].id,
        percentage: 0.10, // 10%
      },
    }),
    prisma.commission.create({
      data: {
        categoryId: categories[1].id,
        percentage: 0.12, // 12%
      },
    }),
    prisma.commission.create({
      data: {
        categoryId: categories[2].id,
        percentage: 0.08, // 8%
      },
    }),
    prisma.commission.create({
      data: {
        categoryId: categories[3].id,
        percentage: 0.10, // 10%
      },
    }),
    prisma.commission.create({
      data: {
        categoryId: categories[4].id,
        percentage: 0.15, // 15%
      },
    }),
  ]);

  console.log("✅ Commissions created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
