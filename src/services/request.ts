import { createApi } from '@reduxjs/toolkit/query/react'

import axiosBaseQuery from './API'
import { CreateProfile, LoginCode, LoginEmail } from '../type';

export const requestApi = createApi({
  reducerPath: 'requestApi',
  tagTypes: ["LoginEmail","LoginCode","CreateProfil","Register","GetMe","PatientList","PatientById"],
  baseQuery: axiosBaseQuery({
    baseUrl: "http://68.183.3.120:4000/api/",
  }),
  endpoints: (builder) => ({
    loginEmail: builder.mutation<any, any>({
      query(payload) {
        return {
          url: `user/auth/doctor/sign_in`,
          method: 'POST',
          data: payload,
        }
      },
      invalidatesTags: [{ type: 'LoginEmail' }],
    }),
      
    loginCode: builder.mutation<any, any>({
      query(payload) {
        return {
          url: `user/auth/verify_otp`,
          method: 'POST',
          data: payload,
        }
      },
      invalidatesTags: [{ type: 'LoginCode' }],
    }),
    createProfil: builder.mutation<any, CreateProfile>({
      query(payload) {
        return {
          url: `user/update_me`,
          method: 'PUT',
          data: payload,
        }
      },
      invalidatesTags: [{ type: 'CreateProfil' }],
    }),
    register: builder.mutation<any, any>({
      query({payload, id}) {
        return {
          url: `user/doctor/${id}`,
          method: 'PUT',
          data: payload,
        }
      },
      invalidatesTags: [{ type: 'Register' }],
    }),
    getMe: builder.query<any,any>({
      query() {
        return {
          url: `user/me`,
          method: 'GET',
        }
      },
      providesTags: [{ type: 'GetMe' }],
    }),
    patientList: builder.mutation<any, any>({
      query(doctorId) {
        return {
          url: `user/admin/patient/by_doctor/${doctorId}`,
          method: 'GET',
        }
      },
      invalidatesTags: [{ type: 'PatientList' }],
    }),
    patientById: builder.mutation<any, any>({
      query({id}) {
        return {
          url: `user/admin/patient/${id}`,
          method: 'GET',
        }
      },
      invalidatesTags: [{ type: 'PatientById' }],
    }),

  }),
})

export const {
  useLoginEmailMutation,
  useLoginCodeMutation,
  useCreateProfilMutation,
  useRegisterMutation,
  useGetMeQuery,
  usePatientListMutation,
  usePatientByIdMutation,
} = requestApi
