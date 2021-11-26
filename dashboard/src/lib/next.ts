import { FC } from "react"
import { InferGetServerSidePropsType } from "next"

export type SSRPage<GSP> = FC<InferGetServerSidePropsType<GSP>>
