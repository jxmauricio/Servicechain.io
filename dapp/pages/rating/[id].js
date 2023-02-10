import { useRouter } from 'next/router'
import React from 'react'

function id() {
  const router = useRouter()
  const myid = router.query.id;
  return (
    <div>{myid}</div>
  )
}

export default id