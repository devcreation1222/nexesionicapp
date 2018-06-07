FROM node
#RUN apt-get update && apt-get install -y curl \
#          apt-transport-https \
#          python-software-properties \
#          software-properties-common \
#          expect \
#          zip \
#          git \
#          sudo

RUN useradd -ms /bin/bash dev
ENV HOME=/home
WORKDIR $HOME/dev
ADD . $HOME/dev/

RUN chmod -R 777 ~
RUN chown -R dev: /home/dev
RUN chmod -R 777 /home/dev

EXPOSE 8100
EXPOSE 35729

RUN npm install -g cordova && cordova telemetry off && npm install -g ionic && npm install


USER dev


