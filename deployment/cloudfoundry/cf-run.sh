cf api https://api.ng.bluemix.net
cf login -u abalasu1@in.ibm.com -p a3rosmth -o "Aruns Organization" -s hotels.com

cd ../..
cd locationquery 
cf push

cd ..
cd hotelquery
cf push

cd ..
cd starrating
cf push

cd ..
cd controller
cf push
