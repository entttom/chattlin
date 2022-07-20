#!/usr/bin/env bash

# Description: Install and manage a Chattlin installation.
# OS: Ubuntu 20.04 LTS
# Script Version: 2.1.0
# Run this script as root

set -eu -o errexit -o pipefail -o noclobber -o nounset

# -allow a command to fail with !’s side effect on errexit
# -use return value from ${PIPESTATUS[0]}, because ! hosed $?
! getopt --test > /dev/null 
if [[ ${PIPESTATUS[0]} -ne 4 ]]; then
    echo '`getopt --test` failed in this environment.'
    exit 1
fi

# Global variables
# option --output/-o requires 1 argument
LONGOPTS=console,debug,help,install,Install:,logs:,restart,ssl,upgrade,webserver,version
OPTIONS=cdhiI:l:rsuwv
CWCTL_VERSION="2.1.0"
pg_pass=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 15 ; echo '')

# if user does not specify an option
if [ "$#" -eq 0 ]; then
  echo "No options specified. Use --help to learn more."
  exit 1
fi

# -regarding ! and PIPESTATUS see above
# -temporarily store output to be able to check for errors
# -activate quoting/enhanced mode (e.g. by writing out “--options”)
# -pass arguments only via   -- "$@"   to separate them correctly
! PARSED=$(getopt --options=$OPTIONS --longoptions=$LONGOPTS --name "$0" -- "$@")
if [[ ${PIPESTATUS[0]} -ne 0 ]]; then
    # e.g. return value is 1
    #  then getopt has complained about wrong arguments to stdout
    exit 2
fi
# read getopt’s output this way to handle the quoting right:
eval set -- "$PARSED"

c=n d=n h=n i=n I=n l=n r=n s=n u=n w=n v=n BRANCH=master SERVICE=web
# Iterate options in order and nicely split until we see --
while true; do
    case "$1" in
        -c|--console)
            c=y
            break
            ;;
        -d|--debug)
            d=y
            shift
            ;;
        -h|--help)
            h=y
            break
            ;;
        -i|--install)
            i=y
            BRANCH="master"
            break
            ;;
       -I|--Install)
            I=y
            BRANCH="$2"
            break
            ;;
        -l|--logs)
            l=y
            SERVICE="$2"
            break
            ;;
        -r|--restart)
            r=y
            break
            ;;
        -s|--ssl)
            s=y
            shift
            ;;
        -u|--upgrade)
            u=y
            break
            ;;
        -w|--webserver)
            w=y
            shift
            ;;
        -v|--version)
            v=y
            shift
            ;;
        --)
            shift
            break
            ;;
        *)
            echo "Invalid option(s) specified. Use help(-h) to learn more."
            exit 3
            ;;
    esac
done

# log if debug flag set
if [ "$d" == "y" ]; then
  echo "console: $c, debug: $d, help: $h, install: $i, Install: $I, BRANCH: $BRANCH, \
  logs: $l, SERVICE: $SERVICE, ssl: $s, upgrade: $u, webserver: $w"
fi

# exit if script is not run as root
if [ "$(id -u)" -ne 0 ]; then
  echo 'This needs to be run as root.' >&2
  exit 1
fi

trap exit_handler EXIT

##############################################################################
# Invoked upon EXIT signal from bash
# Upon non-zero exit, notifies the user to check log file.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function exit_handler() {
  if [ "$?" -ne 0 ]; then
   echo -en "\nSome error has occured. Check '/var/log/chattlin-setup.log' for details.\n"
   exit 1
  fi
}

##############################################################################
# Read user input related to domain setup
# Globals:
#   domain_name
#   le_email
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function get_domain_info() {
  read -rp 'Enter the domain/subdomain for Chattlin (e.g., chattlin.domain.com): ' domain_name
  read -rp 'Enter an email address for LetsEncrypt to send reminders when your SSL certificate is up for renewal: ' le_email
  cat << EOF

This script will generate SSL certificates via LetsEncrypt and
serve Chattlin at https://$domain_name.
Proceed further once you have pointed your DNS to the IP of the instance.

EOF
  read -rp 'Do you wish to proceed? (yes or no): ' exit_true
  if [ "$exit_true" == "no" ]; then
    exit 1
  fi
}

