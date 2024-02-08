-- CreateTable
CREATE TABLE "PoolOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,

    CONSTRAINT "PoolOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PoolOption" ADD CONSTRAINT "PoolOption_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
