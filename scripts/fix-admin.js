const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = './data';
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const password = 'admin123';
const passwordHash = bcrypt.hashSync(password, 10);

const adminData = [
  {
    id: '1',
    email: 'admin@travelhub.com',
    password: passwordHash,
    name: 'Super Admin'
  }
];

fs.writeFileSync('./data/admins.json', JSON.stringify(adminData, null, 2));
console.log('✅ Admin updated with fresh password hash');