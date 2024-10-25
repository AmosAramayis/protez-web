import { useEffect, useState, SyntheticEvent, RefObject } from 'react';
import { Link as RouterLink, useNavigate, useOutletContext } from 'react-router-dom';

// material-ui
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Theme, useTheme } from '@mui/material/styles';
import { Category, TableDocument } from 'iconsax-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
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
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { openSnackbar } from 'api/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { SnackbarProps } from 'types/snackbar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCreateProfilMutation, useGetMeQuery, useRegisterMutation } from 'services/request';
import MainCard from 'components/MainCard';
import UploadAvatar from 'components/third-party/dropzone/Avatar';
import UploadSingleFile from 'components/third-party/dropzone/SingleFile';
import UploadMultiFile from 'components/third-party/dropzone/MultiFile';
import MultipleSelect from 'sections/components-overview/select/MultipleSelect';
import uploadImageToBunny from 'utils/uploadImageToBunny';


const clinicData = [
  { label: "Oliver Hansen", id: "Oliver Hansen" },
  { label: "Van Henry", id: "Van Henry" },
  { label: "April Tucker", id: "April Tucker" },
  { label: "Ralph Hubbard", id: "Ralph Hubbard" },

];
const specializationData = [
  {
    id: "Orthopedic_Surgeon",
    label: "Orthopedic Surgeon",
  },
  {
    id: "Prosthetist",
    label: "Prosthetist",
  },
  {
    id: "Rehabilitation_Specialist",
    label: "Rehabilitation Specialist",
  },
  {
    id: "Physiotherapist",
    label: "Physiotherapist",
  },
  {
    id: "Occupational_Therapist",
    label: "Occupational Therapist",
  },
  {
    id: "Other",
    label: "Այլ",
  },

]
const experienceData = [
  {
    id: "1-5 years",
    label: "1-5 տարի",
  },
  {
    id: "6-10 years",
    label: "6-10 տարի",
  },
  {
    id: "11-15 years",
    label: "11-15 տարի",
  },
  {
    id: "16-20 years",
    label: "16-20 տարի",
  },
  {
    id: "More than 20 years",
    label: "Ավելի քան 20 տարի",
  },

]
const goalsData = [
  {
    id: "նպատակ համար 1",
    label: "նպատակ համար 1",
  },
  {
    id: "նպատակ համար 2",
    label: "նպատակ համար 2",
  },
  {
    id: "նպատակ համար 3",
    label: "նպատակ համար 3",
  },
  {
    id: "նպատակ համար 4",
    label: "նպատակ համար 4",
  },
  {
    id: "նպատակ համար 5",
    label: "նպատակ համար 5",
  },
  {
    id: "Այլ",
    label: "Այլ",
  },

]

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = { PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP } } };

