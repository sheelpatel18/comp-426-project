import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import Loading from '../Tools/Loading';
import {
    LoadingButton
} from "@mui/lab"
import { API } from '../Tools/api';
import { User } from '../Tools/user';
import { initializeApp } from 'firebase/app';
import { setUser } from "../redux/store"
import { useDispatch, useSelector } from 'react-redux';
// import { initializeApp } from 'firebase-admin/app';

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledCard = styled(Card)`
  padding: 1rem;
  min-width: 300px;
`;

const LoginCard = ({ onClose }) => {
    // we use refs instead of state because we don't want to re-render the component when the user types.
    // The text component already "Rerenders" when user types we don't need redundancy. 
    const phoneNumber = useRef("") 
    const name = useRef('')
    const verificationCode = useRef('')
    const [step, setStep] = useState(0); // 0 = phone, 1 = otp, 2 = name
    const [ready, setReady] = useState(false) // in case we need for some async operation. 
    const [buttonLoading, setButtonLoading] = useState(false) // in case we need for some async operation.
    const confirmationRef = useRef(null); // used to store confirmation object from firebase
    const userRaw = useSelector(state => state.user) // gets user data from redux store
    const dispatch = useDispatch() // used to dispatch actions to redux store


    useEffect(() => {
        const firebaseConfig = { // firebase client-side config. We use this for phone auth
            apiKey: "AIzaSyAny-oWiYX8Lj9LO4Qtnj-wfInL-We_O1M",
            authDomain: "comp426-383520.firebaseapp.com",
            projectId: "comp426-383520",
            storageBucket: "comp426-383520.appspot.com",
            messagingSenderId: "348482673610",
            appId: "1:348482673610:web:5658f9a8d52ac164e18d33"
        };
        initializeApp(firebaseConfig);
        setReady(true)
    }, [])

    const handleNextClick = async () => {
        // handles next button click on login card
        try {
            setButtonLoading(true); // start button loading
            if (step === 0) { // submit phone
                const verify = new RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible'
                }, getAuth()) // create recaptcha verifier
                await API.post("/user", { // create user in database
                    phone: `+1${phoneNumber.current}`
                })
                const confirmation = await signInWithPhoneNumber(getAuth(), `+1${phoneNumber.current}`, verify) // if api call is successful, send otp
                confirmationRef.current = confirmation; // store confirmation object
                setStep(1);
            } else if (step === 1) { // submit otp
                const userCred = await confirmationRef.current.confirm(verificationCode.current); // confirm otp
                const id = userCred.user.uid // get user id
                const userRaw = await API.get(`/user/${id}`) // get user data from database
                const user = new User(userRaw) // create user object from database data
                dispatch(
                    setUser(user.toJSON()) // update redux store with user data
                )
                setStep(2)
            } else if (step === 2) { // submit name
                const user = new User(userRaw) // create user object from redux store data
                await API.patch(`/user/${user.id}`, { // update user in database
                    name : name.current
                }).then(updatedUser => { // if api call is successful, update redux store with new user data
                    dispatch(
                        setUser(updatedUser) // update redux store with user data
                    )
                })
                setStep(-1) // no additional steps
            } else {
                console.error('invalid step') // should never happen
            }
        } catch (err) {
            console.error(err);
        } finally {
            setButtonLoading(false); // stop button loading, no matter what happens
        }
    };

    const RenderBox = () => {
        switch (step) { // based on the step, render the appropriate input box
            case 0:
                return ( // if step is 0, render phone number input box
                    <TextField
                        disabled={buttonLoading}
                        fullWidth
                        label="Phone Number"
                        onChange={(e) => phoneNumber.current = e.target.value}
                    />
                )
            case 1:
                return ( // if step is 1, render verification code input box
                    <TextField
                        disabled={buttonLoading}
                        fullWidth
                        label="Verification Code"
                        onChange={(e) => verificationCode.current = e.target.value}
                    />
                )
            case 2:
                return ( // if step is 2, render name input box
                    <TextField
                        disabled={buttonLoading}
                        fullWidth
                        label="Name"
                        onChange={(e) => name.current = e.target.value}
                    />
                )
            default:
                return null
        }
    }

    return (ready && ( // do not render until firebase is ready
        <Overlay onClick={onClose}>
            <StyledCard onClick={(e) => e.stopPropagation()}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Login
                    </Typography>
                    <div id="recaptcha-container"></div> {/* recaptcha container */}
                    <RenderBox /> {/* render input box based on step */}
                    <Box mt={2}>
                        <LoadingButton // render next button, loads when clicked and stopped according to the flow above
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleNextClick}
                            loading={buttonLoading}
                        >
                            {step === 0 ? 'Next' : 'Submit'} {/* if step is 0, button says next, otherwise it says submit */}
                        </LoadingButton>
                    </Box>
                </CardContent>
            </StyledCard>
        </Overlay>
    )) || <Loading /> // if firebase is not ready, render loading component
};

export default LoginCard;