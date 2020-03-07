/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import { HeaderSlim, SiteLogo } from "@massds/mayflower-react"
import "./layout.scss"
import logo from '../images/stateseal.png';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const siteLogoProps = {
    url: {
      domain: 'https://www.mass.gov/'
    },
    image: {
      src: logo,
      alt: 'Massachusetts state seal',
      width: 45,
      height: 45
    },
    siteName: 'Mayflower',
    title: 'Mayflower homepage'
  }
  const siteLogo = <SiteLogo {...siteLogoProps} />
  return (
    <>
      <HeaderSlim siteTitle={data.site.siteMetadata.title} />
      <main id="main-content">
        <div className={`ma__container`}>
          { children }
        </div>
      </main>

    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
