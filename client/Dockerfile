# FROM node:6.9.4-alpine
FROM node:6.10.2-slim

ENV APP /app
WORKDIR $APP
ENV PATH /root/.yarn/bin:$PATH
ENV YARNPKG_VERSION 0.23.2
ENV ENTRYKIT_VERSION 0.4.0

# FIXME: Fail `flow` on node:6.9.4-alpine
# events.js:160
#       throw er; // Unhandled 'error' event
#       ^
#
# Error: spawn /app/node_modules/flow-bin/flow-linux64-v0.37.4/flow ENOENT
#     at exports._errnoException (util.js:1022:11)
#     at Process.ChildProcess._handle.onexit (internal/child_process.js:193:32)
#     at onErrorNT (internal/child_process.js:359:16)
#     at _combinedTickCallback (internal/process/next_tick.js:74:11)
#     at process._tickCallback (internal/process/next_tick.js:98:9)
#     at Module.runMain (module.js:606:11)
#     at run (bootstrap_node.js:394:7)
#     at startup (bootstrap_node.js:149:9)
#     at bootstrap_node.js:509:3
# error Command failed with exit code 1.

# RUN apk add --no-cache --virtual .build-deps \
#     bash \
#     curl \
#     tar \
#   && curl -o- -L https://yarnpkg.com/install.sh \
#   | bash -s -- --version $YARNPKG_VERSION \
#   && apk del .build-deps \
#   && apk add --no-cache --virtual .flow-rundeps \
#     inotify-tools \
#     libelf \
#     musl

RUN apt-get update \
  && apt-get install -y \
    libelf-dev \
    git \
  && rm -rf /var/lib/apt/lists/* \
  && curl -o- -L https://yarnpkg.com/install.sh \
    | bash -s -- --version $YARNPKG_VERSION \
  # entrykit
  && wget https://github.com/progrium/entrykit/releases/download/v${ENTRYKIT_VERSION}/entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && tar -xvzf entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && rm entrykit_${ENTRYKIT_VERSION}_Linux_x86_64.tgz \
  && mv entrykit /bin/entrykit \
  && chmod +x /bin/entrykit \
  && entrykit --symlink

ENTRYPOINT [ \
  "prehook", "node -v", \
  "prehook", "yarn -v", \
  "prehook", "yarn --no-progress", \
  "--" \
]
