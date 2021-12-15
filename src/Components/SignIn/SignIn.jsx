import React from 'react'
import styles from './SignIn.module.css'
import {useNavigate,Link} from "react-router-dom"
import { BsArrowLeftRight } from "react-icons/bs";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    inputfield: {
        margin: '10px 0px',
        width: '100%',
    },
    inputStyles: {
        textAlign: 'left',
        fontWeight: 600,
        fontSize: '19.2px',
        lineHeight: '23px',
        color: 'rgba(0, 0, 0, 0.91)'
    },
}));


const SignIn = () => {
    let navigate = useNavigate()
    const classes = useStyles();

    return (

        <>
            <div className={styles.half_container}>
                <div className={styles.childContainer}>
                    <BsArrowLeftRight className={styles.icon} />
                    <div className={styles.requestText}>
                        NEAR Labs<br />
                        is requesting to<br />
                        access your account.
                    </div>
                    <p className={styles.para}>
                        This does not allow the app to transfer<br /> any tokens.
                    </p>
                    <div className={styles.MoreInfo}>
                        More Info
                    </div>

                    {/* TEXT FIELD */}

                    <div className={styles.textField}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            variant="outlined"
                            value='Johndoe.near'
                            className={classes.inputfield}
                            fullWidth={true}
                            inputProps={{
                                className: classes.inputStyles,
                            }}

                        >
                            {/* this will be mapped by using map function */}
                            <MenuItem value={'Johndoe.near'}>
                                Johndoe.near
                            </MenuItem>
                            <MenuItem value={'Johndoe.near'}>
                                Johndoe.near
                            </MenuItem>
                            <MenuItem value={'Johndoe.near'}>
                                Johndoe.near
                            </MenuItem>
                        </TextField>
                    </div>

                    {/* BUTTON CONTAINER */}
                    <div className={styles.buttonContainer}>
                        <button onClick={() => navigate("/signup")} className={styles.secondary_button}>
                            Deny
                        </button>

                        <Link to={`/signup/create-account/${'Johndoe.near'}`} className={styles.primary_button}>
                            Allow
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
export default SignIn;