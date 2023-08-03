FROM ubuntu:20.04

# Add Build Assets
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD ./contracts/ /usr/src/app/

# Install Build Deps
RUN apt-get update
RUN apt-get install -y curl git make
RUN curl -L https://foundry.paradigm.xyz | bash

EXPOSE 8545

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
