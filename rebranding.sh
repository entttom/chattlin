#!/bin/bash
find . -type f -name "*.*" -print|xargs perl -i -pe 's#git clone https://github.com/entttom/maas.git#git clone https://github.com/entttom/maas.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#cd maas#cd maas#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://raw.githubusercontent.com/entttom/maas/master/deployment/nginx_maas.conf#https://raw.githubusercontent.com/entttom/maas/master/deployment/nginx_maas.conf#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#maas.work#maas.work#g' 



find . -type f -name "*.*" -print|xargs perl -i -pe 's#maas.work#maas.work#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#MaaS.work#MaaS.work#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Maas#Maas#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#MAAS#MAAS#g' 
#find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#Maass#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#maas#maas#g'
#find . -type f -name "*.*" -print|xargs perl -i -pe 's#woot#maass#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#db:maas_prepare#db:maas_prepare#g'  
cd deployment
rename  's/maas/maas/' *
cd ..
cd app/javascript/dashboard/i18n/locale/
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#MaaS#g'
cd ..
cd ..
cd ..
cd ..
cd ..
cd config/locales/
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#MaaS#g'
cd ..
cd .. 
cp rebranding/public/*.png public/
cp rebranding/public/brand-assets/*.svg public/brand-assets
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/devise-secure_password#https://github.com/chatwoot/devise-secure_password#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/twitty#https://github.com/chatwoot/twitty#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/prosemirror-schema.git#https://github.com/chatwoot/prosemirror-schema.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chatwoot/prosemirror-schema#chatwoot/prosemirror-schema#g' 

find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/prosemirror-schema.git#https://github.com/chatwoot/prosemirror-schema.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/ninja-keys#https://github.com/chatwoot/ninja-keys#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chatwoot/utils#chatwoot/utils#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#entttom/maas"#entttom/maas"#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/entttom/maas#https://github.com/entttom/maas#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://chat.maas.work/brand-assets/logo_thumbnail.svg#https://chat.maas.work/brand-assets/logo_thumbnail.svg#g'

find . -name "*" -exec rename 's/Maas/Maas/g' {} ";"
find . -name "*" -exec rename 's/maas/maas/g' {} ";"
#find . -name "*" -exec rename 's/Woot/Maass/g' {} ";"
#find . -name "*" -exec rename 's/woot/maass/g' {} ";"

cp -r /Users/thomasentner/Library/Mobile\ Documents/com\~apple\~CloudDocs/MaaS/Maas\ Rebranding/master/ /Users/thomasentner/Documents/GitHub/maas/
rm -rf ../master



