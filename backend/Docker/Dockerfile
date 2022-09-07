#Basic Container
FROM alpine:latest

#Installing necessary packages
RUN apk add --no-cache bash bash-doc bash-completion
RUN apk add --no-cache musl-dev
RUN apk add --no-cache gfortran
RUN apk add git
RUN apk add wget

WORKDIR /fortran
#Fetching FPM from releases
RUN wget https://github.com/fortran-lang/fpm/releases/download/v0.6.0/fpm-0.6.0-linux-x86_64 -4 
RUN mv fpm-0.6.0-linux-x86_64 fpm
#Setup for FPM 
RUN chmod u+x fpm
RUN mkdir playground
RUN mkdir playground/app 
RUN mkdir playground/libraries

#Fetching libraries
WORKDIR /fortran/playground/libraries
#Setting up stdlib
RUN git clone https://github.com/fortran-lang/stdlib.git
WORKDIR /fortran/playground/libraries/stdlib
RUN git checkout stdlib-fpm
WORKDIR /fortran/playground
COPY fpm.toml /fortran/playground/fpm.toml
COPY main.f90 /fortran/playground/app/main.f90
RUN /fortran/fpm build


