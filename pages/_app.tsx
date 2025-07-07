import '@/styles/globals.css'
import { ChakraProvider, theme, ColorModeScript } from '@chakra-ui/react'
import { fonts } from '../lib/fonts'
import { SWRConfig } from 'swr'
import type { AppProps } from 'next/app'

const fetcher = <T,>(url: string): Promise<T> =>
  fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(
        `An error occurred while fetching data. Error status: ${response.status}`,
      )
    }
    return response.json() as Promise<T>
  })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-rubik: ${fonts.rubik.style.fontFamily};
          }
          body,
          html {
            height: 100%;
          }
        `}
      </style>
      <ChakraProvider theme={theme}>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ChakraProvider>
    </>
  )
}
