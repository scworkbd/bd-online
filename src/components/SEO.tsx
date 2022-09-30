import Head from "next/head"
import React from "react"

const SEO = () => {
  const _title = `Dream Project`
  const _description = "Project of your dream. Get paid instantly"
  const _keywords = "Dream Project"
  const _author = "Dream Project"

  return (
    <Head>
      <title>{_title}</title>
      <meta name="title" content={_title} />
      <meta name="description" content={_description} />
      <meta name="author" content={_author} />
      <meta name="keywords" content={_keywords} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={_title} />
      <meta property="og:description" content={_description} />
      <meta property="og:image" content="/logo.png" />
      <meta property="og:image:secure_url" content="/logo.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content="dream project" />
    </Head>
  )
}

export default SEO
