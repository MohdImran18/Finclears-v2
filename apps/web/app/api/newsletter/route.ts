import { NextRequest, NextResponse } from "next/server";


export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    const {
      email,
    } = body;



    if (!email) {

      return NextResponse.json(
        {
          success: false,
          message: "Email is required"
        },
        {
          status: 400
        }
      );

    }



    /*
      TODO:
      Connect Laravel API

      POST:
      /api/v1/newsletter/subscribe

    */



    return NextResponse.json(
      {
        success: true,

        message:
          "Subscribed successfully",

        data: {
          email
        }

      },
      {
        status: 200
      }
    );


  } catch (error) {


    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to subscribe"
      },
      {
        status: 500
      }
    );


  }

}
