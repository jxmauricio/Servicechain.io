import React from 'react'
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
function hub() {
  //gets our current url
  const {asPath} = useRouter();
  return (
    <>
     <Button>
        <Link href={`${asPath}/tip`}>
          Send Tip!
        </Link>
      </Button>
      <Button>
        <Link href={`${asPath}/rating`}>
            Send Rating!
        </Link>
      </Button>
      <Button>
        <Link href={`${asPath}/hours`}>
          Log Hours!
        </Link>
      </Button>
    
    </>
   
  )
}

export default hub;