const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database tables...');
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial data...');

  // 1. Create Default Users
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('adminpassword', salt);
  const hashedCustomerPassword = await bcrypt.hash('customerpassword', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'RP Admin',
      email: 'admin@rpnatural.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Ranindu Silva',
      email: 'customer@gmail.com',
      password: hashedCustomerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log(`Created users: Admin (${admin.email}), Customer (${customer.email})`);

  // 2. Create Categories
  const herbalTeaCat = await prisma.category.create({
    data: { name: 'Herbal Tea', slug: 'herbal-tea', description: 'Traditional Sri Lankan herbal teas made from local leaves.' }
  });

  const wellnessTeaCat = await prisma.category.create({
    data: { name: 'Wellness Tea', slug: 'wellness-tea', description: 'Teas crafted to boost daily stamina and overall body health.' }
  });

  const essentialOilCat = await prisma.category.create({
    data: { name: 'Essential Oil', slug: 'essential-oil', description: 'Concentrated natural plant extracts for topical and aromatherapy use.' }
  });

  const naturalTeaCat = await prisma.category.create({
    data: { name: 'Natural Tea', slug: 'natural-tea', description: 'Pure unblended wild tea selections.' }
  });

  console.log('Created product categories.');

  // 3. Create Products with multiple images and detailed specifications
  const productsData = [
    {
      name: 'Lemongrass Tea',
      slug: 'lemongrass-tea',
      description: 'Refreshing and aromatic lemongrass tea, hand-harvested from local gardens of Sri Lanka. Known for its soothing citrus notes and detoxifying capabilities.',
      price: 950,
      discount: 10, // 10% off
      stockStatus: 'IN_STOCK',
      ingredients: '100% Pure Dehydrated Sri Lankan Lemongrass (Cymbopogon citratus)',
      healthBenefits: 'Supports digestion, boosts metabolism, reduces bloating, and is rich in antioxidants that fight free radicals.',
      usageInstructions: 'Steep 1 tea bag or 1 teaspoon of loose lemongrass in boiling water for 5-7 minutes. Add honey if desired.',
      warnings: 'Consult a physician before use if pregnant, lactating, or taking medication.',
      categoryId: herbalTeaCat.id,
      imageUrl: '/images/lemongrass-tea.png'
    },
    {
      name: 'Green Tea',
      slug: 'green-tea',
      description: 'Premium whole leaf green tea sourced from high-altitude estates in Nuwara Eliya. Offers a light, grassy taste and clean energy boost.',
      price: 1000,
      stockStatus: 'IN_STOCK',
      ingredients: 'Organic Camellia sinensis green tea leaves',
      healthBenefits: 'Enhances cognitive function, aids weight management, supports heart health, and offers a steady release of focus.',
      usageInstructions: 'Brew in hot water (around 80°C) for 2-3 minutes. Do not use boiling water to avoid bitterness.',
      warnings: 'Contains caffeine. Not recommended for those highly sensitive to caffeine late in the evening.',
      categoryId: wellnessTeaCat.id,
      imageUrl: '/images/green-tea.png'
    },
    {
      name: 'Curry Leaves Tea',
      slug: 'curry-leaves-tea',
      description: 'A unique health infusion prepared from Sri Lankan Curry Leaves (Karapincha). Traditionally utilized in Ceylon Ayurveda to maintain cholesterol and blood sugar balance.',
      price: 900,
      stockStatus: 'IN_STOCK',
      ingredients: 'Dehydrated organic Curry leaves (Murraya koenigii)',
      healthBenefits: 'Supports healthy hair growth, cleanses liver toxins, helps regulate blood glucose levels, and improves iron absorption.',
      usageInstructions: 'Steep one tea bag in hot boiling water for 5 minutes. Best consumed on an empty stomach in the morning.',
      warnings: 'None recorded. Suitable for daily dietary supplementation.',
      categoryId: herbalTeaCat.id,
      imageUrl: '/images/curry-leaves.png'
    },
    {
      name: 'Cinnamon Leaf Oil',
      slug: 'cinnamon-leaf-oil',
      description: '100% pure steam-distilled Ceylon Cinnamon Leaf Oil. Characterized by a warm, spicy scent, it serves as a powerful antiseptic and relaxant.',
      price: 1200,
      discount: 5,
      stockStatus: 'IN_STOCK',
      ingredients: '100% Pure Steam-Distilled Cinnamomum verum Leaf Oil',
      healthBenefits: 'Acts as an anti-inflammatory, reduces stress, purifies air when diffused, and relieves muscular pains when massaged.',
      usageInstructions: 'Aromatherapy: Add 3-4 drops to a diffuser. Massage: Dilute 2-3 drops in a carrier oil (like coconut or jojoba) before applying to skin.',
      warnings: 'For external use only. Never apply directly to skin undiluted. Keep out of reach of children and avoid contact with eyes.',
      categoryId: essentialOilCat.id,
      imageUrl: '/images/cinnamon-oil.png'
    },
    {
      name: 'Heen Bovitiya Tea',
      slug: 'heen-bovitiya-tea',
      description: 'A highly treasured Ayurvedic herb (Osbeckia octandra) endemic to Sri Lanka. Famed as a supreme liver tonic that naturally protects and regenerates liver cells.',
      price: 950,
      stockStatus: 'LOW_STOCK',
      ingredients: 'Dehydrated Heen Bovitiya leaves and bark extract',
      healthBenefits: 'Promotes healthy liver enzyme levels, helps treat jaundice symptoms, aids detoxification, and controls hyperacidity.',
      usageInstructions: 'Add one bag to hot boiling water and let brew covered for 8 minutes. Take before principal meals.',
      warnings: 'Individuals undergoing active medical treatments for liver failure should discuss usage with their doctor first.',
      categoryId: herbalTeaCat.id,
      imageUrl: '/images/heen-bovitiya.png'
    },
    {
      name: 'Herbal Tea Mix',
      slug: 'herbal-tea-mix',
      description: 'A premium wellness blend combining Lemongrass, Ginger, Cinnamon, and Cardamom. Delivers a heartwarming, spiced tea experience designed to strengthen immunity.',
      price: 1050,
      stockStatus: 'IN_STOCK',
      ingredients: 'Lemongrass, Dry Ginger, Ceylon Cinnamon pieces, Cardamom pods',
      healthBenefits: 'Warmth relieves cold symptoms, boosts immune defenses, stimulates appetite, and relieves throat soreness.',
      usageInstructions: 'Infuse in boiling water for 6 minutes. Excellent served hot with a slice of lemon or sweetener.',
      warnings: 'None. Safe for all age groups.',
      categoryId: naturalTeaCat.id,
      imageUrl: '/images/herbal-tea.png'
    }
  ];

  for (const item of productsData) {
    const { imageUrl, ...prodInfo } = item;
    const prod = await prisma.product.create({
      data: prodInfo
    });

    // Seed primary image
    await prisma.productImage.create({
      data: {
        url: imageUrl,
        productId: prod.id,
        isPrimary: true
      }
    });

    // Seed secondary dummy image if needed
    await prisma.productImage.create({
      data: {
        url: '/images/sdsd.png',
        productId: prod.id,
        isPrimary: false
      }
    });
  }

  console.log('Seeded products and product images.');

  // 4. Create Articles (Health Library)
  const articlesData = [
    {
      title: 'Benefits of Lemongrass Tea',
      slug: 'benefits-of-lemongrass-tea',
      category: 'Digestive Wellness',
      content: 'Lemongrass tea is a wonderful, citrus-flavored herbal brew that has been used in Sri Lankan households for centuries. In Ayurveda, lemongrass is regarded as a cleansing herb that balances bodily temperature and kindles the digestive fire. \n\nScientific studies show that lemongrass contains key compounds like citral and geraniol, which have strong anti-inflammatory and antimicrobial properties. Regular consumption can assist in soothing bloating, flushing excess water weight from the system, and lowering cholesterol level. \n\nTo prepare, simply steep fresh or dried lemongrass stalks in hot boiling water for 5-7 minutes. It can be taken hot, or chilled with ice and mint leaves for a refreshing summer detox drink.',
      featuredImage: '/images/lemongrass-tea.png',
      author: 'Dr. Sanduni Perera (Ayurvedic Practitioner)',
      readTime: '4 min read'
    },
    {
      title: 'Cinnamon Tea and Digestion',
      slug: 'cinnamon-tea-and-digestion',
      category: 'Gut Health',
      content: 'Ceylon Cinnamon (true cinnamon) is renowned worldwide for its low coumarin levels and sweet, delicate flavor. Beyond baking, cinnamon makes an exceptional herbal infusion that acts as a therapeutic tonic for the gastrointestinal tract. \n\nDrinking cinnamon tea stimulates the secretion of saliva and gastric enzymes, which actively assists in food breakdown. It reduces gas, treats stomach cramping, and regulates bowel movements. For those struggling with blood sugar spikes after meals, cinnamon helps slow down glucose absorption, supporting metabolic health. \n\nSimply steep a Ceylon cinnamon stick in hot water, add a dash of black tea if preferred, and enjoy after a heavy meal to alleviate discomfort.',
      featuredImage: '/images/cinnamon-oil.png',
      author: 'Prof. Kingsley de Alwis',
      readTime: '5 min read'
    },
    {
      title: 'Herbal Drinks for Immunity',
      slug: 'herbal-drinks-for-immunity',
      category: 'Immunity Boost',
      content: 'With changing weather patterns, strengthening our baseline immune defense is critical. Sri Lankan Ayurveda offers a wealth of herbs specifically designated for "Ojas" or vital energy and immunity. \n\nFormulas containing Ginger, Coriander seeds, and Lemongrass act as natural defensive shields. Ginger acts as an anti-congestive, while coriander seeds are excellent anti-pyretics (reducing body heat). Combining these with local black tea or brewing them as a warm herbal infusion provides immediate relief from nasal blockages, sore throats, and seasonal fatigue. \n\nIntegrating at least one herbal wellness tea into your daily schedule is an excellent preventative lifestyle habit.',
      featuredImage: '/images/herbal-tea.png',
      author: 'Dr. Sanduni Perera (Ayurvedic Practitioner)',
      readTime: '6 min read'
    },
    {
      title: 'Natural Oils and Their Uses',
      slug: 'natural-oils-and-their-uses',
      category: 'Aromatherapy',
      content: 'Essential oils extracted from local Sri Lankan plants like Cinnamon, Citronella, and Cardamom are concentrated packages of wellness. Understanding how to use them safely is the key to unlocking their aromatic power. \n\n1. Cinnamon Leaf Oil: Best for diffusing during cold months to cleanse the air and create a cozy atmosphere. Can also be diluted in carrier oils for muscular massage. \n\n2. Citronella Oil: Excellent natural insect repellent. Diffused outdoors, it keeps pests at bay while offering an uplifting lemony scent. \n\n3. Ginger Oil: Excellent when applied (diluted) to sore joints or used in steam inhalations for sinus blockages. \n\nRemember, pure essential oils should never be consumed internally and should always be diluted with a carrier oil before skin application to prevent irritation.',
      featuredImage: '/images/cinnamon-oil.png',
      author: 'W. G. Jayasekara (Wellness Coach)',
      readTime: '7 min read'
    }
  ];

  for (const article of articlesData) {
    await prisma.article.create({
      data: article
    });
  }

  console.log('Seeded Health Library articles.');

  // 5. Create Testimonials
  const testimonialsData = [
    {
      userName: 'Prasanna Bandara',
      userRole: 'Aromatherapist',
      rating: 5,
      comment: 'The Cinnamon Leaf Oil from RP Natural Product is exceptional. Very pure, strong scent profile, and works perfectly in my wellness sessions.'
    },
    {
      userName: 'Nisansala Senanayake',
      userRole: 'Yoga Teacher',
      rating: 5,
      comment: 'Their Lemongrass Tea has become a post-yoga routine for my students. Clean taste, wonderful aroma, and absolutely refreshing.'
    },
    {
      userName: 'David Miller',
      userRole: 'Wellness Enthusiast',
      rating: 4,
      comment: 'High quality Ceylon wellness products. Excellent response from support, and shipping tracking was accurate. Will buy again!'
    }
  ];

  for (const testimonial of testimonialsData) {
    await prisma.testimonial.create({
      data: testimonial
    });
  }

  console.log('Seeded Customer Testimonials.');
  console.log('Database Seeding Completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
