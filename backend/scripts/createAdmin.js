// backend/scripts/createAdmin.js
require('dotenv').config({ path: './.env' }); // Asegúrate de que cargue el .env correctamente
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta desde scripts/

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('✅ Conectado a MongoDB');

        const adminUsername = 'Administrador';
        const adminPassword = '123456';

        // Verificar si el usuario admin ya existe
        let adminUser = await User.findOne({ username: adminUsername });

        if (adminUser) {
            console.log(`Usuario '${adminUsername}' ya existe. Actualizando rol a 'admin' si es necesario.`);
            adminUser.role = 'admin';
            // Si la contraseña cambia o quieres re-hashearla
            const isPasswordMatch = await bcrypt.compare(adminPassword, adminUser.password);
            if (!isPasswordMatch) {
                adminUser.password = await bcrypt.hash(adminPassword, 10);
            }
            await adminUser.save();
            console.log(`✅ Usuario '${adminUsername}' actualizado.`);
        } else {
            // Crear nuevo usuario admin
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            adminUser = new User({
                username: adminUsername,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log(`🎉 Usuario administrador '${adminUsername}' creado exitosamente.`);
        }

        console.log(`---------------------------------------------------`);
        console.log(`Para probar las funcionalidades de administrador:`);
        console.log(`Username: ${adminUsername}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`---------------------------------------------------`);

    } catch (error) {
        console.error('❌ Error al crear usuario administrador:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB.');
    }
};

createAdminUser();