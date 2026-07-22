import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest
) {

  try {

    const formData =
      await request.formData();


    const file =
      formData.get("file");


    if (!file) {

      return NextResponse.json(
        {
          success:false,
          message:"File is required"
        },
        {
          status:400
        }
      );

    }



    /*
      TODO:
      Connect Laravel Storage API

      POST:
      /api/v1/documents/upload

    */



    return NextResponse.json(
      {

        success:true,

        message:
          "File uploaded successfully",

        data:{
          filename:
            file instanceof File
              ? file.name
              : null
        }

      },
      {
        status:200
      }
    );


  } catch(error) {


    return NextResponse.json(
      {
        success:false,
        message:"Upload failed"
      },
      {
        status:500
      }
    );


  }

}
