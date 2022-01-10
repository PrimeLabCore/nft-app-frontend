import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

import request from '../../Services/httpClient'
import NFT_STATUSES from '../../constants/nftStatuses'

function UnclaimedNFTAlert() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.authReducer)

  const [nfts, setNFTs] = useState([])

  useEffect(() => {
    async function getNFTs() {
      const { data: { data } } = await request({ url: `/nfts?user_id=${user.user_id}` })
      const unclaimedNFTs = data.filter(nft => nft.status === NFT_STATUSES.unclaimed)
      setNFTs(unclaimedNFTs)
    }

    if (user) {
      getNFTs()
    }
  }, [])

  function handleNftClick(nft) {
    navigate(`/nft/detail/claim/${nft.nft_id}`)
  }

  if (nfts.length > 0) {
    return (
      <>
        {nfts.map(nft => (
          <Alert key={nft.nft_id}>
            You received an NFT. Claim it{" "}
            <Alert.Link href="#" onClick={() => handleNftClick(nft)}>here</Alert.Link>
          </Alert>
        ))}
      </>
    )
  }

  return null
}

export default UnclaimedNFTAlert
