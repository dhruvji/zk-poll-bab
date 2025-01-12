import axios from "axios";
// TODO: Change the storage of the Merkle Tree to an S3 Bucket
async function castVote(nullifierHash: string, proof: string[], vote: number, pollId: number) {
    console.log("Casting vote")
    const response = await axios.post("https://priv-poll-relayer.onrender.com/submitVote", {
        nullifierHash: nullifierHash,
        vote: vote,
        proof: proof,
        pollId: pollId
    })
    console.log(response)
    return [response.data.name, response.data.txHash, response.data.pollId, response.data.success, response.data.errorMsg];

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
export {castVote}