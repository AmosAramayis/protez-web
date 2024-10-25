import { useEffect, useState, SyntheticEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { SnackbarProps } from 'types/snackbar';
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { useLoginEmailMutation } from 'services/request';
import { ThemeContext } from '@emotion/react';
import { setEmail } from 'services/slice/email';
import { useAppDispatch } from 'services/store';


// ============================|| JWT - REGISTER ||============================ //
export default function AuthRegister() {
  const { register } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [loginEmail, { data: loginMailData, isSuccess, isLoading: loginLoading }] = useLoginEmailMutation()
  const dispatch = useAppDispatch();

  return (
    <>
      <Formik
        initialValues={{email: '', submit: null}}
        validationSchema={Yup.object().shape({email: Yup.string().email('Must be a valid email').max(255).required('Email is required')})}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          loginEmail({email:values?.email});
          if(values?.email){
            dispatch(setEmail(values?.email))
            navigate('/auth/code-verification2', { replace: true });
          }
          
          // try {
          //   await register(values.email);
          //   if (scriptedRef.current) {
          //     setStatus({ success: true });
          //     setSubmitting(false);
          //     openSnackbar({
          //       open: true,
          //       message: 'Your registration has been successfully completed.',
          //       variant: 'alert',
          //       alert: {
          //         color: 'success'
          //       }
          //     } as SnackbarProps);

          //     // setTimeout(() => {
          //     //   navigate('/auth/code-verification2', { replace: true });
          //     // }, 1500);
          //   }
          // } catch (err: any) {
          //   console.error(err);
          //   if (scriptedRef.current) {
          //     setStatus({ success: false });
          //     setErrors({ submit: err.message });
          //     setSubmitting(false);
          //   }
          // }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@company.com"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                {/* <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography> */}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}