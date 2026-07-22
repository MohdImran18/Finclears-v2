export function articleSchema(data:{
title:string;
description:string;
image?:string;
url:string;
author:string;
publishedAt:string;
updatedAt?:string;
}){

return {

"@context":"https://schema.org",

"@type":"Article",

headline:data.title,

description:data.description,

image:data.image,

url:data.url,

author:{
"@type":"Person",
name:data.author
},

publisher:{
"@type":"Organization",
name:"FinClears",
url:"https://finclears.com"
},

datePublished:data.publishedAt,

dateModified:
data.updatedAt ?? data.publishedAt

};

}
