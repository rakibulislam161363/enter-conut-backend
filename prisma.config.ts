import { definePrismaConfig } from "prisma/config";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
import { defineConfig as composer } from "@prisma/composer/config";
import { nodeBuild } from "@prisma/composer/node/control";
import { prismaCloud, prismaState } from "@prisma/composer-prisma-cloud/control";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: "postgres://f014d11cd4839fdcf0fc99a60555e685a4f06cecf2e4115d40fcf499cb3324dc:sk_oB-Lr06_smLVfdLdkrD11@pooled.db.prisma.io:5432/postgres?sslmode=require",
    },
  }),
  composer: composer({
    extensions: [prismaCloud({ region: "us-east-1" }), nodeBuild()],
    state: prismaState(),
  }),
});
