#!/usr/bin/env bash

# Description: Chattlin installation script
# OS: Ubuntu 18.04 LTS
# Script Version: 0.2

apt update && apt upgrade -y
apt install -y curl
curl -sL https://deb.nodesource.com/setup_12.x | bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt update

apt install -y \
	git software-properties-common imagemagick libpq-dev \
    libxml2-dev libxslt1-dev file g++ gcc autoconf build-essential \
    libssl-dev libyaml-dev libreadline-dev gnupg2 nginx redis-server \
    redis-tools postgresql postgresql-contrib certbot \
    python-certbot-nginx nodejs yarn patch ruby-dev zlib1g-dev liblzma-dev \
    libgmp-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev sudo

adduser --disabled-login --gecos "" chattlin

sudo -i -u chattlin bash << EOF
gpg --keyserver hkp://keyserver.ubuntu.com  --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
curl -sSL https://get.rvm.io | bash -s stable
EOF

pg_pass=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 15 ; echo '')
sudo -i -u postgres psql << EOF
\set pass `echo $pg_pass`
CREATE USER chattlin CREATEDB;
ALTER USER chattlin PASSWORD :'pass';
ALTER ROLE chattlin SUPERUSER;
EOF

systemctl enable redis-server.service
systemctl enable postgresql

secret=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 63 ; echo '')
RAILS_ENV=production

sudo -i -u chattlin << EOF
rvm --version
rvm autolibs disable
rvm install "ruby-3.0.4"
rvm use 3.0.4 --default

git clone https://github.com/entttom/chattlin.git
cd chattlin
if [[ -z "$1" ]]; then
  git checkout master;
else
  git checkout $1;
fi
bundle
yarn

cp .env.example .env
sed -i -e "/SECRET_KEY_BASE/ s/=.*/=$secret/" .env
sed -i -e '/REDIS_URL/ s/=.*/=redis:\/\/localhost:6379/' .env
sed -i -e '/POSTGRES_HOST/ s/=.*/=localhost/' .env
sed -i -e '/POSTGRES_USERNAME/ s/=.*/=chattlin/' .env
sed -i -e "/POSTGRES_PASSWORD/ s/=.*/=$pg_pass/" .env
sed -i -e '/RAILS_ENV/ s/=.*/=$RAILS_ENV/' .env
echo -en "\nINSTALLATION_ENV=linux_script" >> ".env"

RAILS_ENV=production bundle exec rake db:create
RAILS_ENV=production bundle exec rake db:reset
rake assets:precompile RAILS_ENV=production
EOF

cp /home/chattlin/chattlin/deployment/chattlin-web.1.service /etc/systemd/system/chattlin-web.1.service
cp /home/chattlin/chattlin/deployment/chattlin-worker.1.service /etc/systemd/system/chattlin-worker.1.service
cp /home/chattlin/chattlin/deployment/chattlin.target /etc/systemd/system/chattlin.target

systemctl enable chattlin.target
systemctl start chattlin.target

echo "Woot! Woot!! Chattlin server installation is complete"
echo "The server will be accessible at http://<server-ip>:3000"
echo "To configure a domain and SSL certificate, follow the guide at https://www.chattlin.com/docs/deployment/deploy-chattlin-in-linux-vm"

# TODO: Auto-configure Nginx with SSL certificate
