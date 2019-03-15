FROM trion/ng-cli-karma

WORKDIR /app

COPY client/package*.json client/
COPY server/package*.json server/

WORKDIR /app/client
RUN npm i

WORKDIR /app/server
RUN npm i

WORKDIR /app

# Less prone to changes
COPY test.sh test.sh
COPY common/ common/

# More prone to changes
COPY client/ client/
COPY server/ server/

CMD bash -e test.sh
