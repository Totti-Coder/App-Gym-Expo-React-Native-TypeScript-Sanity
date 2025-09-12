import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"


export const config = {
  projectId: "3nthms13",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
};
export const client = createClient(config)

// Cliente admin (lectura + escritura) sin spread
const adminConfig = {
  projectId: "3nthms13",                // lo mismo que en config
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,                        // false = datos frescos
  token: process.env.SANITY_API_TOKEN,  // token para operaciones de escritura
  ignoreBrowserTokenWarning: true,      // opcional, útil en entornos mixtos
};
export const adminClient = createClient(adminConfig)

//Image Url Builder
const builder = imageUrlBuilder(config)
export const urlFor = (source: string) => builder.image(source)