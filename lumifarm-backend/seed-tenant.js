require('dotenv').config();
const mongoose = require('mongoose');

const ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@lumifarm.co.ke';
const TENANT_NAME = 'lumifarm';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Create tenant schema
  const tenantSchema = new mongoose.Schema({}, { strict: false, collection: 'tenants' });
  const Tenant = mongoose.model('TenantSeed', tenantSchema);

  // Create user schema
  const userSchema = new mongoose.Schema({}, { strict: false, collection: 'rentiumusers' });
  const User = mongoose.model('UserSeed', userSchema);

  // Check if tenant exists
  const existing = await Tenant.findOne({ slug: TENANT_NAME.toLowerCase() });
  if (existing) {
    console.log('Tenant "lumifarm" already exists.');
    console.log('  ID:   ', existing._id);
    console.log('  Name: ', existing.name);
    await mongoose.disconnect();
    return;
  }

  // Find admin user
  const adminUser = await User.findOne({ email: ADMIN_EMAIL });
  if (!adminUser) {
    console.error(`Admin user with email ${ADMIN_EMAIL} not found. Please run seed-super-admin.js first.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Create tenant
  const tenant = await Tenant.create({
    name: TENANT_NAME,
    slug: TENANT_NAME.toLowerCase(),
    contactEmail: ADMIN_EMAIL,
    plan: 'free',
    isActive: true,
    maxUsers: 10,
    maxProperties: 50,
    maxFarms: 100,
    ownerUserId: adminUser._id,
    members: [adminUser._id],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  });

  console.log('✓ Tenant created successfully!');
  console.log('  ID:   ', tenant._id);
  console.log('  Name: ', tenant.name);
  console.log('  Slug: ', tenant.slug);

  // Update admin user to include this tenant
  await User.updateOne(
    { _id: adminUser._id },
    {
      $addToSet: { tenantIds: tenant._id },
      activeTenantId: tenant._id,
    }
  );

  console.log('✓ Admin user linked to tenant');
  await mongoose.disconnect();
  console.log('\nYou can now create farms in the Lumifarm application!');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
