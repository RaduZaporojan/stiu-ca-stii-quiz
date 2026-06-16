# Deploy VPS: Stiu ca Stii

Aplicatia trebuie rulata separat de Cinemateca.

Pentru VPS-ul existent OWH, vezi si checklist-ul specific:

```bash
deploy/VPS-STIUCASTII-CHECKLIST.md
```

## Locatie recomandata

```bash
/var/www/cinemateca
/var/www/stiucastii
```

Nu modifica fisierele, containerele sau baza de date Cinemateca.

## Prima instalare

```bash
cd /var/www
git clone git@github.com:RaduZaporojan/stiu-ca-stii-quiz.git stiucastii
cd /var/www/stiucastii
cp .env.production.example .env
nano .env
```

In `.env`, seteaza valori reale pentru:

- `POSTGRES_PASSWORD`
- `DATABASE_URL`, cu aceeasi parola
- `ADMIN_PASSWORD`

## Pornire containere

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma db seed
```

Seed-ul se ruleaza la prima instalare sau cand vrei sa reincarci setul demo de categorii/intrebari.

Aplicatia asculta intern pe:

```bash
http://127.0.0.1:3010
```

## Nginx

Copiaza configuratia separata:

```bash
sudo cp deploy/nginx-stiucastii.owh.md.conf /etc/nginx/sites-available/stiucastii.owh.md
sudo ln -s /etc/nginx/sites-available/stiucastii.owh.md /etc/nginx/sites-enabled/stiucastii.owh.md
sudo nginx -t
sudo systemctl reload nginx
```

Activeaza SSL:

```bash
sudo certbot --nginx -d stiucastii.owh.md
```

## Update dupa push nou

```bash
cd /var/www/stiucastii
git pull
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec stiucastii-web npx prisma migrate deploy
```

## Verificari

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f stiucastii-web
curl -I http://127.0.0.1:3010
```
