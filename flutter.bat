@echo off
setlocal enabledelayedexpansion

set PROJECT_DIR=my_flutter_app
set MAIN_DART_PATH=%PROJECT_DIR%\lib\main.dart
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

REM 4. Instalar dependencias (después de copiar main.dart)
echo 📦 Instalando dependencias...
flutter pub get

REM 5. Verificar entorno
echo 🔍 Verificando entorno Flutter...
flutter --version
flutter doctor

REM 6. Buscar dispositivos disponibles
echo 📱 Buscando dispositivos conectados...
flutter devices

REM 7. Abrir VS Code (opcional)
echo ⚙️ Abriendo proyecto en VS Code...
code .

endlocal