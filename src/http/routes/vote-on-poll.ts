import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviouesVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })


      if (userPreviouesVoteOnPoll && userPreviouesVoteOnPoll.poolOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userPreviouesVoteOnPoll.id,
          }
        })
      } else if (userPreviouesVoteOnPoll) {
        return reply.status(400).send({
          message: 'You already voted on this poll'
        })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, //30 days
        signed: true,
        httpOnly: true
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        poolOptionId: pollOptionId,
      }
    })

    return reply.status(201).send({ sessionId })
  })
}