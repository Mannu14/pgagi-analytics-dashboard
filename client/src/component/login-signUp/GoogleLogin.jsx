import React from 'react';
const GoogleLoginUse = () => {
    const apiUrlProcess = `${window.location.origin}`;
    const loginWithGoogle =()=>{
        window.open(`${apiUrlProcess}/auth/google/callback`,"_self")
    }
    return (<>
        <div onClick={loginWithGoogle}>Sign in with Google</div>
    </>)
}
export default GoogleLoginUse