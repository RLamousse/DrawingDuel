FROM trion/ng-cli-karma

WORKDIR /app

# Less prone to changes
COPY test test
COPY client/package*.json client/
COPY server/package*.json server/

# Install node_modules
WORKDIR /app/client
RUN npm ci

WORKDIR /app/server
RUN npm ci

WORKDIR /app

# More prone to changes
COPY common/ common/
COPY client/ client/
COPY server/ server/

# Execute tests by default
CMD sh test