##############################################################################
# Install common dependencies
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function install_dependencies() {
  apt update && apt upgrade -y
  apt install -y curl
  curl -sL https://deb.nodesource.com/setup_12.x | bash -
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
  apt update

  apt install -y \
      git software-properties-common imagemagick libpq-dev \
      libxml2-dev libxslt1-dev file g++ gcc autoconf build-essential \
      libssl-dev libyaml-dev libreadline-dev gnupg2 \
      postgresql-client redis-tools \
      nodejs yarn patch ruby-dev zlib1g-dev liblzma-dev \
      libgmp-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev sudo
}

##############################################################################
# Install postgres and redis
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function install_databases() {
  apt install -y postgresql postgresql-contrib redis-server
}

##############################################################################
# Install nginx and cerbot for LetsEncrypt
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function install_webserver() {
  apt install -y nginx nginx-full certbot python3-certbot-nginx
}

##############################################################################
# Create chattlin linux user
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function create_cw_user() {
  if ! id -u "chattlin"; then
    adduser --disabled-login --gecos "" chattlin
  fi
}

##############################################################################
# Install rvm(ruby version manager)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function configure_rvm() {
  create_cw_user

  gpg --keyserver hkp://keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
  gpg2 --keyserver hkp://keyserver.ubuntu.com --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
  curl -sSL https://get.rvm.io | bash -s stable
  adduser chattlin rvm
}

##############################################################################
# Save the pgpass used to setup postgres
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function save_pgpass() {
  mkdir -p /opt/chattlin/config
  file="/opt/chattlin/config/.pg_pass"
  if ! test -f "$file"; then
    echo $pg_pass > /opt/chattlin/config/.pg_pass
  fi
}

##############################################################################
# Get the pgpass used to setup postgres if installation fails midway
# and needs to be re-run
# Globals:
#   pg_pass
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function get_pgpass() {
  file="/opt/chattlin/config/.pg_pass"
  if test -f "$file"; then
    pg_pass=$(cat $file)
  fi

}

##############################################################################
# Configure postgres to create chattlin db user.
# Enable postgres and redis systemd services.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function configure_db() {
  save_pgpass
  get_pgpass
  sudo -i -u postgres psql << EOF
    \set pass `echo $pg_pass`
    CREATE USER chattlin CREATEDB;
    ALTER USER chattlin PASSWORD :'pass';
    ALTER ROLE chattlin SUPERUSER;
    UPDATE pg_database SET datistemplate = FALSE WHERE datname = 'template1';
    DROP DATABASE template1;
    CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UNICODE';
    UPDATE pg_database SET datistemplate = TRUE WHERE datname = 'template1';
    \c template1
    VACUUM FREEZE;
EOF

  systemctl enable redis-server.service
  systemctl enable postgresql
}

##############################################################################
# Install Chattlin
# This includes setting up ruby, cloning repo and installing dependencies.
# Globals:
#   pg_pass
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function setup_chattlin() {
  local secret=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 63 ; echo '')
  local RAILS_ENV=production
  get_pgpass

  sudo -i -u chattlin << EOF
  rvm --version
  rvm autolibs disable
  rvm install "ruby-3.0.4"
  rvm use 3.0.4 --default

  git clone https://github.com/entttom/chattlin.git
  cd chattlin
  git checkout "$BRANCH"
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

  rake assets:precompile RAILS_ENV=production
EOF
}

##############################################################################
# Run database migrations.
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function run_db_migrations(){
  sudo -i -u chattlin << EOF
  cd chattlin
  RAILS_ENV=production bundle exec rails db:chattlin_prepare
EOF
}

