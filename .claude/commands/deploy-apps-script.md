## /deploy-apps-script

Guía para deployment y distribución de Apps Script.

### Argumentos: $DEPLOYMENT_TYPE

Proporciona guía completa para el deployment del proyecto Apps Script con integración Atlassian.

**TIPO DE DEPLOYMENT:** $DEPLOYMENT_TYPE (development/staging/production)

**PASOS DE DEPLOYMENT:**

1. **Pre-deployment**
   - Validar configuración
   - Ejecutar tests completos
   - Verificar permisos y scopes
   - Revisar seguridad de credenciales

2. **Configuración de Entorno**
   - Setup de propiedades por entorno
   - Configuración de triggers si aplica
   - Setup de logging y monitoring

3. **Deployment**
   - Crear versiones en Apps Script
   - Configurar permisos de ejecución
   - Setup de triggers automáticos
   - Configurar notificaciones

4. **Post-deployment**
   - Tests de smoke en producción
   - Monitoreo inicial
   - Documentación de rollback
   - Training de usuarios si aplica

**CONSIDERACIONES ESPECÍFICAS:**
- Manejo de múltiples entornos (dev/staging/prod)
- Migración de datos si es necesario
- Backup de configuraciones
- Monitoreo de límites y quotas

Proporciona la guía paso a paso para el tipo de deployment especificado.


