import { defineConfig } from 'tinacms';

import About from './collection/about';
import Awards from './collection/awards';
import Contact from './collection/contact';
import Customers from './collection/customers';
import Global from './collection/global';
import Home from './collection/home';
import Page from './collection/page';
import Partners from './collection/partners';
import Post from './collection/post';
import PostListing from './collection/post-listing';
import Product from './collection/product';
import Solution from './collection/solution';
import SolutionListing from './collection/solution-listing';

const branch = process.env.NEXT_PUBLIC_TINA_BRANCH || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';

export default defineConfig({
  telemetry: 'disabled',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID as string,
  branch,
  token: process.env.TINA_TOKEN as string,
  media: {
    // Git-backed media: uploads land in `public/img/` and are committed
    // to the repository alongside the content that references them.
    tina: {
      publicFolder: 'public',
      mediaRoot: 'img',
    },
  },
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  schema: {
    collections: [Global, Home, About, Contact, Customers, Partners, Awards, SolutionListing, Solution, Product, PostListing, Post, Page],
  },
});