##############################################################################
# Setup Chattlin systemd services and cwctl CLI
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function configure_systemd_services() {
  cp /home/chattlin/chattlin/deployment/chattlin-web.1.service /etc/systemd/system/chattlin-web.1.service
  cp /home/chattlin/chattlin/deployment/chattlin-worker.1.service /etc/systemd/system/chattlin-worker.1.service
  cp /home/chattlin/chattlin/deployment/chattlin.target /etc/systemd/system/chattlin.target

  cp /home/chattlin/chattlin/deployment/chattlin /etc/sudoers.d/chattlin
  cp /home/chattlin/chattlin/deployment/setup_20.04.sh /usr/local/bin/cwctl
  chmod +x /usr/local/bin/cwctl

  systemctl enable chattlin.target
  systemctl start chattlin.target
}

##############################################################################
# Fetch and install SSL certificates from LetsEncrypt
# Modify the nginx config and restart nginx.
# Also modifies FRONTEND_URL in .env file.
# Globals:
#   None
# Arguments:
#   domain_name
#   le_email
# Outputs:
#   None
##############################################################################
function setup_ssl() {
  if [ "$d" == "y" ]; then
    echo "debug: setting up ssl"
    echo "debug: domain: $domain_name"
    echo "debug: letsencrypt email: $le_email"
  fi
  curl https://ssl-config.mozilla.org/ffdhe4096.txt >> /etc/ssl/dhparam
  wget https://raw.githubusercontent.com/entttom/maas/master/deployment/nginx_chattlin.conf
  cp nginx_chattlin.conf /etc/nginx/sites-available/nginx_chattlin.conf
  certbot certonly --non-interactive --agree-tos --nginx -m "$le_email" -d "$domain_name"
  sed -i "s/chattlin.domain.com/$domain_name/g" /etc/nginx/sites-available/nginx_chattlin.conf
  ln -s /etc/nginx/sites-available/nginx_chattlin.conf /etc/nginx/sites-enabled/nginx_chattlin.conf
  systemctl restart nginx
  sudo -i -u chattlin << EOF
  cd chattlin
  sed -i "s/http:\/\/0.0.0.0:3000/https:\/\/$domain_name/g" .env
EOF
  systemctl restart chattlin.target
}

##############################################################################
# Setup logging
# Globals:
#   LOG_FILE
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function setup_logging() {
  touch /var/log/chattlin-setup.log
  LOG_FILE="/var/log/chattlin-setup.log"
}

function ssl_success_message() {
    cat << EOF

***************************************************************************
Woot! Woot!! Chattlin server installation is complete.
The server will be accessible at https://$domain_name

Join the community at https://chattlin.com/community?utm_source=cwctl
***************************************************************************

EOF
}

function cwctl_message() {
  echo $'\U0001F680 Try out the all new Chattlin CLI tool to manage your installation.'
  echo $'\U0001F680 Type "cwctl --help" to learn more.'
}


