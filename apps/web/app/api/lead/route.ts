import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    const {
      name,
      email,
      phone,
      service,
      message,
    } = body;



    if (!name || !phone) {

      return NextResponse.json(
        {
          success:false,
          message:"Name and phone are required"
        },
        {
          status:400
        }
      );

    }



    /*
      TODO:
      Connect Laravel API

      POST:
      /api/v1/leads

    */


    return NextResponse.json(
      {

        success:true,

        message:
          "Lead submitted successfully",

        data:{
          name,
          email,
          phone,
          service,
          message
        }

      },
      {
        status:200
      }
    );


  } catch(error){


    return NextResponse.json(

      {
        success:false,
        message:"Unable to submit lead"
      },

      {
        status:500
      }

    );

  }

}
