# ordermanagement

**TODO** _Hier eine kurze Beschreibung einfügen, was das Projekt macht._

## Lokale Entwicklungsumgebung

Folgendes wird auf der Entwicklermaschine benötigt:

- NodeJS — mindestens in der Version, die in der `.nvmrc` steht
- OpenJDK (z.B. Temurin) — mindestens in der Version, die in der `backend/pom.xml` steht (im `<jdk.version>`-Property)
- Cloud Foundry CLI
- Docker (z.B. Docker Desktop)

## Howto

### Build und Deployment

Hierfür wird normalerweise die Azure DevOps-Pipeline verwendet. Falls doch ausnahmsweise vom Entwicklerrechner aus deployed werden soll, kann diese Anleitung verwendet werden.

Damit das MTAR auch sinnvoll funktioniert, muss vor dem Build ein Login im Cloud Foundry CLI erfolgen: `cf login -a https://api.cf.us10-001.hana.ondemand.com`, wobei hier der korrekte API-Endpunkt ausgewählt werden muss, in den die Anwendung deployed werden soll (zu finden in der BTP am Subaccount).

Um das Projekt zu bauen, im Wurzelverzeichnis `npm rum build:cf` ausführen. Dabei entsteht ein MTAR, das die komplette Anwendung enthält und in Cloud Foundry deployed werden kann.

Um das Projekt zu deployen, im Wurzelverzeichnis `npm run deploy:cf` ausführen.

### Anwendung lokal starten

In diesem Szenario läuft die Anwendung vollständig lokal, ohne externe Abhängigkeiten. Als Datenbank wird eine In-Memory-Datenbank (H2) verwendet, die mit Beispiel-Daten vorbefüllt wird. Welche das sind, kann über die Datei `backend/srv/src/main/resources/example-data-h2.sql` gesteuert werden. Anfragen an Umsysteme werden von der Umsystem-Simulation übernommen.

So können schnell Testkonstrukte für Edge-Cases zusammengestellt werden. Außerdem ist ein schnelles Iterieren (Entwickeln/Testen-Zyklus) möglich.

#### Umsystem-Simulation

Im Verzeichnis `adjacent-system-simulation` ausführen: `docker compose up` (Docker Daemon muss gestartet sein, damit das funktioniert).

#### Backend

Im Wurzelverzeichnis ausführen:

- macOS/Linux: `./mvnw -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=default,local -Ddestinations='[{"name" : "SC_V2", "strictSSL": false, "url": "http://localhost:8081/"}]'`
- Windows (cmd): `mvnw -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=default,local -Ddestinations="[{\"name\" : \"SC_V2\", \"strictSSL\": false, \"url\": \"http://localhost:8081/\"}]"`
- Windows (PowerShell): `./mvnw.cmd -f backend/pom.xml spring-boot:run "-Dspring-boot.run.profiles=default,local" -Ddestinations="[{\"name\" : \"SC_V2\", \"strictSSL\": false, \"url\": \http://localhost:8081/\}]"`

Über den `destinations`-Parameter wird eine lokale Konfiguration für die im Code verwendeten Destinations gesetzt. Diese werden dabei auf die Umsystem-Simulation umgebogen, die auf Port `8081` läuft.

Das Backend kann auch aus der IDE heraus gestartet werden, sodass einfaches Debugging möglich ist.

#### Angular-Frontend

Im Verzeichnis `angular-mashup` ausführen:\
`npm start`\
Die Anwendung kann dann unter http://localhost:4200 aufgerufen werden.

### Anwendung lokal im Hybrid-Modus starten

In diesem Szenario laufen Angular-Mashup und Backend lokal. Das Backend kommuniziert aber mit den echten Diensten in der BTP, also mit der HANA-Datenbank und den echten Umsystemen.

So kann auch lokal mit echten Daten gearbeitet werden, ohne dass bei jeder Änderung am Code ein neues Deployment abgewartet werden muss.

Damit das Backend mit den realen Diensten kommunizieren kann, wird die `VCAP_SERVICES`-Umgebungsvariable aus der BTP benötigt. Diese kann mit `npx cds bind --exec -- node -e 'console.log(process.env.VCAP_SERVICES)'` ausgelesen werden.

#### Backend

Im Wurzelverzeichnis ausführen:

- macOS/Linux: `npx cds bind --exec -- ./mvnw -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=cloud`
- Windows: `npx cds bind --exec -- mvnw -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=cloud`

#### Angular-Frontend

Im Verzeichnis `angular-mashup` ausführen:\
`npm start`\
Die Anwendung kann dann unter http://localhost:4200 aufgerufen werden.
