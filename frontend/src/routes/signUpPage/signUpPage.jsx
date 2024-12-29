import './signUpPage.css'
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  

  return (
    <div className="signUpPage">
      <SignUp path="/sign-up" signInUrl="sign-in"/>
    </div>
  )
}

export default SignUpPage