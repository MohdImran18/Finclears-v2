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
      subject,
      message,
    } = body;



    if (!name || !email) {

      return NextResponse.json(
        {
          success:false,
          message:"Name and email are required"
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
      /api/v1/contact

    */



    return NextResponse.json(
      {
        success:true,

        message:
          "Contact request submitted successfully",

        data:{
          name,
          email,
          phone,
          subject,
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
        message:"Unable to submit contact request"
      },

      {
        status:500
      }

    );


  }

}
