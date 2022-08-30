#Basic Container
FROM alpine:latest

#Installing necessary packages
RUN apk add --no-cache bash bash-doc bash-completion
RUN apk add --no-cache musl-dev
RUN apk add --no-cache gfortran
RUN apk add git

COPY ./fpm-0.6.0-linux-x86_64 /fortran/

#Assigning default directory
WORKDIR /fortran
RUN chmod u+x fpm-0.6.0-linux-x86_64
RUN ./fpm-0.6.0-linux-x86_64 new playground
WORKDIR /fortran/playground
COPY fpm.toml /fortran/playground/fpm.toml
RUN /fortran/fpm-0.6.0-linux-x86_64 build
RUN rm src -r 

