// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {relayVote} from './helpers/relayVote'
import prisma from '../../lib/prisma'
import { Prisma } from '@prisma/client'

/** 
 * @description: This is the API endpoint for submitting a vote via the relay.
 */

type Data = {
  name: string
  txHash: string
  pollId: number
  success: boolean
}

/** 
 * @function: handler
 * @description: This is the handler for the API endpoint.
 * @param {string} req.body.data.nullifierHash - The nullifier to submit to the smart contract.
 * @param {number} req.body.data.vote - The vote to submit to the smart contract {0,1}.
 * @param {string} req.body.data.proof - The ZK-proof of the vote.
 * @param {number} req.body.data.pollId - The poll id to submit to the smart contract.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      name: "POST endpoint", txHash: "", pollId: -1, success: false
    })
  }
  if (typeof req.body == 'string') {
    var body = JSON.parse(req.body)
  } else {
    var body = req.body
  }
  if ("data" in body == false) {
    res.status(400).json({
      name: "No data", txHash: "", pollId: -1, success: false
    })
  }
  var data = body.data

  var nullifierHash, vote, proof, pollId

  // Required fields!
  if ("nullifierHash" in data == false) {
    res.status(400).json({
      name: "Must pass in nullifierHash", txHash: "", pollId: -1, success: false
    })
  } else {
    nullifierHash = data.nullifierHash
  }
  if ("proof" in data == false) {
    res.status(400).json({
      name: "Must pass in a proof", txHash: "", pollId: -1, success: false
    })
  } else {
    vote = data.vote
  }
  if ("vote" in data == false) {
    res.status(400).json({
      name: "Must pass in a vote", txHash: "", pollId: -1, success: false
    })
  } else {
    proof = data.proof
  }
  if ("pollId" in data == false) {
    res.status(400).json({
      name: "Must pass in a poll id", txHash: "", pollId: -1, success: false
    })
  } else {
    pollId = data.pollId
  }

  var outputData = await relayVote(nullifierHash, vote, proof, pollId)

  return res.status(200).json({ name: "Voted!", txHash: outputData.txHash, pollId: pollId, success: outputData.success })

//   if (outputData.isValidPollId == false) {
//     return res.status(400).json({ name: "invalid poll id", inTree: false, pollId: pollId })
//   } else {
//     if (outputData.inTree == true) {
//       return res.status(200).json({ name: "address in tree", inTree: true, pollId: pollId })
//     } else {
//       return res.status(200).json({ name: "address not in tree", inTree: false, pollId: pollId })
//     }
//   }
  
  
}