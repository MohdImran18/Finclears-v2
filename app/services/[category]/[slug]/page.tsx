import { notFound } from "next/navigation";
import type { Metadata } from "next";

import StructuredData from "@/components/seo/StructuredData";

import { serviceSchema } from "@/lib/seo/serviceSchema";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbSchema";
import { faqSchema } from "@/lib/seo/faqSchema";

import Breadcrumb from "@/components/services/Breadcrumb";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceDocuments from "@/components/services/ServiceDocuments";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceCTA from "@/components/services/ServiceCTA";


const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";


const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";


interface Props {

  params: Promise<{
    category:string;
    slug:string;
  }>;

}



async function getService(
  slug:string
){

  const response =
    await fetch(
      `${API}/v1/services/${slug}`,
      {
        next:{
          revalidate:3600,
        },
      }
    );


  if(!response.ok){
    return null;
  }


  const json =
    await response.json();


  return json.data.service;

}




async function getRelated(
  category:string
){

  const response =
    await fetch(
      `${API}/v1/services`,
      {
        next:{
          revalidate:3600,
        },
      }
    );


  if(!response.ok){
    return [];
  }


  const json =
    await response.json();


  return (
    json.data.services ?? []
  ).filter(
    (item:any)=>
      item.category?.slug === category
  );

}





export async function generateMetadata({
  params,
}:Props):Promise<Metadata>{


  const {
    slug,
  } = await params;


  const service =
    await getService(slug);



  if(!service){

    return {
      title:"Service Not Found",
    };

  }



  const canonical =
    `${SITE_URL}/services/${service.category.slug}/${service.slug}`;



  return {

    title:
      service.meta_title ??
      service.title,


    description:
      service.meta_description ??
      service.description,



    alternates:{
      canonical,
    },


    openGraph:{

      type:"website",

      url:canonical,


      title:
        service.meta_title ??
        service.title,


      description:
        service.meta_description ??
        service.description,


      images:
        service.featured_image
        ? [
            {
              url:
                service.featured_image,

              width:1200,

              height:630,

              alt:
                service.title,
            },
          ]
        : [],

    },



    twitter:{

      card:
        "summary_large_image",


      title:
        service.meta_title ??
        service.title,


      description:
        service.meta_description ??
        service.description,

    },

  };

}





export default async function ServicePage({
  params,
}:Props){


  const {
    category,
    slug,
  } = await params;



  const service =
    await getService(slug);



  if(!service){

    notFound();

  }




  const related =
    (
      await getRelated(category)
    )
    .filter(
      (item:any)=>
        item.id !== service.id
    );





  const serviceJson =
    serviceSchema({

      name:
        service.title,


      description:
        service.meta_description ??
        service.description,


      url:
        `${SITE_URL}/services/${category}/${slug}`,



      image:
        service.featured_image,


      price:
        service.starting_price,

    });






  const breadcrumbJson =
    breadcrumbSchema([

      {
        name:"Home",

        url:SITE_URL,
      },


      {
        name:"Services",

        url:
          `${SITE_URL}/services`,
      },


      {
        name:
          service.category?.name ??
          service.category?.slug,


        url:
          `${SITE_URL}/services/${service.category.slug}`,
      },


      {
        name:
          service.title,


        url:
          `${SITE_URL}/services/${category}/${slug}`,
      },

    ]);







  const faqJson =
    faqSchema(

      service.faqs?.map(
        (item:any)=>({

          question:
            item.question ??
            item.title ??
            "",


          answer:
            item.answer ??
            item.description ??
            "",

        })
      )
      .filter(
        (item:any)=>
          item.question &&
          item.answer
      )
      ??
      []

    );







  return (

    <main>


      <StructuredData
        data={serviceJson}
      />


      <StructuredData
        data={breadcrumbJson}
      />


      {
        service.faqs?.length > 0 && (

          <StructuredData
            data={faqJson}
          />

        )
      }




      <div className="container mx-auto px-6 pt-6">


        <Breadcrumb

          category={
            service.category.slug
          }


          title={
            service.title
          }

        />


      </div>





      <ServiceHero
        service={service}
      />





      <ServiceBenefits

        benefits={

          service.benefits?.map(
            (item:any)=>

              item.title ??
              item.name ??
              item.description

          ) ?? []

        }

      />






      <ServicePricing

        price={
          service.starting_price
        }


        priceLabel={
          service.price_label
        }


        features={

          service.pricing?.map(
            (item:any)=>

              item.title ??
              item.name

          ) ?? []

        }

      />






      <ServiceProcess

        steps={

          service.processes?.map(
            (item:any)=>

              item.title ??
              item.name

          ) ?? []

        }

      />






      <ServiceDocuments

        documents={

          service.documents?.map(
            (item:any)=>

              item.title ??
              item.name

          ) ?? []

        }

      />






      <ServiceFAQ

        faqs={
          service.faqs ?? []
        }

      />






      <RelatedServices

        services={
          related
        }

      />






      <ServiceCTA />



    </main>

  );

}