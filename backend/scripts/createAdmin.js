// backend/scripts/createAdmin.js

// Carga las variables de entorno desde el archivo .env
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Asegura la ruta correcta al modelo de Usuario

/**
 * Script para crear o actualizar un usuario administrador por defecto.
 * Útil para configuraciones de "zero-config" o entornos de desarrollo/pruebas.
 */
const createAdminUser = async () => {
    try {
        // Conexión a la base de datos MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        const adminUsername = 'Administrador';
        const adminPassword = '123456';

        // Busca si el usuario administrador ya existe en la base de datos
        let adminUser = await User.findOne({ username: adminUsername });

        if (adminUser) {
            // Si el usuario existe, se asegura de que tenga el rol 'admin' y actualiza la contraseña si es diferente
            console.log(`Usuario '${adminUsername}' ya existe. Asegurando rol 'admin' y verificando contraseña.`);
            adminUser.role = 'admin';
            
            // Verifica si la contraseña actual del usuario coincide con la contraseña por defecto
            const isPasswordMatch = await bcrypt.compare(adminPassword, adminUser.password);
            if (!isPasswordMatch) {
                // Hashea y actualiza la contraseña si no coincide
                adminUser.password = await bcrypt.hash(adminPassword, 10);
            }
            await adminUser.save();
            console.log(`✅ Usuario '${adminUsername}' actualizado correctamente.`);
        } else {
            // Si el usuario no existe, lo crea con el rol 'admin'
            console.log(`Creando nuevo usuario administrador '${adminUsername}'.`);
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            adminUser = new User({
                username: adminUsername,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log(`🎉 Usuario administrador '${adminUsername}' creado exitosamente.`);
        }

        // Muestra las credenciales por consola para facilitar las pruebas
        console.log(`\n---------------------------------------------------`);
        console.log(`👉 Credenciales del Administrador (para pruebas):`);
        console.log(`   Username: ${adminUsername}`);
        console.log(`   Password: ${adminPassword}`);
        console.log(`---------------------------------------------------\n`);

    } catch (error) {
        console.error('❌ Error al ejecutar el script de creación de administrador:', error);
    } finally {
        // Asegura que la conexión a la base de datos se cierre al finalizar
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB.');
    }
};

// Ejecuta la función principal del script
createAdminUser();