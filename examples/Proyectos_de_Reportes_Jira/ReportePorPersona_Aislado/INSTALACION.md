# 🚀 Guía de Instalación - Mi Reporte Personal Automático

## 📋 Pasos de Instalación

### 1. Preparar Google Sheets

1. Abre [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Renómbrala a "Reporte por Persona - [Tu Nombre]"

### 2. Acceder a Apps Script

1. En la hoja de cálculo, ve a **Extensiones** → **Apps Script**
2. Se abrirá el editor de Google Apps Script
3. Elimina el archivo `Code.gs` por defecto

### 3. Crear Archivos del Sistema

Crea los siguientes archivos copiando exactamente el contenido:

#### Archivo 1: `01_Configuracion.gs`
```
Archivo → Nuevo → Script
Nombre: 01_Configuracion.gs
```
Copia todo el contenido del archivo `01_Configuracion.gs`

#### Archivo 2: `02_InterfazUsuario.gs`
```
Archivo → Nuevo → Script
Nombre: 02_InterfazUsuario.gs
```
Copia todo el contenido del archivo `02_InterfazUsuario.gs`

#### Archivo 3: `03_JiraAPI.gs`
```
Archivo → Nuevo → Script
Nombre: 03_JiraAPI.gs
```
Copia todo el contenido del archivo `03_JiraAPI.gs`

#### Archivo 4: `04_GeneradorReportes.gs`
```
Archivo → Nuevo → Script
Nombre: 04_GeneradorReportes.gs
```
Copia todo el contenido del archivo `04_GeneradorReportes.gs`

#### Archivo 5: `FechasDialog.html`
```
Archivo → Nuevo → HTML
Nombre: FechasDialog.html
```
Copia todo el contenido del archivo `FechasDialog.html`

### 4. Guardar el Proyecto

1. Haz clic en **💾 Guardar** (Ctrl+S)
2. Renombra el proyecto a "Reporte por Persona Aislado"
3. Haz clic en **Guardar**

### 5. Primera Configuración

1. Vuelve a Google Sheets (pestaña anterior)
2. **Recarga la página** (F5) para que aparezcan los menús
3. Verás dos nuevos menús:
   - **👤 Mi Reporte Personal** - Para generar reportes
   - **🛠️ Herramientas de Reporte** - Para organizar reportes por semanas

### 6. Configurar Credenciales de Jira

1. Ve al menú **👤 Mi Reporte Personal** → **🔐 Configurar Credenciales**
2. Ingresa tu **email de Jira** (ej: tu.email@computocontable.com)
3. Ingresa tu **API Token de Jira**

**IMPORTANTE**: El email que ingreses debe coincidir con tu email registrado en el equipo CCSOFT para que el sistema te identifique automáticamente.

#### 🔑 Para obtener tu API Token:
1. Ve a [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Haz clic en **"Create API token"**
3. Dale un nombre como "Google Sheets Reporte"
4. **Copia el token generado** (solo se muestra una vez)
5. Pégalo en el sistema

### 7. Probar la Instalación

1. Ve al menú **👤 Mi Reporte Personal** → **🧪 Probar Conexión**
2. Deberías ver un mensaje como:
   ```
   ✅ Conexión exitosa!
   🙋‍♂️ Usuario: Tu Nombre
   📧 Email: tu.email@computocontable.com
   🌐 Dominio: ccsoft.atlassian.net
   📊 Sistema listo para reportes por persona
   ```

### 8. Generar tu Primer Reporte Personal

1. Ve al menú **👤 Mi Reporte Personal** → **📊 Generar Mi Reporte**
2. Se abrirá un diálogo con calendarios para seleccionar fechas:
   - Usa los **botones rápidos** (ej: "Últimos 30 días") o
   - Selecciona fechas específicas con los **calendarios desplegables**
3. Haz clic en **📊 Generar Mi Reporte**
4. El sistema identificará automáticamente tu usuario y generará el reporte
5. Se creará una nueva hoja con tu reporte personalizado para el período seleccionado

**¡Interfaz súper amigable!** Calendarios nativos del navegador y botones de períodos rápidos.

### 9. Organizar Reporte por Semanas (Opcional)

Una vez que tengas un reporte generado:

1. Ve al menú **🛠️ Herramientas de Reporte** → **📅 Organizar por Semanas**
2. El sistema analizará las etiquetas "SEMANA_X" de tu reporte
3. Creará una nueva hoja organizada por semanas con sumas automáticas
4. Los tiempos se convertirán automáticamente de segundos a horas

**¡Organización automática!** Agrupación por semanas con cálculos automáticos.

## ✅ Verificación de Instalación

### Lista de Verificación:
- [ ] Google Sheets creado
- [ ] 4 archivos .gs y 1 archivo .html creados en Apps Script
- [ ] Proyecto guardado con el nombre correcto
- [ ] Menús "👤 Mi Reporte Personal" y "🛠️ Herramientas de Reporte" visibles en Google Sheets
- [ ] Credenciales de Jira configuradas (email debe coincidir con equipo CCSOFT)
- [ ] Prueba de conexión exitosa
- [ ] Diálogo de selección de fechas se abre correctamente
- [ ] Primer reporte personal generado con fechas personalizadas
- [ ] Herramienta de organización por semanas funciona correctamente

### Problemas Comunes:

#### ❌ "No aparece el menú"
**Solución**: Recarga la página de Google Sheets (F5)

#### ❌ "Error de credenciales"
**Solución**: 
- Verifica que el email sea correcto
- Regenera el API Token en Atlassian
- Asegúrate de usar el dominio correcto (ccsoft)

#### ❌ "No se encuentran datos"
**Solución**:
- Verifica que tengas registros de trabajo en Jira
- Confirma que estés en el equipo CCSOFT configurado
- Revisa que el período incluya actividad reciente

#### ❌ "Error de permisos"
**Solución**:
- Asegúrate de tener acceso a los proyectos en Jira
- Verifica que el API Token tenga los permisos necesarios
- Contacta al administrador de Jira si es necesario

## 🎯 Resultado Esperado

Después de la instalación exitosa tendrás:

1. **Sistema Funcional**: Menú completo en Google Sheets
2. **Conexión a Jira**: Validada y operativa  
3. **Reporte Individual**: Capacidad de generar reportes por persona
4. **Interface Amigable**: Sidebar para selección fácil de personas
5. **Formato Profesional**: Reportes con estadísticas y formato corporativo

## 📞 Soporte Post-Instalación

Si encuentras problemas:

1. **Revisa los logs**: En Apps Script → Ver → Registros
2. **Usa la ayuda integrada**: Menú → 📖 Ayuda
3. **Verifica la configuración**: Menú → 🧪 Probar Conexión

---

¡Felicidades! 🎉 Tu sistema de Reporte por Persona está listo para usar.