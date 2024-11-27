FROM node:22.10.0-alpine3.20 AS base
WORKDIR /pfac
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_GOOGLE_API_KEY

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}
ENV NEXT_PUBLIC_GOOGLE_API_KEY=${NEXT_PUBLIC_GOOGLE_API_KEY}
FROM base AS installer
# Use 'apk' package manager for Alpine Linux
RUN apk update && apk add build-base make g++ python3 --no-cache && \
  npm install -g --force npm yarn turbo node-gyp @mapbox/node-pre-gyp && \
  apk cache clean && npm cache clean -g --force

FROM installer AS builder
COPY . .
ENV NODE_OPTIONS="--max_old_space_size=4096"
# RUN rm yarn.lock
RUN yarn install
RUN yarn build
RUN yarn cache clean

FROM installer AS prunner
WORKDIR /shoopernmb

COPY --from=builder /shoopernmb/lerna.json lerna.json
COPY --from=builder /shoopernmb/nx.json nx.json
COPY --from=builder /shoopernmb/package.json package.json
COPY --from=builder /shoopernmb/tsconfig.json tsconfig.json

COPY --from=builder /shoopernmb/apps/server/node_modules apps/server/node_modules
COPY --from=builder /shoopernmb/apps/server/package.json apps/server/package.json
COPY --from=builder /shoopernmb/apps/server/tsconfig.json apps/server/tsconfig.json
COPY --from=builder /shoopernmb/apps/server/dist apps/server/dist
COPY --from=builder /shoopernmb/apps/server/openapi.json apps/server/openapi.json
COPY --from=builder /shoopernmb/apps/server/openapi.yaml apps/server/openapi.yaml

COPY --from=builder /shoopernmb/apps/web/.next/standalone .
COPY --from=builder /shoopernmb/apps/web/.next/static apps/web/.next/static
COPY --from=builder /shoopernmb/apps/web/public apps/web/public

RUN yarn install --production
RUN yarn prisma:seed
RUN yarn cache clean


FROM base AS runner

RUN addgroup --system --gid 1001 shoopernmb
RUN adduser --system --uid 1001 shoopernmb
USER shoopernmb

WORKDIR /shoopernmb

COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/node_modules node_modules
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/lerna.json lerna.json
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/nx.json nx.json
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/package.json package.json
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/tsconfig.json tsconfig.json

COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/packages/shared packages/shared
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/apps/server apps/server
COPY --from=prunner --chown=shoopernmb:shoopernmb /shoopernmb/apps/web apps/web
ENV NODE_ENV=production
CMD [ "sh" ]
