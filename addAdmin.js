require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const exists = await Admin.findOne({ username: 'sudharsan' });
    if (exists) {
      console.log('Admin already exists');
    } else {
      await Admin.create({ username: 'sudharsan', password: 'sudhar2006' });
      console.log('Admin created');
    }
    process.exit();
  })
  .catch(e => { console.error(e); process.exit(1); });
