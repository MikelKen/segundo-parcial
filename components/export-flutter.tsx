import JSZip from "jszip";
import { saveAs } from "file-saver";

// Función para generar el archivo ZIP
export const generateAndDownloadZip = (flutterCode: string) => {
  // 1. Crear instancia de ZIP
  const zip = new JSZip();

  // 2. Agregar main.dart con el código Flutter
  zip.file("main.dart", flutterCode);

  // 3. Agregar el archivo batch
  zip.file("flutter.bat", generateBatchScript());

  // 4. Agregar el README
  zip.file("README.txt", generateReadmeContent());

  // 5. Generar y descargar el ZIP
  zip.generateAsync({ type: "blob" }).then((content: any) => {
    saveAs(content, "flutter_project.zip");
  });
};

// Genera el contenido del script batch
const generateBatchScript = () => {
  return `@echo off
setlocal enabledelayedexpansion

set PROJECT_DIR=my_flutter_app
set MAIN_DART_PATH=%PROJECT_DIR%\\lib\\main.dart
set GENERATED_MAIN_DART=main.dart

REM 1. Crear proyecto si no existe
if not exist "%PROJECT_DIR%" (
    echo 🛠 Creando proyecto Flutter...
    flutter create %PROJECT_DIR%
)

REM 2. Copiar archivo principal
echo 🔄 Reemplazando main.dart...
copy /Y "%GENERATED_MAIN_DART%" "%MAIN_DART_PATH%"

REM 3. Entrar al directorio del proyecto
cd /D %PROJECT_DIR%

REM 4. Instalar dependencias
echo 📦 Instalando dependencias...
flutter pub get

REM 5. Verificar entorno
echo 🔍 Verificando entorno Flutter...
flutter --version
flutter doctor

REM 6. Buscar dispositivos disponibles
echo 📱 Buscando dispositivos conectados...
flutter devices

endlocal`;
};

// Genera el contenido del README
const generateReadmeContent = () => {
  return `INSTRUCCIONES PARA EJECUTAR EL PROYECTO FLUTTER

1. EXTRACCIÓN
   - Extrae todo el contenido del ZIP en una carpeta

2. EJECUCIÓN (Windows)
   - Doble clic en 'flutter.bat'
   - O desde terminal:
        flutter.bat

3. REQUISITOS PREVIOS
   - Flutter SDK instalado y en PATH
   - Dispositivo conectado o emulador ejecutándose

4. OPCIONES AVANZADAS
   - Para ejecutar en dispositivo específico:
        flutter run -d [device_id]
   - Para crear APK:
        flutter build apk

5. SOPORTE
   - Si falla la creación: Ejecutar 'flutter doctor'
   - Si fallan dependencias: Ejecutar 'flutter pub get' dentro de la carpeta del proyecto
   - Si no detecta dispositivos: Verificar conexión USB o emulador

¡Tu app Flutter debería estar ejecutándose ahora!`;
};

// Componente de botón para usar en tu UI
export const DownloadZipButton = ({ flutterCode }: { flutterCode: string }) => {
  const handleDownload = () => {
    generateAndDownloadZip(flutterCode);
  };

  return (
    <button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Descargar Proyecto Completo (ZIP)
    </button>
  );
};
