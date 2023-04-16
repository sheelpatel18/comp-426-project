import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('')
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(0);
    const [ready, setReady] = useState(false) // in case we need for some async operation. 
    const [buttonLoading, setButtonLoading] = useState(false) // in case we need for some async operation.
    const confirmationRef = useRef(null);
    const recaptchaRef = useRef(null);
    const userRaw = useSelector(state => state.user)
    const dispatch = useDispatch()

    // useEffect(() => {
    //   const firebaseConfig = {
    //     apiKey: "AIzaSyAny-oWiYX8Lj9LO4Qtnj-wfInL-We_O1M",
    //     authDomain: "comp426-383520.firebaseapp.com",
    //     projectId: "comp426-383520",
    //     storageBucket: "comp426-383520.appspot.com",
    //     messagingSenderId: "348482673610",
    //     appId: "1:348482673610:web:b3c4dedf38228678e18d33"
    //   };

    //   const app = initializeApp(firebaseConfig);

    // }, [])

    // window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    //   'size': 'invisible',
    //   'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     setReady(true);
    //   }
    // }, getAuth())

    useEffect(() => {
        const firebaseConfig = {
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
        try {
            setButtonLoading(true);
            if (step === 0) { // submit phone
                console.log("HERE")
                const verify = new RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible'
                }, getAuth())
                await API.post("`/users", {
                    phone: `+1${phoneNumber}`
                }).catch(console.error)
                const confirmation = await signInWithPhoneNumber(getAuth(), `+1${phoneNumber}`, verify)
                confirmationRef.current = confirmation;
                setStep(1);
            } else if (step === 1) { // submit otp
                const userCred = await confirmationRef.current.confirm(verificationCode);
                const id = userCred.user.uid
                const userRaw = await API.get(`/users/${id}`)
                const user = new User(userRaw)
                setUser(user.toJSON())
                setStep(2)
            } else if (step === 2) { // submit name
                const user = new User(userRaw)
                await API.patch(`/users/${user.id}`, {
                    name
                }).then(updatedUser => {
                    dispatch(
                        setUser(updatedUser)
                    )
                }).catch(console.error)
                setStep(-1) // no additional steps
            }
        } catch (err) {
            console.error(err);
        } finally {
            setButtonLoading(false);
        }
    };

    const RenderBox = () => {
        switch (step) {
            case 0:
                return (
                    <TextField
                        fullWidth
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                )
            case 1:
                return (
                    <TextField
                        fullWidth
                        label="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                )
            case 2:
                return (
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )
            default:
                return null
        }
    }

    return (ready && (
        <Overlay onClick={onClose}>
            <StyledCard onClick={(e) => e.stopPropagation()}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Login
                    </Typography>
                    <div id="recaptcha-container"></div>
                    <RenderBox />
                    <Box mt={2}>
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleNextClick}
                            loading={buttonLoading}
                        >
                            {step === 0 ? 'Next' : 'Submit'}
                        </LoadingButton>
                    </Box>
                </CardContent>
            </StyledCard>
        </Overlay>
    )) || <Loading />
};

export default LoginCard;