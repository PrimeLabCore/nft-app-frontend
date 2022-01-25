import React from "react"
import UnclaimedNFTAlert from "./UnclaimedNFTAlert"

function Banners() {
  return (
    <div style={{ position: 'absolute', width: '100%', zIndex: 101 }}>
      <UnclaimedNFTAlert />
    </div>
  )
}

export default Banners
