FROM trion/ng-cli-karma

WORKDIR /app

COPY client/package*.json client/
COPY server/package*.json server/

WORKDIR /app/client
RUN npm i

WORKDIR /app/server
RUN npm i

WORKDIR /app
COPY client/ client/
COPY server/ server/
COPY common/ common/

CMD bash
