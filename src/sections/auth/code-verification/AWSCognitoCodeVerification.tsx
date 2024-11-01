import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

// Third party
import OtpInput from 'react18-input-otp';
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';

import { ThemeMode } from 'config';
import { openSnackbar } from 'api/snackbar';

// types
import { SnackbarProps } from 'types/snackbar';

// assets
import { Warning2 } from 'iconsax-react';
import { useAppDispatch, useAppSelector } from 'lib/hooks';
import { useLoginCodeMutation } from 'services/request';

// ============================|| AWS COGNITO - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification() {
  //@ts-ignore
  const { codeVerification, resendConfirmationCode } = useAuth();
  const scriptedRef = useScriptRef();
  const theme = useTheme();
  const navigate = useNavigate();

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;


  
  return (
    <Formik
      initialValues={{
        otp: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string().max(255).required('Verification Code is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

        try {
          // set code verification method here
          await codeVerification(values.otp)
            .then(() => {
              setSubmitting(false);
              openSnackbar({
                open: true,
                message: 'Account verify successfully.',
                variant: 'alert',
                alert: {
                  color: 'success'
                }
              } as SnackbarProps);
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 1500);

              // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
              // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
              // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
              // github issue: https://github.com/formium/formik/issues/2430
            })
            .catch((err: any) => {
              setStatus({ success: false });
              setErrors({ submit: err || JSON.stringify(err) });
              setSubmitting(false);
            });
        } catch (err: any) {
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleSubmit, touched, values, setFieldValue, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="verification-code">Enter Verification Code</InputLabel>
                <OtpInput
                  value={values.otp}
                  onChange={(otp: any) => setFieldValue('otp', otp)}
                  numInputs={6}
                  isInputNum
                  containerStyle={{ justifyContent: 'space-between' }}
                  inputStyle={{
                    width: '100%',
                    margin: '4px',
                    padding: '16px',
                    border: '1px solid ',
                    borderColor: { borderColor },
                    borderRadius: 4,
                    ':hover': {
                      borderColor: theme.palette.primary.main
                    }
                  }}
                  focusStyle={{
                    outline: 'none',
                    boxShadow: theme.customShadows.primary,
                    border: '1px solid',
                    borderColor: theme.palette.primary.main
                  }}
                />
              </Stack>
              {touched.otp && errors.otp && (
                <FormHelperText error id="helper-text-password-reset">
                  {errors.otp}
                </FormHelperText>
              )}
            </Grid>
            {touched && errors && errors.submit && (
              <Grid item xs={12}>
                <Alert color="error" variant="border" icon={<Warning2 variant="Bold" color={theme.palette.error.main} />}>
                  {errors?.submit}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Verify Account
                </Button>
              </AnimateButton>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography>Did not receive the email? Check spam folder or</Typography>
                {/* need to impletement resend code */}
                <Typography
                  onClick={resendConfirmationCode}
                  variant="body1"
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
                  color="primary"
                >
                  Resend code
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
