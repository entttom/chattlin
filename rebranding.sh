#!/bin/bash
find . -type f -name "*.*" -print|xargs perl -i -pe 's#git clone https://github.com/entttom/chattlin.git#git clone https://github.com/entttom/chattlin.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#cd chattlin#cd chattlin#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://raw.githubusercontent.com/entttom/maas/master/deployment/nginx_chattlin.conf#https://raw.githubusercontent.com/entttom/maas/master/deployment/nginx_chattlin.conf#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chattlin.com#chattlin.com#g' 



find . -type f -name "*.*" -print|xargs perl -i -pe 's#chattlin.com#chattlin.com#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Chattlin.com#Chattlin.com#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Chattlin#Chattlin#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#CHATTLIN#CHATTLIN#g' 
#find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#Chattlin#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chattlin#chattlin#g'
#find . -type f -name "*.*" -print|xargs perl -i -pe 's#woot#chattlin#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#db:chattlin_prepare#db:chattlin_prepare#g' 
cd deployment
rename  's/chattlin/chattlin/' *
cd ..
cd app/javascript/dashboard/i18n/locale/
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#Chattlin#g'
cd ..
cd ..
cd ..
cd ..
cd ..
cd config/locales/
find . -type f -name "*.*" -print|xargs perl -i -pe 's#Woot#Chattlin#g'
cd ..
cd .. 
cp rebranding/public/*.png public/
cp rebranding/public/brand-assets/*.svg public/brand-assets
cp rebranding/chat.svg app/javascript/dashboard/assets/images/chat.svg 

#cp app/javascript/dashboard/components/layout/sidebarComponents/Primary.vue app/javascript/dashboard/components/layout/sidebarComponents/Primary1.vue 
#awk 'NR==99{print "background-color:#F5FAFE;border-bottom-right-radius:25px;border-top-right-radius:25px;"}1' app/javascript/dashboard/components/layout/sidebarComponents/Primary1.vue  > app/javascript/dashboard/components/layout/sidebarComponents/Primary.vue 
#rm app/javascript/dashboard/components/layout/sidebarComponents/Primary1.vue 

find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/devise-secure_password#https://github.com/chatwoot/devise-secure_password#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/twitty#https://github.com/chatwoot/twitty#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/prosemirror-schema.git#https://github.com/chatwoot/prosemirror-schema.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chatwoot/prosemirror-schema#chatwoot/prosemirror-schema#g' 

find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/prosemirror-schema.git#https://github.com/chatwoot/prosemirror-schema.git#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/chatwoot/ninja-keys#https://github.com/chatwoot/ninja-keys#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#chatwoot/utils#chatwoot/utils#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#entttom/maas"#entttom/maas"#g' 
find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://github.com/entttom/chattlin#https://github.com/entttom/chattlin#g' 
#find . -type f -name "*.*" -print|xargs perl -i -pe 's#https://app.chattlin.com/brand-assets/logo_thumbnail.svg#https://chat.maas.work/brand-assets/logo_thumbnail.svg#g'

find . -name "*" -exec rename 's/Chattlin/Chattlin/g' {} ";"
find . -name "*" -exec rename 's/chattlin/chattlin/g' {} ";"
#find . -name "*" -exec rename 's/Woot/Chattlin/g' {} ";"
#find . -name "*" -exec rename 's/woot/chattlin/g' {} ";"

cp -r /Users/thomasentner/Library/Mobile\ Documents/com\~apple\~CloudDocs/MaaS/Chattlin\ Rebranding/master/ /Users/thomasentner/Documents/GitHub/maas/
rm -rf ../master