##############################################################################
# This function handles the installation(-i/--install)
# Globals:
#   CW_VERSION
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function get_cw_version() {
  CW_VERSION=$(curl -s https://app.chattlin.com/api | python3 -c 'import sys,json;data=json.loads(sys.stdin.read()); print(data["version"])')
}

##############################################################################
# This function handles the installation(-i/--install)
# Globals:
#   configure_webserver
#   install_pg_redis
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function install() {
  get_cw_version
  cat << EOF

***************************************************************************
              Chattlin Installation (v$CW_VERSION)
***************************************************************************

For more verbose logs, open up a second terminal and follow along using,
'tail -f /var/log/chattlin-setup.log'.

EOF

  sleep 3
  read -rp 'Would you like to configure a domain and SSL for Chattlin?(yes or no): ' configure_webserver

  if [ "$configure_webserver" == "yes" ]; then
    get_domain_info
  fi

  echo -en "\n"
  read -rp 'Would you like to install Postgres and Redis? (Answer no if you plan to use external services): ' install_pg_redis

  echo -en "\n➥ 1/9 Installing dependencies. This takes a while.\n"
  install_dependencies &>> "${LOG_FILE}"

  if [ "$install_pg_redis" != "no" ]; then
    echo "➥ 2/9 Installing databases."
    install_databases &>> "${LOG_FILE}"
  else
    echo "➥ 2/9 Skipping Postgres and Redis installation."
  fi

  if [ "$configure_webserver" == "yes" ]; then
    echo "➥ 3/9 Installing webserver."
    install_webserver &>> "${LOG_FILE}"
  else
    echo "➥ 3/9 Skipping webserver installation."
  fi

  echo "➥ 4/9 Setting up Ruby"
  configure_rvm &>> "${LOG_FILE}"

  if [ "$install_pg_redis" != "no" ]; then
    echo "➥ 5/9 Setting up the database."
    configure_db &>> "${LOG_FILE}"
  else
    echo "➥ 5/9 Skipping database setup."
  fi

  echo "➥ 6/9 Installing Chattlin. This takes a long while."
  setup_chattlin &>> "${LOG_FILE}"

  if [ "$install_pg_redis" != "no" ]; then
    echo "➥ 7/9 Running database migrations."
    run_db_migrations &>> "${LOG_FILE}"
  else
    echo "➥ 7/9 Skipping database migrations."
  fi

  echo "➥ 8/9 Setting up systemd services."
  configure_systemd_services &>> "${LOG_FILE}"

  public_ip=$(curl http://checkip.amazonaws.com -s)

  if [ "$configure_webserver" != "yes" ]
  then
    cat << EOF
➥ 9/9 Skipping SSL/TLS setup.

***************************************************************************
Woot! Woot!! Chattlin server installation is complete.
The server will be accessible at http://$public_ip:3000

To configure a domain and SSL certificate, follow the guide at
https://www.chattlin.com/docs/deployment/deploy-chattlin-in-linux-vm?utm_source=cwctl

Join the community at https://chattlin.com/community?utm_source=cwctl
***************************************************************************

EOF
  cwctl_message
  else
    echo "➥ 9/9 Setting up SSL/TLS."
    setup_ssl &>> "${LOG_FILE}"
    ssl_success_message
    cwctl_message
  fi

  if [ "$install_pg_redis" == "no" ]
  then
cat <<EOF

***************************************************************************
The database migrations had not run as Postgres and Redis were not installed
as part of the installation process. After modifying the environment
variables (in the .env file) with your external database credentials, run
the database migrations using the below command.
'RAILS_ENV=production bundle exec rails db:chattlin_prepare'.
***************************************************************************

EOF
  cwctl_message
  fi

exit 0

}

##############################################################################
# Access ruby console (-c/--console)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function get_console() {
  sudo -i -u chattlin bash -c " cd chattlin && RAILS_ENV=production bundle exec rails c"
}

##############################################################################
# Prints the help message (-c/--console)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function help() {

  cat <<EOF
Usage: cwctl [OPTION]...
Install and manage your Chattlin installation.

Example: cwctl -i master
Example: cwctl -l web
Example: cwctl --logs worker
Example: cwctl --upgrade
Example: cwctl -c

Installation/Upgrade:
  -i, --install             Install the latest stable version of Chattlin
  -I                        Install Chattlin from a git branch
  -u, --upgrade             Upgrade Chattlin to the latest stable version
  -s, --ssl                 Fetch and install SSL certificates using LetsEncrypt
  -w, --webserver           Install and configure Nginx webserver with SSL

Management:
  -c, --console             Open ruby console
  -l, --logs                View logs from Chattlin. Supported values include web/worker.
  -r, --restart             Restart Chattlin server
  
Miscellaneous:
  -d, --debug               Show debug messages
  -v, --version             Display version information
  -h, --help                Display this help text

Exit status:
Returns 0 if successful; non-zero otherwise.

Report bugs at https://github.com/entttom/chattlin/issues
Get help, https://chattlin.com/community?utm_source=cwctl

EOF
}

