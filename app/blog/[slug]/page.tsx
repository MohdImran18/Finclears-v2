import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getBlogBySlug,
  getRelatedBlogs,
} from "@/services/blogs";

import StructuredData from "@/components/seo/StructuredData";

import {
  articleSchema,
} from "@/lib/seo/articleSchema";

import ArticleHero from "@/components/blog/ArticleHero";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleContent from "@/components/blog/ArticleContent";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import Comments from "@/components/blog/Comments";
import ArticleCTA from "@/components/blog/ArticleCTA";


const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";


interface Props {
  params: Promise<{
    slug: string;
  }>;
}



export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {

  const { slug } = await params;


  try {

    const article =
      await getBlogBySlug(slug);


    return {

      title:
        article.meta_title ??
        article.title,


      description:
        article.meta_description ??
        article.excerpt,


      keywords:
        article.meta_keywords,


      alternates:{
        canonical:
          `${SITE_URL}/blog/${slug}`,
      },


      openGraph:{

        type:"article",

        title:
          article.meta_title ??
          article.title,


        description:
          article.meta_description ??
          article.excerpt,


        images:
          article.featured_image
          ? [
              article.featured_image
            ]
          : [],

      },


      twitter:{

        card:
          "summary_large_image",

        title:
          article.meta_title ??
          article.title,


        description:
          article.meta_description ??
          article.excerpt,


        images:
          article.featured_image
          ? [
              article.featured_image
            ]
          : [],

      },

    };


  } catch {

    return {
      title:"Article Not Found",
    };

  }

}




export default async function BlogArticle({
  params,
}: Props) {


  const {
    slug
  } = await params;



  let article;

  let related:any[] = [];



  try {

    article =
      await getBlogBySlug(slug);


    related =
      await getRelatedBlogs(slug);


  } catch {

    notFound();

  }




  const schema =
    articleSchema({

      title:
        article.title,


      description:
        article.excerpt,


      image:
        article.featured_image ??
        undefined,


      url:
        `${SITE_URL}/blog/${article.slug}`,


      author:
        article.author_name ??
        "FinClears Editorial Team",


      publishedAt:
        article.published_at,


      updatedAt:
        article.updated_at ?? undefined,

    });




  return (

    <main>


      <StructuredData
        data={schema}
      />



      <ArticleHero

        category={
          article.category?.name ??
          "Business"
        }


        title={
          article.title
        }


        excerpt={
          article.excerpt
        }


        image={
          article.featured_image ??
          undefined
        }


        author={
          article.author_name ??
          "FinClears Editorial Team"
        }


        publishedAt={
          article.published_at
        }


        updatedAt={
          article.updated_at ?? undefined
        }


        readingTime={
          article.reading_time ??
          "5 min read"
        }

      />



      <section className="bg-white py-20">

        <div className="container mx-auto px-6">


          <div className="grid gap-12 lg:grid-cols-[280px_1fr_250px]">


            <aside>

          <TableOfContents

  headings={[]}

/>

            </aside>




            <article>


              <ArticleContent

                content={
                  article.content
                }

              />



              <AuthorCard

                name={
                  article.author_name ??
                  "FinClears Editorial Team"
                }


                role="FinClears Editorial Team"


                avatar=""


                bio="Expert content written and reviewed by FinClears professionals."


                articles={0}


                expertise={[
                  "Company Registration",
                  "GST",
                  "Income Tax",
                  "Trademark",
                  "ROC Compliance",
                ]}


                website={
                  SITE_URL
                }

              />



              <RelatedPosts
                posts={
                  related
                }
              />


              <Comments />


              <ArticleCTA />


            </article>




            <aside>

              <ShareButtons

                title={
                  article.title
                }


                url={
                  `${SITE_URL}/blog/${article.slug}`
                }

              />

            </aside>


          </div>

        </div>

      </section>


    </main>

  );

}