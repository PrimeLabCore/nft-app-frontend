import React from 'react'
import useRedirectIfUserLoggedIn from '../common/hooks/useRedirectIfUserLoggedIn';
import SignUpWith from '../Components/SignUp/SignUpWith';

const SignUp = () => {
  useRedirectIfUserLoggedIn();
  return (
    <div>
      <SignUpWith />
    </div>
  )
}

export default SignUp;