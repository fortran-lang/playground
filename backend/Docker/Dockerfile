FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache bash bash-doc bash-completion
RUN apk add --no-cache musl-dev
RUN apk add --no-cache gfortran
RUN apk add git
RUN apk add wget

# Create a non-root user
RUN adduser -D fortran
USER fortran
WORKDIR /home/fortran

# Set up fpm
RUN wget https://github.com/fortran-lang/fpm/releases/download/v0.6.0/fpm-0.6.0-linux-x86_64 -4 
RUN mv fpm-0.6.0-linux-x86_64 fpm
RUN chmod u+x fpm
RUN mkdir playground
RUN mkdir playground/app 
RUN mkdir playground/libraries

# Fetch libraries
WORKDIR /home/fortran/playground/libraries

# Set up stdlib
RUN git clone https://github.com/fortran-lang/stdlib
WORKDIR /home/fortran/playground/libraries/stdlib
RUN git checkout stdlib-fpm
WORKDIR /home/fortran/playground
COPY fpm.toml /home/fortran/playground/fpm.toml
COPY main.f90 /home/fortran/playground/app/main.f90
RUN /home/fortran/fpm build
