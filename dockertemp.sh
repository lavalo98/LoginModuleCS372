./dockerbuild.sh
sudo docker rm -fv loginmodule
sudo docker run --name loginmodule -p 80:80 -it --rm loginmodule