##############################################################################
# Get Chattlin web/worker logs (-l/--logs)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function get_logs() {
  if [ "$SERVICE" == "worker" ]; then
    journalctl -u chattlin-worker.1.service -f
  fi
  if [ "$SERVICE" == "web" ]; then
    journalctl -u chattlin-web.1.service -f
  fi
}

##############################################################################
# Setup SSL (-s/--ssl)
# Installs nginx if not available.
# Globals:
#   domain_name
#   le_email
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function ssl() {
   if [ "$d" == "y" ]; then
     echo "Setting up ssl"
   fi
   get_domain_info
   if ! systemctl -q is-active nginx; then
    install_webserver
   fi
   setup_ssl
   ssl_success_message
}

##############################################################################
# Upgrade an existing installation to latest stable version(-u/--upgrade)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function upgrade() {
  get_cw_version
  echo "Upgrading Chattlin to v$CW_VERSION"
  sleep 3
  sudo -i -u chattlin << "EOF"

  # Navigate to the Chattlin directory
  cd chattlin

  # Pull the latest version of the master branch
  git checkout master && git pull

  # Ensure the ruby version is upto date
  # Parse the latest ruby version
  latest_ruby_version="$(cat '.ruby-version')"
  rvm install "ruby-$latest_ruby_version"
  rvm use "$latest_ruby_version" --default

  # Update dependencies
  bundle
  yarn

  # Recompile the assets
  rake assets:precompile RAILS_ENV=production

  # Migrate the database schema
  RAILS_ENV=production bundle exec rake db:migrate

EOF

  # Copy the updated targets
  cp /home/chattlin/chattlin/deployment/chattlin-web.1.service /etc/systemd/system/chattlin-web.1.service
  cp /home/chattlin/chattlin/deployment/chattlin-worker.1.service /etc/systemd/system/chattlin-worker.1.service
  cp /home/chattlin/chattlin/deployment/chattlin.target /etc/systemd/system/chattlin.target

  cp /home/chattlin/chattlin/deployment/chattlin /etc/sudoers.d/chattlin
  # TODO:(@vn) handle cwctl updates

  systemctl daemon-reload

  # Restart the chattlin server
  systemctl restart chattlin.target

}

##############################################################################
# Restart Chattlin server (-r/--restart)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function restart() {
  systemctl restart chattlin.target
  systemctl status chattlin.target
}

##############################################################################
# Install nginx and setup SSL (-w/--webserver)
# Globals:
#   domain_name
#   le_email
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function webserver() {
  if [ "$d" == "y" ]; then
     echo "Installing nginx"
  fi
  ssl
  #TODO(@vn): allow installing nginx only without SSL
}

##############################################################################
# Print cwctl version (-v/--version)
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function version() {
  echo "cwctl v$CWCTL_VERSION alpha build"
}

##############################################################################
# main function that handles the control flow
# Globals:
#   None
# Arguments:
#   None
# Outputs:
#   None
##############################################################################
function main() {
  setup_logging

  if [ "$c" == "y" ]; then
    get_console
  fi
  
  if [ "$h" == "y" ]; then
    help
  fi

  if [ "$i" == "y" ] || [ "$I" == "y" ]; then
    install
  fi

  if [ "$l" == "y" ]; then
    get_logs
  fi

  if [ "$r" == "y" ]; then
    restart
  fi
  
  if [ "$s" == "y" ]; then
    ssl
  fi

  if [ "$u" == "y" ]; then
    upgrade
  fi

  if [ "$w" == "y" ]; then
    webserver
  fi

  if [ "$v" == "y" ]; then
    version
  fi

}

main "$@"
