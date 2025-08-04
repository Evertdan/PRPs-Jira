# 🚀 Instalación del Sistema de Reportes Jira

## 📋 Orden de Instalación de Archivos

Para evitar errores de sintaxis, instala los archivos en Google Apps Script en este orden:

### 1. Archivos Base (Sin dependencias)
```
1. config.gs
2. error-handler.gs
```

### 2. Archivos de Lógica
```
3. credentials-manager.gs
4. jira-api.gs
5. report-generator.gs
6. ui-manager.gs
```

### 3. Archivo Principal
```
7. main.gs
```

### 4. Archivos Opcionales
```
- config-example.gs (SOLO como referencia - NO instalar)
- code.gs (archivo original - mantener como backup)
```

## ⚠️ Problemas Comunes y Soluciones

### Error: "Identifier 'CONFIG_JIRA' has already been declared"
**Causa:** Tienes tanto `config.gs` como `config-example.gs` instalados
**Solución:** Elimina o renombra `config-example.gs`

### Error: "SyntaxError" durante la inicialización
**Causa:** Archivos instalados en orden incorrecto
**Solución:** 
1. Elimina todos los archivos
2. Reinstala en el orden especificado arriba

### Error: "TypeError: Cannot read property"
**Causa:** Un archivo depende de otro que no se ha cargado
**Solución:** Refresca la página y espera unos segundos para que se carguen todos los módulos

## 🔧 Configuración Post-Instalación

1. **Abre Google Sheets** con el script instalado
2. **Espera** a que aparezca el menú "📊 Indicadores"
3. **Primer uso:** Aparecerá mensaje de bienvenida
4. **Configura credenciales:**
   - Email de Jira
   - API Token (obtén en: https://id.atlassian.com/manage-profile/security/api-tokens)
5. **Selecciona proyecto** de la lista disponible
6. **¡Listo para usar!**

## 🧪 Verificación de Instalación

Usa estas funciones del menú para verificar:

1. **"👀 Ver Configuración"** - Verifica estado de credenciales
2. **"🔗 Test Conexión"** - Prueba conectividad con Jira  
3. **"🔍 Diagnóstico Completo"** - Análisis detallado del sistema

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en: **Ver > Registros de ejecución**
2. Ejecuta **"🔍 Diagnóstico Completo"**
3. Verifica que todos los archivos estén instalados en el orden correcto