#Basic container
FROM centos:latest

#fixes for centos yum
RUN cd /etc/yum.repos.d/
RUN sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
RUN sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*

#Installing gfortran
RUN yum update -y
RUN yum install -y gcc-gfortran gdb make