function useInputRef() {
  return useOutletContext<RefObject<HTMLInputElement>>();
}

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister3() {
  const [imgValue, setImgValue] = useState()
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);
  const [specializationActiv, setSpecializationActiv] = useState("")
  const [list, setList] = useState(false);
  const [lists, setLists] = useState(false);
  const { register } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const [registerProfile, { data: registerProfileData, isSuccess }] = useRegisterMutation()
  const { data: getMeData } = useGetMeQuery({})
  const handleChangeDay = (event: SelectChangeEvent<string>, date: Date, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('dob', new Date(date.setDate(parseInt(event.target.value, 10))));
  };
  const handleChangeMonth = (event: SelectChangeEvent<string>, date: Date, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('dob', new Date(date.setMonth(parseInt(event.target.value, 10))));
  };
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  useEffect(() => {
    if (isSuccess) {
      navigate('/auth/register3', { replace: true });

    }
  }, [isSuccess])

  function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
  }
  console.log(getMeData, "getme");
 
  return (
    <>
      <Formik
        initialValues={{
          files: '',
          file: '',
          filesLic: '',
          email: '',
          phone: '',
          institution: '',
          position: '',
          specialization: [],
          specialization_other: '',
          experience: '',
          clinic: [],
          goals: [],
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          phone: Yup.number().required('Phone number is required'),
          institution: Yup.string().max(255).required('institution is required.'),
          position: Yup.string().max(255).required('position is required.'),
          experience: Yup.string().max(255).required('experience is required.'),
          // specialization: Yup.array().min(1, 'specialization is required.').required('specialization is required.'),
          clinic: Yup.array().min(1, 'clinic is required.').required('clinic is required.'),
          goals: Yup.array().min(1, 'goals is required.').required('goals is required.'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          console.log(values, "dddddddddd");
          const payload = {
            business_email: values?.email,
            business_phone: values?.phone,
            institution: values?.institution,
            position: values?.position,
            experience: values?.experience,
            clinics: values?.clinic,
            goals: values?.goals,
          //   specialization: values?.specialization_other ? [values?.specialization_other]?.map((item: any) => {
          //     return (
          //       {
          //         id: "specialization_other",
          //         label: item
          //       }
          //     )
          //   }) :
          //     //@ts-ignore
          //     values?.specialization?.map((item: any) => {
          //       return (
          //         {
          //           value: item?.name?.replace(" ", "_"),
          //           label: item?.name
          //         }
          //       )
          //     })
          //   ,
          }
          registerProfile({ id: getMeData?.result?.doctor?.id, payload })
          // try {
          //   console.log(values, "valuesvaluesvaluesvalues")            
          //   crateProfile({
          //     email:values?.email,
          //     last_name: values?.lastname,
          //     birth_day: values?.dob,
          //     phone_number: null,
          // })
          // if (scriptedRef.current) {
          //   setStatus({ success: true });
          //   setSubmitting(false);
          //   openSnackbar({
          //     open: true,
          //     message: 'Your registration has been successfully completed.',
          //     variant: 'alert',
          //     alert: {
          //       color: 'success'
          //     }
          //   } as SnackbarProps);

          // setTimeout(() => {
          //   navigate('/login', { replace: true });
          // }, 1500);
          // }
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
        {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className='scrollDiv'></div>
            <Grid container spacing={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl sx={{ width: '100%' }}>
                    <Stack alignItems="center">
                      <Stack spacing={1.5} alignItems="center">
                        <UploadAvatar setFieldValue={ (e: any) => {
                          console.log(e,"event");
                            const uploadFiles = async () => {
                                try {
                                    const result = await uploadImageToBunny({
                                        files: Object.values(e),
                                        dir: 'profile',
                                    });
                                    console.log(result, "resulttttt")
                                    setFieldValue('avatar', result?.[0]);
                                    // @ts-ignore
                                    setImgValue(result?.[0]);
                                    localStorage.setItem("fileType", "image")
                                } catch (error) {
                                    console.error('Upload failed:', error);
                                }
                            };
                            uploadFiles();
                        }}
                        //@ts-ignore
                          file={values.files} error={touched.files && !!errors.files}
                          />
                        <Stack spacing={0}>
                          <Typography align="center" variant="caption" color="secondary">
                            Allowed &apos;image/*&apos;
                          </Typography>
                          <Typography align="center" variant="caption" color="secondary">
                            *.png, *.jpeg, *.jpg, *.gif
                          </Typography>
                        </Stack>
                      </Stack>
                      {touched.files && errors.file && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.file as string}
                        </FormHelperText>
                      )}
                    </Stack>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                    <Button color="error" onClick={() => setFieldValue('files', null)}>
                      Cancel
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address</InputLabel>
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
                <Stack spacing={1}>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <PhoneInput
                  //@ts-ignore
                    error={Boolean(touched.phone && errors.phone)}
                    country={'am'}
                    value={values.phone}
                    onChange={(phone) => setFieldValue('phone', phone)}
                    // onChange={handleChange}
                    enableAreaCodes={true}
                    containerClass='custom-phone-input-container'
                    inputClass='custom-phone-input'
                    buttonClass='custom-flag-button'
                    masks={{ am: '(..) ..-..-..' }}
                    placeholder='+374'
                  />
                </Stack>
                {touched.phone && errors.phone && (
                  <FormHelperText error id="personal-phone-helper">
                    {errors.phone}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-institution">Where are you currently practicing or affiliated?</InputLabel>
                  <TextField
                    fullWidth
                    id="personal-institution"
                    value={values.institution}
                    name="institution"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Institution"
                  />
                </Stack>
                {touched.institution && errors.institution && (
                  <FormHelperText error id="personal-institution-helper">
                    {errors.institution}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="personal-position">What is your professional title or position?</InputLabel>
                  <TextField
                    fullWidth
                    id="personal-position"
                    value={values.position}
                    name="position"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Position"
                  />
                </Stack>
                {touched.position && errors.position && (
                  <FormHelperText error id="personal-position-helper">
                    {errors.position}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>What is your area of specialization?</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      value={values.specialization}
                      displayEmpty
                      name="specialization"
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Box sx={{ color: 'secondary.400' }}>Specialization</Box>;
                        }
                        return selected;
                        // return selected.join(', ');
                      }}
                      onChange={handleChange}
                      error={Boolean(errors.specialization && touched.specialization)}
                    >
                      <MenuItem disabled value="">
                        Specialization
                      </MenuItem>
                      {specializationData?.map((item: any, index: number) => {
                        console.log(values?.specialization,"valspesssss")
                        return (
                          <MenuItem value={item?.label} key={index}>{item?.label}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Stack>
                {touched.specialization && errors.specialization && <FormHelperText error={true}>{errors.specialization}</FormHelperText>}
              </Grid>

              {
                //@ts-ignore
              values?.specialization === "Ohter" &&
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="personal-specialization_other">Other</InputLabel>
                        <TextField
                          fullWidth
                          id="personal-specialization_other"
                          value={values.specialization_other}
                          name="specialization_other"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Other"
                        />
                      </Stack>
                      {touched.specialization_other && errors.specialization_other && (
                        <FormHelperText error id="personal-specialization_other-helper">
                          {errors.specialization_other}
                        </FormHelperText>
                      )}
                    </Grid>
                      }

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Experience</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      value={values.experience}
                      displayEmpty
                      name="experience"
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Box sx={{ color: 'secondary.400' }}>experience</Box>;
                        }
                        return selected;
                        // return selected.join(', ');
                      }}
                      onChange={handleChange}
                      error={Boolean(errors.experience && touched.experience)}
                    >
                      <MenuItem disabled value="">
                        Specialization
                      </MenuItem>
                   
                      
                      {experienceData?.map((item: any, index: number) => {
                        return (
                          <MenuItem value={item?.label} key={index}>{item?.label}</MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </Stack>
                {touched.experience && errors.experience && <FormHelperText error={true}>{errors.experience}</FormHelperText>}
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Clinic</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      name="clinic"
                      multiple
                      value={values.clinic}
                      onChange={handleChange}
                      error={Boolean(errors.clinic && touched.clinic)}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Box sx={{ color: 'secondary.400' }}>clinic</Box>;
                        }
                        return selected.join(', ');
                      }}
                    >
                      {clinicData?.map((name: any) => {
                        return (
                          <MenuItem key={name} value={name.label} style={getStyles(name, personName, theme)}>
                            {name.label}
                          </MenuItem>
                        )
                      }
                      )}
                    </Select>
                  </FormControl>
                </Stack>
                {touched.clinic && errors.clinic && <FormHelperText error={true}>{errors.clinic}</FormHelperText>}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel>Goals</InputLabel>
                  <FormControl sx={{ width: '100%' }}>
                    <Select
                      name="goals"
                      multiple
                      value={values.goals}
                      onChange={handleChange}
                      error={Boolean(errors.goals && touched.goals)}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Box sx={{ color: 'secondary.400' }}>goals</Box>;
                        }
                        return selected.join(', ');
                      }}
                    >
                      {goalsData?.map((name: any) => {
                        return (
                          <MenuItem key={name} value={name.label} style={getStyles(name, personName, theme)}>
                            {name.label}
                          </MenuItem>
                        )
                      }
                      )}
                    </Select>
                  </FormControl>
                </Stack>
                {touched.goals && errors.goals && <FormHelperText error={true}>{errors.goals}</FormHelperText>}
              </Grid>


              {/* <Grid item xs={12}>
                <MainCard
                  title="Professional License"
                  secondary={
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <IconButton color={list ? 'secondary' : 'primary'} size="small" onClick={() => setList(false)}>
                        <TableDocument style={{ fontSize: '1.15rem' }} />
                      </IconButton>
                      <IconButton color={list ? 'primary' : 'secondary'} size="small" onClick={() => setList(true)}>
                        <Category style={{ fontSize: '1.15rem' }} />
                      </IconButton>
                    </Stack>
                  }
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: '100%' }}>
                        <Stack spacing={1.5} alignItems="center">
                          <UploadMultiFile
                            showList={list}
                            setFieldValue={setFieldValue}
                            //@ts-ignore
                            files={values.files}
                            error={touched.files && !!errors.files}
                          />
                        </Stack>
                        {touched.files && errors.files && (
                          <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.files as string}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid> */}
{/* 
              <Grid item xs={12}>
                <MainCard
                  title="Relevant Certifications"
                  secondary={
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <IconButton color={lists ? 'secondary' : 'primary'} size="small" onClick={() => setLists(false)}>
                        <TableDocument style={{ fontSize: '1.15rem' }} />
                      </IconButton>
                      <IconButton color={lists ? 'primary' : 'secondary'} size="small" onClick={() => setLists(true)}>
                        <Category style={{ fontSize: '1.15rem' }} />
                      </IconButton>
                    </Stack>
                  }
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: '100%' }}>
                        <Stack spacing={1.5} alignItems="center">
                          <UploadMultiFile
                            showList={lists}
                            setFieldValue={setFieldValue}
                            //@ts-ignore
                            files={values.filesLic}
                            error={touched.filesLic && !!errors.filesLic}
                          />
                        </Stack>
                        {touched.filesLic && errors.filesLic && (
                          <FormHelperText error id="standard-weight-helper-text-password-login">
                            {errors.filesLic as string}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </MainCard>
              </Grid> */}


              {/* <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )} */}
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

