import React, { useState, useRef } from 'react'
import Container from '../../components/Container'
import Head from 'next/head'

export default function GRONA() {
  return (
    <Container id="bar-page" className="py-4 md:py-8 lg:py-12" maxWidth="7xl">
      <Head>
        <title key="title">GRONA | CronaSwap</title>
        <meta key="description" name="description" content="Golden CRONA" />
      </Head>
    </Container>
  )
}
