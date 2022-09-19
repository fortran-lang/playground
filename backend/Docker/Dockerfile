FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    bash \
    bash-completion \
    bash-doc \
    gfortran \
    git \
    musl-dev \
    wget

# Create a non-root user
RUN adduser -D fortran
USER fortran
WORKDIR /home/fortran

# Set up fpm
RUN wget https://github.com/fortran-lang/fpm/releases/download/v0.6.0/fpm-0.6.0-linux-x86_64 -4 -O fpm && \
    chmod u+x fpm
RUN mkdir playground && \
    mkdir playground/app && \
    mkdir playground/libraries

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
