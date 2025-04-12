'use client';
import Compiler from '../Compiler/page';
import Head from 'next/head';

const Home = () => {
  return (
   <>
    <div>
      <Head>
        <title>Code Compiler</title>
        <meta name="description" content="Tech Platform" />
        <link rel="icon" href="/Hack_Coding.jpeg" />
      </Head>
        <Compiler />
      </div>
   </>
  );
}

export default Home;