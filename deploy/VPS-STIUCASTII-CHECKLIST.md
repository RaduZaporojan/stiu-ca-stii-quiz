# VPS checklist: Stiu ca Stii

Acest checklist adapteaza accesul VPS existent pentru deploy-ul separat al jocului `Stiu ca Stii`.

Nu modifica proiectul Cinemateca:

- nu atinge `/var/www/cinematecaowh`
- nu atinge PM2 procesele `cinemateca-web` si `cinemateca-cms`
- nu modifica baza SQLite Cinemateca
- nu modifica configul Nginx existent `/etc/nginx/sites-available/cinemateca`, cu exceptia verificarii ca nu intra in conflict

## Acces VPS

Host:

```text
195.178.106.39
```

User recomandat:

```text
deploy
```

Conectare din PowerShell:

```powershell
ssh -i "C:\Users\Radu Zaporojan\.ssh\cinemateca_deploy" deploy@195.178.106.39
```

Cheia poate cere passphrase. Passphrase-ul ramane in documentul privat de handoff Cinemateca, nu se copiaza in repo-ul jocului.

## Folder aplicatie

```bash
sudo mkdir -p /var/www/stiucastii
sudo chown -R deploy:deploy /var/www/stiucastii
```

## GitHub pe VPS

Repo joc:

```text
git@github.com:RaduZaporojan/stiu-ca-stii-quiz.git
```

Verifica SSH GitHub:

```bash
ssh -T git@github.com
```

Daca cheia GitHub de pe VPS este doar deploy key pentru Cinemateca, trebuie adaugata o cheie noua pentru repo-ul `stiu-ca-stii-quiz` sau folosita o cheie GitHub a contului.

## Clone prima data

```bash
cd /var/www
git clone git@github.com:RaduZaporojan/stiu-ca-stii-quiz.git stiucastii
cd /var/www/stiucastii
cp .env.production.example .env
nano .env
```

Seteaza valori reale pentru:

- `POSTGRES_PASSWORD`
- parola din `DATABASE_URL`
- `ADMIN_PASSWORD`

## Docker

Verifica Docker:

```bash
docker --version
docker compose version
```

Pornire:

```bash
cd /var/www/stiucastii
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma db seed
```

Port local aplicatie:

```text
127.0.0.1:3010
```

## Nginx

Config separat:

```bash
sudo cp /var/www/stiucastii/deploy/nginx-stiucastii.owh.md.conf /etc/nginx/sites-available/stiucastii.owh.md
sudo ln -s /etc/nginx/sites-available/stiucastii.owh.md /etc/nginx/sites-enabled/stiucastii.owh.md
sudo nginx -t
sudo systemctl reload nginx
```

SSL:

```bash
sudo certbot --nginx -d stiucastii.owh.md
```

## Verificari

```bash
curl -I http://127.0.0.1:3010
curl -I https://stiucastii.owh.md
docker compose -f /var/www/stiucastii/docker-compose.prod.yml ps
docker compose -f /var/www/stiucastii/docker-compose.prod.yml logs --tail=100 stiucastii-web
```

## Update ulterior

```bash
cd /var/www/stiucastii
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma migrate deploy
```
