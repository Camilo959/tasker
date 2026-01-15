import dotenv from "dotenv";
import app from "./app";
import { prisma } from "./config/db.config";

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});

// Manejo de cierre graceful
const gracefulShutdown = async () => {
  console.log("\n⚠️  Señal de cierre recibida. Cerrando servidor...");
  
  server.close(async () => {
    console.log("✅ Servidor HTTP cerrado");
    
    try {
      await prisma.$disconnect();
      console.log("✅ Conexión a base de datos cerrada");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error al cerrar conexión a DB:", error);
      process.exit(1);
    }
  });

  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error("⚠️  Cierre forzado después de timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);